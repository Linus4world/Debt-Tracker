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

  group_list: Group[];
  private nameList: Map<string, Group> = new Map<string, Group>();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public account: AccountProvider, public loader: LoaderProvider) {
    this.group_list = loader.getGroups();
    loader.group_list$.subscribe((data: Group[]) => {
      this.group_list = data;
      this.nameList.clear();
      for (let g of this.group_list) {
        this.nameList.set(g.name, g);
      }
    })
  }

  ionViewDidLoad() {
  }

  createGroup() {
    this.navCtrl.push(GroupcreationPage, {map: this.nameList });
  }
}
