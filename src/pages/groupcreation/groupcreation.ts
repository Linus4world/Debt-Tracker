import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { LocalDateTime } from 'js-joda';
import { NemAPI } from '../../providers/nem/nemapi';

@IonicPage()
@Component({
  selector: 'page-groupcreation',
  templateUrl: 'groupcreation.html',
})
export class GroupcreationPage {
  groupName: string = "";
  memberAddress: string = "";
  members: Array<string> = new Array<string>();
  private nameList: Map<string, Group>;
  nameOK: boolean = true;
  membersOK: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public account: AccountProvider, private nemAPI: NemAPI) {
    this.members.push(account.getName());
    this.nameList = this.navParams.get("map");
  }

  addMember() {
    //TODO check address with nem and get name
    if (this.memberAddress.length === 40 && this.members.indexOf(this.memberAddress, 0) === -1) {
      this.members.push(this.memberAddress);
      this.memberAddress = '';
    }
  }

  removeMember(member: string) {
    const index = this.members.indexOf(member, 0);
    if (index > -1) {
      this.members.splice(index, 1);
    }
  }

  checkInput(): boolean {
    this.nameOK = (this.groupName !== "" && this.nameList.get(this.groupName) === undefined);
    this.membersOK = (this.members.length > 1);
    return this.nameOK && this.membersOK;
  }

  submit() {
    if (this.checkInput()) {
      let b = new Map<string, number>();
      b.set(this.account.getAdress(), 0);
      let m = new Map<string, string>();
      m.set(this.account.getAdress(), this.account.getName());
      let group: Group = {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: this.groupName,
        members: m,
        balances: b,
        deadline: LocalDateTime.now()
      }
      this.nemAPI.addGroup(this.members, group);
      this.navCtrl.pop();
    }
  }

}
