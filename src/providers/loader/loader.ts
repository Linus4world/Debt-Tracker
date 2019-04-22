import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Group } from '../../models/group.model';
import { Observable } from 'rxjs';
import { AccountDetails } from '../../models/accountdetails.model';
import { AccountProvider } from '../account/account';

/*
  Generated class for the LoaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderProvider {

  /**
   * If true, example groups and friends will be loaded
   */
  private useMockData: boolean = true;
  /**
   * If true, data gets stored on the phone/computer persistently
   */
  private storeData: boolean = false;

  private groups: Array<Group> = [];
  private friends: Array<Group> = [];


  private self: AccountDetails;

  private groups_mock: Group[];
  private friends_mock: Group[];

  public overAllBalance$: Observable<number>;

  private observer;
  private overAllBalance = 0;

  private GROUPS_KEY = 'GROUPS';
  private FIRENDS_KEY = 'FRIENDS';
  private ACCOUNT_KEY = 'ACCOUNT';

  constructor(public http: HttpClient,
    public storage: Storage, public account: AccountProvider) {

  }

  public init() {
    console.log("start to load files....")
    this.self = this.account.getSelf();
    if (this.useMockData) {
      this.setupGroupsMock();
      this.setupFriendsMock();
    }
    return Promise.all([this.loadGroups(), this.loadFriends()]).then((values) =>
      this.updateBalance()).then(() => {
        this.overAllBalance$ = Observable.create((observer) => {
          this.observer = observer;
          observer.next(this.overAllBalance);
        });
      }).then(() => console.log('Everything is loaded!'));
  }


  public getGroups() {
    if (this.groups !== []) {
      return this.groups;
    } else {
      this.loadGroups();
      return this.groups;
    }
  }

  public getFriends() {
    if (this.friends !== []) {
      return this.friends
    } else {
      this.loadFriends();
      return this.friends;
    }
  }

  private getOverallBalance() {
    let overAllBalance = 0;
    for (let g of this.groups) {
      overAllBalance += g.balances.get(this.self.ADRESS);
    }
    for (let f of this.friends) {
      overAllBalance += f.balances.get(this.self.ADRESS);
    }
    return overAllBalance;
  }

  public updateBalance() {
    this.overAllBalance = this.getOverallBalance();
    if (this.observer !== undefined) {
      this.observer.next(this.overAllBalance);
    }
  }


  //LOADING

  private loadGroups() {
    console.log('Loading Groups...');
    return this.storage.get(this.GROUPS_KEY).then((groups) => {
      if (groups !== null) {
        this.groups = JSON.parse(groups);
      } else if (this.useMockData) {
        console.log("using mocks for groups...");
        this.groups = this.groups_mock;
      }
    });
  }

  private loadFriends() {
    console.log('Loading Friends...');
    return this.storage.get(this.FIRENDS_KEY).then((friends) => {
      if (friends !== null) {
        this.friends = JSON.parse(friends);
      } else if (this.useMockData) {
        console.log("Using mocks for friends...");
        this.friends = this.friends_mock;
      }
    });
  }


  //STORING

  public saveAccount(account: AccountDetails) {
    this.saveObjects(this.ACCOUNT_KEY, account);
  }

  public saveGroups(groups: Group[]) {
    this.saveObjects(this.GROUPS_KEY, groups);
  }

  public saveFriends(friends: Group[]) {
    this.saveObjects(this.FIRENDS_KEY, friends);
  }

  private saveObjects(key: string, obj: any) {
    if (this.storeData) {
      this.storage.set(key, JSON.stringify(obj)).then(() => {
        console.log('Stored ' + key + ' successfully!')
      }, (err) => {
        console.log('ERROR writing ' + key + ' ' + err);
      })
    }
  }



  //MOCKS

  private setupFriendsMock() {
    let m1: Map<string, string> = new Map<string, string>();
    let b1: Map<string, number> = new Map<string, number>();
    let f1: Group = { id: "3", name: "Nicolas", members: m1, balances: b1 };

    m1.set(this.self.ADRESS, this.self.name);
    m1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 'Nicolas');
    b1.set(this.self.ADRESS, -5.32);
    b1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 5.32);

    this.friends_mock = [f1];
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
    let g1: Group = { id: "0", name: 'Trip', members: m1, balances: b1 };
    let g2: Group = { id: "1", name: 'Birthday party', members: m2, balances: b2 };
    let g3: Group = { id: "2", name: 'Poker Table', members: m3, balances: b3 };

    m1.set(this.self.ADRESS, this.self.name);
    m1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 'Julian');

    m2.set(this.self.ADRESS, this.self.name);
    m2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA6', 'Mikael');
    m2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA7', 'Valentina');

    m3.set(this.self.ADRESS, this.self.name);
    m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA8', 'Elmo');
    m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA9', 'Kyra');
    m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA0', 'Sixtine');


    b1.set(this.self.ADRESS, 32.30);
    b1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', -32.30);

    b2.set(this.self.ADRESS, -20.00);
    b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA6', 45.30);
    b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA7', -25.30);

    b3.set(this.self.ADRESS, 0);
    b3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA8', 0);
    b3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA9', 12.45);
    b3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA0', -12.45);

    this.groups_mock = [g1, g2, g3];
  }

}
