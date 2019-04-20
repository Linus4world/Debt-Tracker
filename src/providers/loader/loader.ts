import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilemanagerProvider } from '../filemanager/filemanager';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../account/account';
import { Observable, observable } from 'rxjs';

/*
  Generated class for the LoaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderProvider {

  private groups: Array<Group>;
  private friends: Array<Group>;


  private self;

  private group_list: Group[];
  private friend_list: Group[];

  public overAllBalance$: Observable<string>;
  private observer;
  private overAllBalance = "Calculating...";

  constructor(public http: HttpClient, public filemanager: FilemanagerProvider, account: AccountProvider) {
    this.self = account.getSelf();
    this.setupGroupsMock();
    this.setupFriendsMock();
    

    Promise.all([this.loadGroups(), this.loadFriends()]).then((values) => {
        this.updateBalance();
      }
    )
  
    this.overAllBalance$ = Observable.create((observer) =>{
      this.observer = observer;
      observer.next(this.overAllBalance);
    })
  }

  public getGroups(){
    if(this.groups !== undefined){
      return this.groups;
    }else{
      this.loadGroups();
      return this.groups;
    }
  }

  public getFriends(){
    if(this.friends !== undefined){
      return this.friends
    }else{
      this.loadFriends();
      return this.friends;
    }
  }
  
    /**
   * Returns the users overall balance in all groups
   */
  private getOverallBalance(){
    let overAllBalance = 0;
    for(let g of this.groups){
      overAllBalance += g.balances.get(this.self.ADRESS);
    }
    for(let f of this.friends){
      overAllBalance += f.balances.get(this.self.ADRESS);
    }
    return overAllBalance;
  }

  public updateBalance(){
    this.overAllBalance = this.getOverallBalance().toFixed(2);
    this.observer.next(this.overAllBalance);
  }

  private loadGroups(){
    return this.filemanager.loadGroups().then((groups) => {
      this.groups = groups;
    },(err)=>{
      console.log("using mocks for groups...");
      this.groups = this.group_list;
    });
  }

  private loadFriends(){
    return this.filemanager.loadFriends().then((friends)=>{
      this.friends = friends;
    }, (err) => {
      console.log("using mocks for friends...");
      this.friends = this.friend_list;
    })
  }

  private setupFriendsMock(){
    let m1: Map<string, string> = new Map<string, string>();
    let b1: Map<string, number> = new Map<string, number>();
    let f1: Group = {id: "3", name: "Nicolas", members: m1, balances: b1};

    m1.set(this.self.ADRESS, this.self.name);
    m1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 'Nicolas');
    b1.set(this.self.ADRESS, -5.32);
    b1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 5.32);

    this.friend_list = [f1];
  }

  private setupGroupsMock(){
   //Members
   let m1: Map<string,string> = new Map<string,string>();
   let m2: Map<string,string> = new Map<string,string>();
   let m3: Map<string,string> = new Map<string,string>();
   //Balances
   let b1: Map<string,number> = new Map<string, number>();
   let b2: Map<string,number> = new Map<string, number>();
   let b3: Map<string,number> = new Map<string, number>();
   //Groups
   let g1: Group = {id: "0", name: 'Trip', members: m1, balances: b1};
   let g2: Group = {id: "1", name: 'Birthday party', members: m2, balances: b2};
   let g3: Group = {id: "2", name: 'Poker Table', members: m3, balances: b3};

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

    this.group_list = [g1, g2, g3];
  }

}
