import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { GroupsPage } from '../groups/groups';
import { UInt64 } from 'nem2-sdk';

@IonicPage()
@Component({
  selector: 'page-groupcreation',
  templateUrl: 'groupcreation.html',
})
export class GroupcreationPage {
  groupName: string = "";
  memberAddress: string = "";
  members: Array<string> = new Array<string>();
  membersMap: Map<string, string> = new Map<string, string>();
  private nameList: Map<string, Group>;

  private groupPage: GroupsPage;

  nameOK: boolean = true;
  membersOK: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    account: AccountProvider) {
    this.members.push(account.getName());
    this.membersMap.set(account.getAdress(), account.getName());
    this.groupPage = navParams.get('groupPage');
    this.nameList = this.navParams.get("map");
  }

  addMember() {
    //TODO check address with nem and get name
    let name = 'Member' + this.members.length;
    this.members.push(name);
    this.membersMap.set(this.memberAddress, name);
    this.memberAddress = '';
  }

  checkInput(): boolean {
    this.nameOK = (this.groupName !== "" && this.nameList.get(this.groupName) === undefined);
    this.membersOK = (this.members.length > 1);
    return this.nameOK && this.membersOK;
  }

  submit() {
    if (this.checkInput()) {
      let b = new Map<string, number>();
      let k = this.membersMap.keys();
      let i = k.next();
      while (i.done === false) {
        b.set(i.value, 0);
        i = k.next();
      }
      let group: Group = {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: this.groupName,
        members: this.membersMap,
        balances: b,
        blockHeight: UInt64.fromUint(0)
      }
      console.log(group);
      this.groupPage.addGroup(group);
      this.navCtrl.pop();
    }

  }

}
