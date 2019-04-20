import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AddmemberPage } from '../addmember/addmember';
import { AddtransactionPage } from '../addtransaction/addtransaction';

/**
 * Generated class for the GroupdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupdetail',
  templateUrl: 'groupdetail.html',
})
export class GroupdetailPage {  
  private group: Group;
  private members: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public account: AccountProvider,
    public currency: CurrencyProvider) {
     this.group = navParams.get("group");
     this.members = Array.from(this.group.members.keys());
     console.log(this.members);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupdetailPage');
  }

  getMemberBalance(memberAdress: string){
    return this.group.balances.get(memberAdress).toFixed(2) + this.currency.currency
  }

  getOwnBalance(){
    return this.getMemberBalance(this.account.getAdress());
  }

  addTransaction(){
    this.navCtrl.push(AddtransactionPage, this.group);
  }

  addPerson(){
    this.navCtrl.push(AddmemberPage, this);
  }

  addMember(address: string, name: string){
    this.members.push(address);
    this.group.members.set(address, name);
    this.group.balances.set(address, 0);
    console.log('added: ' + name);
  }

}
