import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Account, Address, Deadline, UInt64, PlainMessage,
  TransferTransaction, Mosaic, MosaicId, TransactionHttp, AggregateTransaction, SignedTransaction
} from 'nem2-sdk';
import { AccountProvider } from '../account/account';
import { NemSettingsProvider } from './nemsettings';
import { ToastController } from 'ionic-angular';
import { NemMonitorProvider } from './monitor';


@Injectable()
export class NemTransactionProvider {

  private acc: Account;

  constructor(public http: HttpClient, public account: AccountProvider, public nemSettings: NemSettingsProvider,
    public toastCtrl: ToastController, public monitor: NemMonitorProvider) {
    console.log('Hello NemTransactionProvider Provider');
    this.acc = Account.createFromPrivateKey(account.getPrivateKey(), this.nemSettings.networkType);
  }

  /**
   * Gives user an initial amount of tokens, sent from the super account specified in the NemSettingsProvider
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
    this.announceTransaction(superAcc, signedTransaction);
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

  /**
   * Sends a new TransferTransaction with only one receipient
   */
  private singleTransaction(receipient: string, title: string, amount: number, groupID: string) {
    //Create Tx
    let transferTransaction = this.createTransactionObject(receipient, title, amount, groupID)
    //Sign
    console.log("SIGN")
    let signedTransaction = this.acc.sign(transferTransaction);
    //Announce to network
    this.announceTransaction(this.acc, signedTransaction);
  }

  /**
   * Sends a new aggregated TransferTransaction with multiple receipients
   */
  private aggregateTransaction(receipients: string[], title: string, amount: number, groupID: string) {
    //Create txs
    let txs = [];
    for (let receipient of receipients) {
      let tx = this.createTransactionObject(receipient, title, amount, groupID);
      txs.push(tx.toAggregate(this.acc.publicAccount));
    }
    const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), txs, this.nemSettings.networkType, []);
    //Sign
    const signedTransaction = this.acc.sign(aggregateTransaction);
    //Announce to network
    this.announceTransaction(this.acc, signedTransaction);
  }

  /**
   * Creates a new TransferTransaction
   * @returns TransferTransaction with the given parameters
   */
  private createTransactionObject(receipient: string, title: string, amount: number, groupID: string): TransferTransaction {
    return TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(receipient),
      [new Mosaic(new MosaicId(this.nemSettings.mosaicID), UInt64.fromUint(amount))],
      PlainMessage.create(groupID + ':' + title),
      this.nemSettings.networkType
    );
  }

  /**
   * Announces and monitors the status of the given signed transaction.
   * @param signer Account of the signer
   * @param signedTransaction the transaction to be announced and monitored
   */
  private announceTransaction(signer: Account, signedTransaction: SignedTransaction) {
    const transactionHttp = new TransactionHttp(this.nemSettings.networkURL);
    this.monitor.monitorTransactionStatus(signer.address, signedTransaction);
    transactionHttp.announce(signedTransaction).subscribe(
      x => console.log(x),
      error => {console.error(error); this.monitor.presentToast("❌ Transaction failed!")});
  }
}
