import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { GroupcreationPage } from '../groupcreation/groupcreation';
import { LoaderProvider } from '../../providers/loader/loader';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {

  private group_list: Group[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
     public account: AccountProvider, public loader: LoaderProvider) {
      this.group_list=loader.getGroups();
    }

  ionViewDidLoad() {
  }

  createGroup(){
    this.navCtrl.push(GroupcreationPage, {groupPage: this});
  }

  addGroup(group: Group){
    this.group_list.push(group);
    console.log('Added group!');
    this.loader.saveGroups(this.group_list);
  }

}
