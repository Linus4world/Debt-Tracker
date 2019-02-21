import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  g1: Group = {name: 'Trip', members: ['Linus', 'Julian'], balances: [32.30, -32.30]};
  g2: Group = {name: 'Birthday party', members: ['Linus', 'Mikael', 'Valentina'], balances: [-20.00, 45.30, -25.30]};
  g3: Group = {name: 'Pool_1', members: ['Linus', 'Elmo', 'Kyra', 'Sixtine'], balances: [0,0,0,-12.45], moneypoolBalance: {current: 47.55,initial:60}};
  group_list: Group[] = [this.g1, this.g2, this.g3];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  /**
   * Returns the users balance in the group
   * @param mambers list of members in the group
   * @param balances list of balances in the group
   */
  computeBalance(mambers: String[], balances: number[]): number{
    return balances[0];
  }

  /**
   * Returns the users overall balance in all groups
   */
  getOverallBalance(){
    let overAllBalance = 0;
    for(let g of this.group_list){
      overAllBalance += this.computeBalance(g.members, g.balances);
    }
    return overAllBalance;
  }

}
