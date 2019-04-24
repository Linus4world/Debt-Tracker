import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Account, Address, Deadline, UInt64, PlainMessage,
  TransferTransaction, Mosaic, MosaicId, TransactionHttp, AggregateTransaction
} from 'nem2-sdk';
import { AccountProvider } from '../account/account';
import { NemSettingsProvider } from './nemsettings';


@Injectable()
export class NemTransactionProvider {

  private acc;

  constructor(public http: HttpClient, public account: AccountProvider, public nemSettings: NemSettingsProvider) {
    console.log('Hello NemTransactionProvider Provider');
    this.acc = Account.createFromPrivateKey(account.getPrivateKey(), this.nemSettings.networkType);
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
    let transferTransaction = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(receipient),
      [new Mosaic(new MosaicId(this.nemSettings.mosaicID), UInt64.fromUint(amount))], 
      PlainMessage.create(groupID + ':' + title),
      this.nemSettings.networkType
    );

    //Sign
    let signedTransaction = this.acc.sign(transferTransaction);

    //Announce to network
    const transactionHttp = new TransactionHttp(this.nemSettings.networkURL);
    transactionHttp.announce(signedTransaction).subscribe(
      x => console.log("Successfully completed transaction! "+x),
      err => console.log(err)
    );
  }

  private aggregateTransaction(receipients: string[], title: string, amount: number, groupID: string) {
    //Create txs
    let txs = [];
    for(let receipient of receipients){
      let tx = TransferTransaction.create(Deadline.create(),
      Address.createFromRawAddress(receipient),
      [new Mosaic(new MosaicId(this.nemSettings.mosaicID), UInt64.fromUint(amount))],
      PlainMessage.create(groupID + ':' + title), this.nemSettings.networkType);
      tx.toAggregate(this.acc.publicAccount);
      txs.push(tx);
    }
    const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), txs, this.nemSettings.networkType, []);

    //Sign
    const signedTransaction = this.acc.sign(aggregateTransaction);
    
    //Announce to network
    const transactionHttp = new TransactionHttp(this.nemSettings.networkURL);
    transactionHttp.announce(signedTransaction).subscribe(
      x => console.log("Successfully completed transactions! "+x), 
      err => console.error(err));
  }
}
