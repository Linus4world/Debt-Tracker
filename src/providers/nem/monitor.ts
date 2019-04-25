import {
    AccountHttp, PublicAccount, QueryParams, Transaction, Listener
} from 'nem2-sdk';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountProvider } from '../account/account';
import { NemSettingsProvider } from './nemsettings';

@Injectable()
export class NemMonitorProvider {

    constructor(public http: HttpClient, public account: AccountProvider, public nemSettings: NemSettingsProvider) {
        console.log('Hello NemTransactionProvider Provider');
    }

    /**
     * Querries the blockchain for the last 50 or pageSize transactions of this account.
     * @param pageSize (Optional) How many transactions should be querried. Between 10 and 100
     * @returns A Promise reloving in an Array of Transactions
     */
    public getLatestTransactions(pageSize?: number): Promise<Transaction[]> {
        const accountHttp = new AccountHttp(this.nemSettings.networkURL);
        const publicAccount = PublicAccount.createFromPublicKey(this.account.getPublicKey(), this.nemSettings.networkType);
        if (pageSize === undefined || pageSize < 10 || pageSize > 100) {
            pageSize = 50; // Page size between 10 and 100
        }

        return new Promise((res, rej) => {
            accountHttp.transactions(publicAccount, new QueryParams(pageSize)).subscribe(
                transactions => res(transactions),
                err => rej(err)
            )
        });
    }

    /**
     * Subscribes to the blockchain and calls the given function at creation of a new Block.
     * @param callback funcion that takes a BlockInfo element as parameter and gets called at creation of a new Block
     * @param errCallback (Optional) function that takes "err" as parameter and gets called if the subscription was unsuccessful
     */
    public listenForNewBlocks(callback: Function, errCallback?: Function) {
        const listener = new Listener(this.nemSettings.networkURL, WebSocket);

        listener.open().then(() => {
            listener.newBlock().subscribe(
                block => callback(block),
                err => {
                    if(errCallback === undefined){console.error(err)}
                    else{errCallback(err)}
                }
            )
        })
    }
}