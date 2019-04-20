import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { GroupcreationPage } from '../groupcreation/groupcreation';
import { FilemanagerProvider } from '../../providers/filemanager/filemanager';
import { LoaderProvider } from '../../providers/loader/loader';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {

  private group_list: Group[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
     public account: AccountProvider, public fileManager: FilemanagerProvider, loader: LoaderProvider) {
      this.group_list=loader.getGroups();
    }

  ionViewDidLoad() {
  }

  /**
   * Returns the users balance in the group
   * @param balances list of balances in the group
   */
  getOwnBalance(balances: Map<string,number>): number{
    return balances.get(this.account.getAdress());
  }

  createGroup(){
    this.navCtrl.push(GroupcreationPage, {groupPage: this});
  }

  addGroup(group: Group){
    this.group_list.push(group);
    console.log('Added group!');
    this.fileManager.saveGroups(this.group_list);
  }

}
