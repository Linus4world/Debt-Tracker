import { Injectable } from "@angular/core";
import { Group } from "../../models/group.model";
import { NemTransactionProvider } from "./transaction";
import { ControlMessageType } from "../../models/enums";
import { LoaderProvider } from "../loader/loader";
import { NemLoaderProvider } from "./nemloader";
import { AlertController } from "ionic-angular";
import { InviteMessage, AnswerMessage, MemberMessage, LeaveMessage, InfoMessage } from "../../models/control.model";
import { TransferTransaction, UInt64, Transaction } from "nem2-sdk";

@Injectable()
export class NemAPI {
    constructor(private nemTransaction: NemTransactionProvider, private loader: LoaderProvider,
        private nemLoader: NemLoaderProvider, private alertCtrl: AlertController){

    }

    /**
     * Adds the given group to the list and sends an invitation to all members.
     */
    public addGroup(receipients: string[], group: Group){
        this.nemTransaction.sendControlData(receipients, ControlMessageType.INVITE, group.id, [this.loader.groupToGroupStorage(group), true]);
        this.loader.addGroup(group);
    }
    /**
     * Sends an invitation to the given friend.
     */
    public addFriend(receipient: string, group: Group){
        this.nemTransaction.sendControlData([receipient], ControlMessageType.INVITE, group.id, [this.loader.groupToGroupStorage(group), false]);
    }
    /**
     * Sends an invitation to the given member
     */
    public addMember(member: string, group: Group){
        this.nemTransaction.sendControlData([member], ControlMessageType.INVITE, group.id, [this.loader.groupToGroupStorage(group), true]);
    }
    /**
     * Sends the transaction details to all members of the group.
     * @param receipients List of addresses that are part of the transaction
     */
    public recordDebt(receipients: string[], group: Group, amount: number, purpose: string){
        this.nemTransaction.sendControlData(Array.from(group.members.keys()), ControlMessageType.TX, group.id, [receipients, amount, purpose])
    }
    /**
     * Answers an invitation message, adds the group to the list and listens for new incomming
     * transactions on the receipients account until an ControlMessage.MEMBER message is sent.
     * @param receipient Sender of the invitation
     */
    public answerInvititation(receipient: string, group: Group, accept: boolean){
        this.nemTransaction.sendControlData([receipient], ControlMessageType.ANSWER, group.id, [accept]);
        this.loader.addGroup(group);
    }
    /**
     * Removes the given group from the list and sends a leave message to all members of the group
     */
    public leaveGroup(group: Group){
        let receipients: string[] = Array.from(group.members.keys());
        this.nemTransaction.sendControlData(receipients, ControlMessageType.LEAVE, group.id, null);
        this.loader.removeGroup(group.id);
    }

    /**
     * Loads latest Transactions and process them.
     * @returns Promise that resolves once the updates are applied
     */
    public loadUpdates(): Promise<void>{
        return this.nemLoader.loadAndProcessLatestTransactions(this);
    }

    /**
     * Returns the latest applied Transactions
     */
    public getLatestTransactions(): Transaction[] {
        return this.nemLoader.getLatestTransactions();
    }

    /**
     * Process a transaction (if relevant) with the given details
     */
    public handleTransaction(sender: string, groupID: string, blockHeight: UInt64, type: string, payload: string) {
        let group = this.loader.getGroup(groupID);
        if(group === null || group.blockHeight < blockHeight){
            this.applyControlUpdate(this.loader, groupID, type, payload, sender);
            this.loader.update();
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
                    this.nemTransaction.sendControlData(receipients, ControlMessageType.MEMBER, groupID, [answerMessage.username, sender]);
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
            case ControlMessageType.TX:
                let infoMessage: InfoMessage = JSON.parse(payload);
                this.applyTransaction(groupID, loader, infoMessage)
            default:
                break;
        }
    }

    private applyTransaction(groupID, loader: LoaderProvider, infoMessage: InfoMessage){
        let g: Group = loader.getGroup(groupID);
        let oldBalance = g.balances.get(infoMessage.sender);
        g.balances.set(infoMessage.sender, oldBalance + infoMessage.amount);
        for(let receipient of infoMessage.receipients){
            oldBalance = g.balances.get(receipient);
            g.balances.set(receipient, oldBalance - infoMessage.amount)
        }
    }

    private presentConfirm(message:string, callback: Function) {
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
