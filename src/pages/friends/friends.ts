import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  m1: Map<string, string> = new Map<string, string>();
  b1: Map<string, number> = new Map<string, number>();
  f1: Group = {id: "3", name: "Nicolas", members: this.m1, balances: this.b1};
  friend_list: Group[] = [this.f1];

  constructor(public navCtrl: NavController, public navParams: NavParams, public account: AccountProvider) {
    this.m1.set(account.getAdress(), account.getName());
    this.m1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 'Nicolas');
    this.b1.set(account.getAdress(), -5.32);
    this.b1.set('TCVN45ZKHQGWVFVAKXX7LH3W6RWMGAL4FSPA5UA5', 5.32);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }

  public getOwnBalance(balances: Map<string, number>){
    return balances.get(this.account.getAdress());
}

}
