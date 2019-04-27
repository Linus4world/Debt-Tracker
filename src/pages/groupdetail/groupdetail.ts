import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AddmemberPage } from '../addmember/addmember';
import { AddtransactionPage } from '../addtransaction/addtransaction';
import { LoaderProvider } from '../../providers/loader/loader';
import { TransferTransaction, Address } from 'nem2-sdk';
import { GroupsPage } from '../groups/groups';
import { Observable } from 'rxjs';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@IonicPage()
@Component({
  selector: 'page-groupdetail',
  templateUrl: 'groupdetail.html',
})
export class GroupdetailPage {
  group: Group;
  group$: Observable<Group> = null;
  observer;
  members: string[] = [];
  transactions: string[] = [];
  loading: boolean = false;
  friend: boolean;
  memberArray: [string, string][];

  constructor(public navCtrl: NavController, public navParams: NavParams, public account: AccountProvider,
    public currency: CurrencyProvider, public loader: LoaderProvider,
    private alertCtrl: AlertController, private clipboard: Clipboard, private toastCtrl: ToastController) {
    this.group = navParams.get("group");
    this.group$ = Observable.create((observer) => {
      this.observer = observer;
      observer.next(this.group);
    });
    this.members = Array.from(this.group.members.keys());
    this.memberArray = Array.from(this.group.members.entries());
    this.friend = navParams.get("friend");
    if (this.friend === undefined) { this.friend = false }
  }

  ionViewWillEnter() {
    this.update();
  }

  private getMemberBalance(memberAdress: string): string {
    return this.group.balances.get(memberAdress).toFixed(2) + this.currency.currency
  }

  getOwnBalanceString(): string {
    return this.getMemberBalance(this.account.getAdress());
  }

  getOwnBalance(): number {
    return this.group.balances.get(this.account.getAdress());
  }

  addTransaction() {
    this.navCtrl.push(AddtransactionPage, this.group);
  }

  addPerson() {
    this.navCtrl.push(AddmemberPage, this);
  }

  addMember(address: string, name: string) {
    this.members.push(address);
    this.memberArray.push([address, name]);
    this.group.members.set(address, name);
    this.group.balances.set(address, 0);
    console.log('added: ' + name);
  }

  update() {
    console.log('Updating...')
    this.loading = true;
    this.transactions = [];
    this.loader.loadLatestTransactions().then(() => {
      this.observer.next(this.group);
      let txs = this.loader.getLatestTransactions();
      for (let tx of txs) {
        if (tx instanceof TransferTransaction && tx.recipient instanceof Address) {
          this.transactions.push("" + tx.signer.address.plain() + ' ?=== ' + (tx.mosaics.length / 10.0).toFixed() + ' ===> ' + tx.recipient.plain());
          this.transactions.push('Purpose: ' + tx.message.payload.split(':')[1]);
        }
      }
      if (this.transactions.length == 0) {
        this.transactions.push("No Transactions found!");
        this.transactions.push("Format:");
        this.transactions.push('[SIGNER] ?=== [AMOUNT] ===> [RECEIPIENT]');
        this.transactions.push('Purpose: [MESSAGE]')
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

  copyAddress(address: string) {
    this.clipboard.copy(address).then(
      _ => this.presentToast("Copied Address"),
      err => console.log("Copying an Address only works on a real device!")
    );
    this.clipboard.paste().then(
      (resolve: string) => {
        alert(resolve);
      },
      (reject: string) => {
        alert('Error: ' + reject);
      }
    );
    this.clipboard.clear();
  }

      /**
     * Presents the given toast message to the user for 1.5sec
     * @param message : Message to be shown
     */
    private presentToast(message: string) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'top'
      });
      toast.present();
    }

}
