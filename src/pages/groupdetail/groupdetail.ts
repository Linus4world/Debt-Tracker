import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AddmemberPage } from '../addmember/addmember';
import { AddtransactionPage } from '../addtransaction/addtransaction';
import { LoaderProvider } from '../../providers/loader/loader';
import { TransferTransaction, Address } from 'nem2-sdk';
import { GroupsPage } from '../groups/groups';

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
    public currency: CurrencyProvider, public loader: LoaderProvider,
    private alertCtrl: AlertController) {
     this.group = navParams.get("group");
     this.members = Array.from(this.group.members.keys());
  }

  ionViewWillEnter(){
    this.update()
  }

  private getMemberBalance(memberAdress: string): string{
    return this.group.balances.get(memberAdress).toFixed(2) + this.currency.currency
  }

  getOwnBalanceString(): string{
    return this.getMemberBalance(this.account.getAdress());
  }

  getOwnBalance(): number{
    return this.group.balances.get(this.account.getAdress());
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
        this.transactions.push("Format: \t [SIGNER] ======> [RECEIPIENT]")
      }
      this.loading = false;
    })
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Do you want to leave and delete this group?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Cancel clicked')
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Deleting Group....');
            let groupPage: GroupsPage = this.navParams.get("groupPage")
            groupPage.removeGroup(this.group.id);
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
