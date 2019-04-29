import {
    AccountHttp, PublicAccount, QueryParams, Transaction, Listener, SignedTransaction, Address
} from 'nem2-sdk';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountProvider } from '../account/account';
import { NemSettingsProvider } from './nemsettings';
import { filter, first, map, mergeMap, skip, timeout } from "rxjs/operators";
import { ToastController } from 'ionic-angular';

@Injectable()
export class NemMonitorProvider {

    constructor(public http: HttpClient, public account: AccountProvider, 
        public nemSettings: NemSettingsProvider, public toastCtrl: ToastController) {
        console.log('Hello MonitorProvider Provider');
    }

    /**
     * After a new transaction has been announced, this function monitors if it is accepted in the blockchain.
     * Code following the offical guide at https://nemtech.github.io/guides/transaction/monitoring-a-transaction-status.html
     */
    public monitorTransactionStatus(signerAddress: Address, signedTransaction: SignedTransaction) {
        //open new Listner
        const listener = new Listener(this.nemSettings.listenerURL, WebSocket);
        const amountOfConfirmationsToSkip = 5;
        /** 
         * Start monitoring if the WebSocket connection is alive.
         * Blocks are generated every 15 seconds in average, so a timeout can be raised 
         * if there is no response after 30 seconds approximately.
         */
        listener.open().then(() => {
            const newBlockSubscription = listener
                .newBlock()
                .pipe(timeout(30000)) // time in milliseconds when to timeout.
                .subscribe(block => {
                    console.log("New block created:" + block.height.compact());
                },
                    error => {
                        console.error('❌ WebSocket not alive! Are you connected to a valid API node?' + error);
                        this.presentToast('❌ Connection Error! Please try again');
                        listener.terminate();
                    });
            /**
             * Monitor if there is some validation error with the transaction issued.
             * When you receive a message from status WebSocket channel,
             * it always means the transaction did not meet the requirements. 
             * You need to handle the error accordingly, by reviewing the error status list.
             */
            listener
                .status(signerAddress)
                .pipe(filter(error => error.hash === signedTransaction.hash))
                .subscribe(error => {
                    console.log("❌ Validation error:" + error.status);
                    newBlockSubscription.unsubscribe();
                    listener.close();
                },
                    error => console.error(error));
            /**
             * Monitor as well if the transaction reaches the network. 
             * When you receive a message from unconfirmed WebSocket channel, 
             * the transaction is valid and is waiting to be included in a block. 
             * This does not mean necessarily that the transaction will be included, 
             * as a second validation happens before being finally confirmed.
             */

            listener
                .unconfirmedAdded(signerAddress)
                .pipe(filter(transaction => (transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === signedTransaction.hash)))
                .subscribe(ignored => console.log("⏳: Transaction status changed to unconfirmed"),
                    error => console.error(error));
            /**
             * Monitor when the transaction gets included in a block. 
             * When included, transaction can still be rolled-back because of forks. 
             * You can decide for yourself that after e.g. 6 blocks the transaction is secured.
             */
            listener
                .confirmed(signerAddress)
                .pipe(
                    filter(transaction => (transaction.transactionInfo !== undefined
                        && transaction.transactionInfo.hash === signedTransaction.hash)),
                    mergeMap(transaction => {
                        return listener.newBlock()
                            .pipe(
                                skip(amountOfConfirmationsToSkip),
                                first(),
                                map(ignored => transaction))
                    })
                )
                .subscribe(ignored => {
                    console.log("✅: Transaction confirmed");
                    this.presentToast('✅ Record successful!')
                    newBlockSubscription.unsubscribe();
                    listener.close();
                }, error => console.error(error));
        }, err => {console.log('Could not open connection to websocket! Are you connected to a valid API node?')});
    }

    /**
     * Presents the given toast message to the user for 3sec
     * @param message : Message to be shown
     */
    public presentToast(message: string) {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
}