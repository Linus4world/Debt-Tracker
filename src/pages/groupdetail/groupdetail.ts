import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AddmemberPage } from '../addmember/addmember';
import { AddtransactionPage } from '../addtransaction/addtransaction';
import { LoaderProvider } from '../../providers/loader/loader';
import { TransferTransaction, Address } from 'nem2-sdk';

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
  group: Group;
  members: string[] = [];
  transactions: string[] = [];
  loading: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public account: AccountProvider,
    public currency: CurrencyProvider, public loader: LoaderProvider) {
     this.group = navParams.get("group");
     this.members = Array.from(this.group.members.keys());
  }

  ionViewWillEnter(){
    this.update()
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

  update(){
    console.log('Updating...')
    this.loading = true;
    this.transactions = [];
    this.loader.loadLatestTransactions().then(() => {
      let txs = this.loader.getLatestTransactions();
      for(let tx of txs){
        if(tx instanceof TransferTransaction && tx.recipient instanceof Address){
          this.transactions.push("" + tx.signer.address.plain() + ' => ' + tx.recipient.plain());
        }
      }
      if(this.transactions.length==0){
        this.transactions.push("No Transactions found!");
        this.transactions.push("Format: \t [SIGNER ADRESS] => [RECEIPIENT ADDRESS]")
      }
      this.loading = false;
    })
  }

}
