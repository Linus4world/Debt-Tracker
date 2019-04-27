import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AccountProvider } from "../account/account";
import { NemMonitorProvider } from "./monitor";
import { Transaction, TransferTransaction, AggregateTransaction, Address } from "nem2-sdk";
import { LoaderProvider } from "../loader/loader";
import { Group } from "../../models/group.model";
import { ControlMessageType } from "../../models/enums";

@Injectable()
export class NemReactorProvider {
    private latestTransactions: Transaction[] = [];

    constructor(public http: HttpClient, public account: AccountProvider,
        public monitor: NemMonitorProvider) {

    }

    public getLatestTransactions(): Transaction[] {
        return this.latestTransactions;
    }

    public loadLatestTransactions(loader: LoaderProvider): Promise<void> {
        return this.monitor.getLatestTransactions().then(
            (transactions) => {
                if (transactions === null) { return }
                this.latestTransactions = transactions;
                for (let t of transactions) {
                    if (t instanceof TransferTransaction) {
                        this.handleTransaction(loader, t)
                    } else if (t instanceof AggregateTransaction) {
                        for (let at of t.innerTransactions) {
                            if (at instanceof TransferTransaction) {
                                this.handleTransaction(loader, at);
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

    private handleTransaction(loader: LoaderProvider, transaction: TransferTransaction) {
        let components = transaction.message.payload.split('$');
        let groupID = components[0];
        let type = components[1];
        if (type === 'CONTROL') {
            this.applyControlUpdate(loader, groupID, components[2], components[3])
        } else {
            let group = loader.getGroup(groupID);
            if (group === null) {
                console.log('[WARNING] Group not found! ' + transaction.message.payload)
            } else {
                this.applyUpdates(group, transaction);
                loader.update();
            }
        }
    }

    /**
     * Applies the changes of the given tx
     * @param TransferTransaction to be applied
     */
    private applyUpdates(group: Group, tx: TransferTransaction) {
        //Check if changes were applied before
        if (tx.transactionInfo.height <= group.blockHeight) { return }

        //Get information
        let from = tx.signer.address.plain();
        let to = '';
        if (tx.recipient instanceof Address) {
            to = tx.recipient.plain();
        }
        let amount = tx.mosaics.length / 100.00; //TODO Have to validate this

        //Apply changes
        let oldBalance = group.balances.get(from);
        if (oldBalance == null) { console.log('[ERROR] receipient ' + from + ' not found!'); return }
        group.balances.set(from, oldBalance + amount);

        oldBalance = group.balances.get(to);
        if (oldBalance == null) { console.log('[ERROR] receipient ' + to + ' not found!'); return }
        group.balances.set(to, oldBalance - amount);
        console.log('[SUCCESS] ' + from + ' ==> ' + to);
    }

    private applyControlUpdate(loader: LoaderProvider, groupID: string, type: string, payload: string) {
        switch (type) {
            case ControlMessageType.INVITE:
                //TODO
                break;
            case ControlMessageType.ANSWER:
                //loader.getGroup(groupID) TODO
                break;
            case ControlMessageType.MEMBER:
                break;
            case ControlMessageType.LEAVE:
                break;
            case ControlMessageType.INFO:
            default:
                break;
        }
    }
}