import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AccountProvider } from "../account/account";
import { NemMonitorProvider } from "./monitor";
import { Transaction, TransferTransaction, AggregateTransaction, Address } from "nem2-sdk";
import { LoaderProvider } from "../loader/loader";
import { Group } from "../../models/group.model";
import { ControlMessageType } from "../../models/enums";
import { AlertController } from "ionic-angular";
import { InviteMessage, AnswerMessage, MemberMessage, LeaveMessage, InfoMessage } from "../../models/control.model";
import { NemTransactionProvider } from "./transaction";

@Injectable()
export class NemReactorProvider {
    private latestTransactions: Transaction[] = [];

    constructor(public http: HttpClient, public account: AccountProvider,
        public monitor: NemMonitorProvider, private alertCtrl: AlertController,
        private transactionProvider: NemTransactionProvider) {
            console.log("Hello REactorProvider")
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
                            if (at instanceof TransferTransaction &&
                                at.recipient instanceof Address && 
                                at.recipient.plain() === this.account.getAdress() ) {
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
        let group = loader.getGroup(groupID);
        if(group === null || group.blockHeight < transaction.transactionInfo.height){
            this.applyControlUpdate(loader, groupID, components[1], components[2], transaction.signer.address.plain());
            loader.update();
        }
    }

    private applyControlUpdate(loader: LoaderProvider, groupID: string, type: string, payload: string, sender: string) {
        switch (type) {
            case ControlMessageType.INVITE:
                let invitationMessage: InviteMessage = JSON.parse(payload);
                let group :Group = loader.groupStorageToGroup(invitationMessage.group);
                this.presentConfirm("Do you want to accept "+invitationMessage.senderName+'\'s ' 
                + (invitationMessage.isGroup? 'group ': 'friend ') +'invitation?', 
                (invitationMessage.isGroup? function(){loader.addGroup(group)} : function(){loader.addFriend(group)} ));
                break;
            case ControlMessageType.ANSWER:
                let answerMessage: AnswerMessage = JSON.parse(payload);
                if(answerMessage.accept){
                    let receipients: string[] = Array.from(loader.getGroup(groupID).members.keys());
                    this.transactionProvider.sendControlData(receipients, ControlMessageType.MEMBER, groupID, [answerMessage.username, sender]);
                    loader.addMember(groupID, answerMessage.username, sender);
                }
                break;
            case ControlMessageType.MEMBER:
                let memberMessage: MemberMessage = JSON.parse(payload);
                loader.addMember(groupID, memberMessage.address, memberMessage.username);
                break;
            case ControlMessageType.LEAVE:
                let leaveMessage: LeaveMessage = JSON.parse(payload);
                loader.removeMember(groupID, leaveMessage.address);
                break;
            case ControlMessageType.INFO:
                let infoMessage: InfoMessage = JSON.parse(payload);
                this.applyTransaction(groupID, loader, infoMessage)
            default:
                break;
        }
    }

    applyTransaction(groupID, loader: LoaderProvider, infoMessage: InfoMessage){
        let g: Group = loader.getGroup(groupID);
        let oldBalance = g.balances.get(infoMessage.sender);
        g.balances.set(infoMessage.sender, oldBalance + infoMessage.amount);
        for(let receipient of infoMessage.receipients){
            oldBalance = g.balances.get(receipient);
            g.balances.set(receipient, oldBalance - infoMessage.amount)
        }
    }

    presentConfirm(message:string, callback: Function) {
        let alert = this.alertCtrl.create({
          title: 'Accept Invitation',
          message: message,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => console.log('Cancel clicked')
            },
            {
              text: 'Confirm',
              handler: () => callback()
            }
          ]
        });
        alert.present();
      }
}