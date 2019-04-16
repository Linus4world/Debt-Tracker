import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { GroupcreationPage } from '../groupcreation/groupcreation';
import { FilemanagerProvider } from '../../providers/filemanager/filemanager';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  private self;

  //Members
  m1: Map<string,string> = new Map<string,string>();
  m2: Map<string,string> = new Map<string,string>();
  m3: Map<string,string> = new Map<string,string>();
  //Balances
  b1: Map<string,number> = new Map<string, number>();
  b2: Map<string,number> = new Map<string, number>();
  b3: Map<string,number> = new Map<string, number>();
  //Groups
  g1: Group = {id: "0", name: 'Trip', members: this.m1, balances: this.b1};
  g2: Group = {id: "1", name: 'Birthday party', members: this.m2, balances: this.b2};
  g3: Group = {id: "2", name: 'Pool_1', members: this.m3, balances: this.b3, moneypoolBalance: {current: 47.55,initial:60}};
  public group_list: Group[] = [this.g1, this.g2, this.g3];

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public account: AccountProvider, public fileManager: FilemanagerProvider) {
    this.self = account.getSelf();
    this.m1.set(this.self.ADRESS, this.self.name);
    this.m1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 'Julian');

    this.m2.set(this.self.ADRESS, this.self.name);
    this.m2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA6', 'Mikael');
    this.m2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA7', 'Valentina');

    this.m3.set(this.self.ADRESS, this.self.name);
    this.m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA8', 'Elmo');
    this.m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA9', 'Kyra');
    this.m3.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA0', 'Sixtine');


    this.b1.set(this.self.ADRESS, 32.30);
    this.b1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', -32.30);

    this.b2.set(this.self.ADRESS, -20.00);
    this.b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA6', 45.30);
    this.b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA7', -25.30);

    this.b2.set(this.self.ADRESS, 0);
    this.b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA8', 0);
    this.b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA9', 0);
    this.b2.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA0', -12.45);
  }

  ionViewDidLoad() {
  }

  /**
   * Returns the users balance in the group
   * @param mambers list of members in the group
   * @param balances list of balances in the group
   */
  getOwnBalance(balances: Map<string,number>): number{
    return balances.get(this.self.ADRESS);
  }

  /**
   * Returns the users overall balance in all groups
   */
  getOverallBalance(){
    let overAllBalance = 0;
    for(let g of this.group_list){
      overAllBalance += this.getOwnBalance(g.balances);
    }
    return overAllBalance;
  }

  createGroup(){
    //TODO
    console.log("Creating Page...");
    this.navCtrl.push(GroupcreationPage, {groupPage: this});
  }

  addGroup(group: Group){
    this.group_list.push(group);
    console.log('Added group!');
    this.fileManager.saveGroups(this.group_list);
  }

}
