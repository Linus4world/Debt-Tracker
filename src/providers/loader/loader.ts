import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Group } from '../../models/group.model';
import { Observable } from 'rxjs';
import { AccountDetails } from '../../models/accountdetails.model';
import { AccountProvider } from '../account/account';
import { NemMonitorProvider } from '../nem/monitor';
import { UInt64, Transaction } from 'nem2-sdk';
import { GroupStorage } from '../../models/groupstorage';
import { NemReactorProvider } from '../nem/reactor';


@Injectable()
export class LoaderProvider {

  /**
   * If true, example groups and friends will be loaded
   */
  private readonly _useMockData: boolean = true;
  /**
   * If true, data gets stored on the phone/computer persistently
   */
  private readonly _storeData: boolean = true;

  private _groups: Array<Group> = [];
  private _friends: Array<Group> = [];
  private _groups_mock: Group[];
  private _friends_mock: Group[];

  private _observer: { next: (arg0: number) => void; };
  private _overAllBalance = 0;
  private _groupSubscriber;
  private _observedGroup: Group;

  private readonly GROUPS_KEY = 'GROUPS';
  private readonly FIRENDS_KEY = 'FRIENDS';
  private readonly ACCOUNT_KEY = 'ACCOUNT';

  public overAllBalance$: Observable<number>;
  public group_list$: Observable<Group[]>;
  private _group_list_observer;
  public friends_list$: Observable<Group[]>;
  private _friends_list_observer;

  constructor(public http: HttpClient,
    public storage: Storage, public account: AccountProvider, public monitor: NemMonitorProvider, private reactor: NemReactorProvider) {

  }

  public init() {
    console.log("start to load files....")
    if (this._useMockData) {
      this.setupGroupsMock();
      this.setupFriendsMock();
    }
    return Promise.all([this.loadGroups(), this.loadFriends()]).then((values) =>
      this.updateBalance()).then(() => {
        this.overAllBalance$ = Observable.create((observer) => {
          this._observer = observer;
          observer.next(this._overAllBalance);
        });
        this.group_list$ = Observable.create((observer) => {
          this._group_list_observer = observer;
          observer.next(this._groups);
        });
        this.friends_list$ = Observable.create((observer) => {
          this._friends_list_observer = observer;
          observer.next(this._friends);
        });
        this.loadLatestTransactions()
      }).then(() => console.log('Everything is loaded!'));
  }

  //CHANGE

  public registerGroupSubscriber(groupID: string): Observable<Group>{
    return Observable.create((observer) => {
      this._groupSubscriber = observer;
      this._observedGroup = this.getGroup(groupID);
      observer.next(this._observedGroup);
    })
  }

  public update(){
    if(this._groupSubscriber !== undefined){
      this._groupSubscriber.next(this._observedGroup);
    }
    if (this._group_list_observer !== undefined) {
      this._group_list_observer.next(this._groups);
    }
    if (this._friends_list_observer !== undefined) {
      this._friends_list_observer.next(this._friends);
    }
  }

  public addGroup(group: Group) {
    this._groups.push(group);
    this.storeGroups(this.GROUPS_KEY, this._groups);
    this._group_list_observer.next(this._groups);
  }

  public addMember(groupID, username, address){
    let g = this.getGroup(groupID);
    g.members.set(address, username);
    g.balances.set(address, 0);
    this.storeGroups(this.GROUPS_KEY, this._groups);
    if(groupID === this._observedGroup.id){
      this._groupSubscriber.next(this._observedGroup);
    }
  }

  public removeGroup(groupID: string) {
    let new_group_list = [];
    for (let g of this._groups) {
      if (g.id !== groupID) {
        new_group_list.push(g);
      }
    }
    this._groups = new_group_list;
    if (this._group_list_observer !== undefined) {
      this._group_list_observer.next(this._groups);
    }
    let new_friend_list = [];
    for (let f of this._friends) {
      if (f.id !== groupID) {
        new_friend_list.push(f);
      }
    }
    this._friends = new_friend_list;
    if (this._friends_list_observer !== undefined) {
      this._friends_list_observer.next(this._friends);
    }
    console.log('Removed group!');
    this.saveGroups(this._groups);
    this.saveFriends(this._friends);
    this.updateBalance();
  }

  public addFriend(friend: Group) {
    this._friends.push(friend);
    this.storeGroups(this.FIRENDS_KEY, this._friends);
    this._friends_list_observer.next(this._friends);
  }

  public updateBalance(groups?: Group[]) {
    if (groups !== undefined) {
      console.log('Updated groups!')
      this._groups = groups;
    }
    console.log('Updating balances...');
    this._overAllBalance = this.getOverallBalance();
    if (this._observer !== undefined) {
      this._observer.next(this._overAllBalance);
    }
  }

  public loadLatestTransactions(): Promise<void> {
    return this.reactor.loadLatestTransactions(this);
  }

  //GET

  public getGroups() {
    if (this._groups !== []) {
      return this._groups;
    } else {
      this.loadGroups();
      return this._groups;
    }
  }

  public getFriends() {
    if (this._friends !== []) {
      return this._friends
    } else {
      this.loadFriends();
      return this._friends;
    }
  }

  public getLatestTransactions(): Transaction[] {
    return this.reactor.getLatestTransactions();
  }

  private getOverallBalance() {
    let overAllBalance = 0;
    for (let g of this._groups) {
      overAllBalance += g.balances.get(this.account.getAdress());
    }
    for (let f of this._friends) {
      overAllBalance += f.balances.get(this.account.getAdress());
    }
    return overAllBalance;
  }


  public getGroup(groupID: string): Group {
    if (this._groups !== undefined && this._groups !== null) {
      for (let g of this._groups) {
        if (g.id === groupID) { return g }
      }
    }
    if (this._friends !== undefined && this._friends !== null) {
      for (let f of this._friends) {
        if (f.id === groupID) { return f }
      }
    }
    return null;
  }

  //LOADING

  private loadGroups() {
    console.log('Loading Groups...');
    return this.storage.get(this.GROUPS_KEY).then((data) => {
      if (data !== null) {
        let storageGroups: GroupStorage[] = JSON.parse(data);
        for (let groupStorage of storageGroups) {
          this._groups.push(this.groupStorageToGroup(groupStorage));
        }
      } else if (this._useMockData) {
        console.log("using mocks for groups...");
        this._groups = this._groups_mock;
      }
    });
  }

  private loadFriends() {
    console.log('Loading Friends...');
    return this.storage.get(this.FIRENDS_KEY).then((data) => {
      if (data !== null) {
        let storageGroups: GroupStorage[] = JSON.parse(data);
        for (let groupStorage of storageGroups) {
          this._friends.push(this.groupStorageToGroup(groupStorage));
        }
      } else if (this._useMockData) {
        console.log("Using mocks for friends...");
        this._friends = this._friends_mock;
      }
    });
  }


  //STORING

  public saveAccount(account: AccountDetails) {
    this.saveObjects(this.ACCOUNT_KEY, account);
  }

  private saveGroups(groups: Group[]) {
    this._groups = groups;
    this.storeGroups(this.GROUPS_KEY, groups);
  }

  private saveFriends(friends: Group[]) {
    this._friends = friends;
    this.storeGroups(this.FIRENDS_KEY, friends);
  }

  private saveObjects(key: string, obj: any) {
    if (this._storeData) {
      this.storage.set(key, JSON.stringify(obj)).then(() => {
        console.log('Stored ' + key + ' successfully!')
      }, (err) => {
        console.log('ERROR writing ' + key + ' ' + err);
      })
    }
  }

  private storeGroups(key: string, groups: Group[]) {
    let obj: GroupStorage[] = [];
    for (let group of groups) {
      obj.push(this.groupToGroupStorage(group));
    }

    if (this._storeData) {
      this.storage.set(key, JSON.stringify(obj)).then(() => {
        console.log('Stored ' + key + ' successfully!')
      }, (err) => {
        console.log('ERROR writing ' + key + ' ' + err);
      })
    }
  }

  private groupStorageToGroup(groupStorage: GroupStorage): Group {
    return (groupStorage === null) ? null : {
      id: groupStorage.id,
      name: groupStorage.name,
      blockHeight: groupStorage.blockHeight,
      members: new Map(groupStorage.members),
      balances: new Map(groupStorage.balances)
    }
  }

  private groupToGroupStorage(group: Group): GroupStorage {
    return (group === null) ? null : {
      id: group.id,
      name: group.name,
      members: Array.from(group.members.entries()),
      balances: Array.from(group.balances.entries()),
      blockHeight: group.blockHeight
    }
  }

  public saveAll() {
    this.saveGroups(this._groups);
    this.saveFriends(this._friends);
    this.saveAccount(this.account.getSelf());
    console.log('Stored everything! Ready to reboot.')
  }

  clearAll() {
    this.storage.clear();
    console.log('Cleared everything! Ready to reboot.')
  }



  //MOCKS

  private setupFriendsMock() {
    let m1: Map<string, string> = new Map<string, string>();
    let b1: Map<string, number> = new Map<string, number>();
    let f1: Group = { id: "3", name: "Nicolas", members: m1, balances: b1, blockHeight: UInt64.fromUint(0) };

    m1.set(this.account.getAdress(), this.account.getName());
    m1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 'Nicolas');
    b1.set(this.account.getAdress(), -53);
    b1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 53);

    this._friends_mock = [f1];
  }

  private setupGroupsMock() {
    //Members
    let m1: Map<string, string> = new Map<string, string>();
    let m2: Map<string, string> = new Map<string, string>();
    let m3: Map<string, string> = new Map<string, string>();
    //Balances
    let b1: Map<string, number> = new Map<string, number>();
    let b2: Map<string, number> = new Map<string, number>();
    let b3: Map<string, number> = new Map<string, number>();
    //Groups
    let g1: Group = { id: "0", name: 'Trip', members: m1, balances: b1, blockHeight: UInt64.fromUint(0) };
    let g2: Group = { id: "1", name: 'Birthday party', members: m2, balances: b2, blockHeight: UInt64.fromUint(0) };
    let g3: Group = { id: "2", name: 'Poker Table', members: m3, balances: b3, blockHeight: UInt64.fromUint(0) };

    m1.set(this.account.getAdress(), this.account.getName());
    m1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 'Julian');

    m2.set(this.account.getAdress(), this.account.getName());
    m2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA6', 'Mikael');
    m2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA7', 'Valentina');

    m3.set(this.account.getAdress(), this.account.getName());
    m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA8', 'Elmo');
    m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA9', 'Kyra');
    m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA0', 'Sixtine');


    b1.set(this.account.getAdress(), 32.25);
    b1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', -32.25);

    b2.set(this.account.getAdress(), -200.00);
    b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA6', 453);
    b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA7', -253);

    b3.set(this.account.getAdress(), 0);
    b3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA8', 0);
    b3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA9', 125);
    b3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA0', -125);

    this._groups_mock = [g1, g2, g3];
  }

}
