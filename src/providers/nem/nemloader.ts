import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AccountProvider } from "../account/account";
import { NemMonitorProvider } from "./monitor";
import { Transaction, TransferTransaction, AggregateTransaction, Address, AccountHttp, PublicAccount, QueryParams } from "nem2-sdk";
import { NemAPI } from "./nemapi";
import { NemSettingsProvider } from "./nemsettings";

@Injectable()
export class NemLoaderProvider {
    private latestTransactions: Transaction[] = [];

    constructor(public http: HttpClient, public account: AccountProvider,
        public monitor: NemMonitorProvider,
        private nemSettings: NemSettingsProvider) {
        console.log("Hello REactorProvider")
    }

    /**
     * Querries the blockchain for the last 50 or pageSize transactions of this account.
     * @param pageSize (Optional) How many transactions should be querried. Between 10 and 100
     * @returns A Promise reloving in an Array of Transactions
     */
    private loadLatestTransactions(publicKey: string, pageSize?: number): Promise<Transaction[]> {
        const accountHttp = new AccountHttp(this.nemSettings.networkURL);
        const publicAccount = PublicAccount.createFromPublicKey(
            publicKey === undefined ? this.account.getPublicKey() : publicKey, this.nemSettings.networkType)
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

    public getLatestTransactions(): Transaction[] {
        return this.latestTransactions;
    }

    public loadAndProcessLatestTransactions(nemAPI: NemAPI, publicKey: string, groupID: string): Promise<void> {
        return this.loadLatestTransactions(publicKey).then(
            (transactions) => {
                if (transactions === null) { return }
                this.latestTransactions = transactions;
                for (let t of transactions) {
                    if (t instanceof TransferTransaction) {
                        if (publicKey !== undefined || t.message.payload.startsWith(groupID)) {
                            this.processTransaction(nemAPI, t)
                        }
                    } else if (t instanceof AggregateTransaction) {
                        for (let at of t.innerTransactions) {
                            if (at instanceof TransferTransaction &&
                                at.recipient instanceof Address &&
                                at.recipient.plain() === this.account.getAdress()) {
                                if (publicKey !== undefined || at.message.payload.startsWith(groupID)) {
                                    this.processTransaction(nemAPI, at)
                                }
                            }
                        }
                    }
                }
            },
            (err) => {
                console.log('[ERROR] while loading latest Transactions: ' + err);
            }
        )
    }

    private processTransaction(nemAPI: NemAPI, transaction: TransferTransaction) {
        let components = transaction.message.payload.split('$');
        nemAPI.handleTransaction(transaction.signer, components[0],
            transaction.deadline.value, components[1], components[2]);
    }



}