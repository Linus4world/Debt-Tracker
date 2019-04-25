import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Account, Address, Deadline, UInt64, PlainMessage,
  TransferTransaction, Mosaic, MosaicId, TransactionHttp, AggregateTransaction, SignedTransaction
} from 'nem2-sdk';
import { AccountProvider } from '../account/account';
import { NemSettingsProvider } from './nemsettings';
import { ToastController } from 'ionic-angular';


@Injectable()
export class NemTransactionProvider {

  private acc: Account;

  constructor(public http: HttpClient, public account: AccountProvider, public nemSettings: NemSettingsProvider,
    public toastCtrl: ToastController) {
    console.log('Hello NemTransactionProvider Provider');
    this.acc = Account.createFromPrivateKey(account.getPrivateKey(), this.nemSettings.networkType);
  }

  /**
   * Gives user an initial amount of tokens.
   */
  public initialSupply() {
    console.log("Getting initial supply...")
    //Create Tx
    let transferTransaction = this.createTransactionObject(this.account.getAdress(),
      "Initial Supply", this.nemSettings.initialSupply, '')
    //Sign
    let superAcc = Account.createFromPrivateKey(this.nemSettings.superAccPrivateKey,
      this.nemSettings.networkType);
    let signedTransaction = superAcc.sign(transferTransaction);
    //Announce to network
    this.announceTransaction(signedTransaction);
  }

  /**
   * Sends the given amount of tokens to the given receipients
   * @param receipients Array of adresses
   * @param title purpose of the transaction
   * @param amount number of tokens sent to the receipients
   */
  public createTransAction(receipients: string[], title: string, amount: number, groupID: string) {
    if (receipients.length == 1) {
      this.singleTransaction(receipients[0], title, amount, groupID);
    } else {
      this.aggregateTransaction(receipients, title, amount, groupID);
    }
  }

  private singleTransaction(receipient: string, title: string, amount: number, groupID: string) {
    //Create Tx
    let transferTransaction = this.createTransactionObject(receipient, title, amount, groupID)
    //Sign
    let signedTransaction = this.acc.sign(transferTransaction);
    //Announce to network
    this.announceTransaction(signedTransaction);
  }

  private aggregateTransaction(receipients: string[], title: string, amount: number, groupID: string) {
    //Create txs
    let txs = [];
    for (let receipient of receipients) {
      let tx = this.createTransactionObject(receipient, title, amount, groupID);
      tx.toAggregate(this.acc.publicAccount);
      txs.push(tx);
    }
    const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), txs, this.nemSettings.networkType, []);
    //Sign
    const signedTransaction = this.acc.sign(aggregateTransaction);
    //Announce to network
    this.announceTransaction(signedTransaction);
  }

  private createTransactionObject(receipient: string, title: string, amount: number, groupID: string): TransferTransaction {
    return TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(receipient),
      [new Mosaic(new MosaicId(this.nemSettings.mosaicID), UInt64.fromUint(amount))],
      PlainMessage.create(groupID + ':' + title),
      this.nemSettings.networkType
    );
  }

  private announceTransaction(signedTransaction: SignedTransaction) {
    const transactionHttp = new TransactionHttp(this.nemSettings.networkURL);
    transactionHttp.announce(signedTransaction).subscribe(
      x => {
        console.log("Successfully completed transactions! " + x);
        this.presentToast('Successfully completed transactions!')
      },
      err => {
        console.error('Transaction was not successful! ' + err);
        this.presentToast('Transaction was not successful!')
      }
    );
  }

  private presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
