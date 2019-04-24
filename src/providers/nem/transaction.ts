import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Account, Address, Deadline, UInt64, NetworkType, PlainMessage,
  TransferTransaction, Mosaic, MosaicId, TransactionHttp, AggregateTransaction
} from 'nem2-sdk';
import { AccountProvider } from '../account/account';
/*
  Generated class for the NemTransactionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NemTransactionProvider {

  private network = NetworkType.TEST_NET;
  private networkURL = 'http://localhost:3000'; //Have to check on this
  private sup_acc_address = 'TAYF53ZBIVH2ZMFSAZEZJXVW2V44G7T5L62YIHI3';
  private mosaicID = '7cdf3b117a3c40cc'; // Replace with our mosaicId when created super account
  private acc;

  constructor(public http: HttpClient, public account: AccountProvider) {
    console.log('Hello NemTransactionProvider Provider');
    this.acc = Account.createFromPrivateKey(account.getPrivateKey(), this.network);
  }

  public createTransAction(receipients: string[], title: string, amount: number) {
    if (receipients.length == 1) {
      this.singleTransaction(receipients[0], title, amount);
    } else {
      this.aggregateTransaction(receipients, title, amount);
    }
  }

  public initialSupply(){
    let transferTransaction = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress('TAYF53ZBIVH2ZMFSAZEZJXVW2V44G7T5L62YIHI3');
      [new Mosaic(new MosaicId(this.mosaicID), UInt64.fromUint(100))],
      PlainMessage.create("Testing"),
      this.network
    );

    let signedTransaction = this.acc.sign(transferTransaction);

    const transactionHttp = new TransactionHttp(this.networkURL);
    transactionHttp.announce(signedTransaction).subscribe(
      x => console.log("Successfully completed transaction! "+x),
      err => console.log(err)
    );
  }

  private singleTransaction(receipient: string, title: string, amount: number) {
    //Create Tx
    let transferTransaction = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(receipient),
      [new Mosaic(new MosaicId(this.mosaicID), UInt64.fromUint(amount))], 
      PlainMessage.create(title),
      this.network
    );

    //Sign
    let signedTransaction = this.acc.sign(transferTransaction);

    //Announce to network
    const transactionHttp = new TransactionHttp(this.networkURL);
    transactionHttp.announce(signedTransaction).subscribe(
      x => console.log("Successfully completed transaction! "+x),
      err => console.log(err)
    );
  }

  private aggregateTransaction(receipients: string[], title: string, amount: number) {
    //Create txs
    let txs = [];
    for(let receipient of receipients){
      let tx = TransferTransaction.create(Deadline.create(),
      Address.createFromRawAddress(receipient),
      [new Mosaic(new MosaicId(this.mosaicID), UInt64.fromUint(amount))],
      PlainMessage.create('title'), this.network);
      tx.toAggregate(this.acc.publicAccount);
      txs.push(tx);
    }
    const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), txs, this.network, []);

    //Sign
    const signedTransaction = this.acc.sign(aggregateTransaction);
    
    //Announce to network
    const transactionHttp = new TransactionHttp(this.networkURL);
    transactionHttp.announce(signedTransaction).subscribe(
      x => console.log("Successfully completed transactions! "+x), 
      err => console.error(err));
  }
}
