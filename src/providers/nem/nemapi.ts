import { Injectable } from "@angular/core";
import { Group } from "../../models/group.model";
import { NemTransactionProvider } from "./transaction";
import { ControlMessageType } from "../../models/enums";
import { LoaderProvider } from "../loader/loader";
import { NemLoaderProvider } from "./nemloader";
import { AlertController, ToastController } from "ionic-angular";
import { InviteMessage, AnswerMessage, MemberMessage, LeaveMessage, TxMessage } from "../../models/control.model";
import { Transaction, PublicAccount, Account } from "nem2-sdk";
import { AccountProvider } from "../account/account";
import { LocalDateTime } from "js-joda";

@Injectable()
export class NemAPI {
    constructor(private nemTransaction: NemTransactionProvider, private loader: LoaderProvider,
        private nemLoader: NemLoaderProvider, private alertCtrl: AlertController, private account: AccountProvider,
        private toastCtrl: ToastController){

    }

    /**
     * Adds the given group to the list and sends an invitation to all members.
     */
    public addGroup(receipients: string[], group: Group){
        this.nemTransaction.sendControlData(receipients, ControlMessageType.INVITE, group.id, [this.loader.groupToGroupStorage(group), true]);
        this.loader.addGroup(group);
        this.presentToast("Group "+ group.name + " created!");
    }
    /**
     * Sends an invitation to the given friend.
     */
    public addFriend(receipient: string, group: Group){
        this.presentToast("⏳ Sending Invitation...");
        this.nemTransaction.sendControlData([receipient], ControlMessageType.INVITE, group.id, [this.loader.groupToGroupStorage(group), false]);
    }
    /**
     * Sends an invitation to the given member
     */
    public addMember(member: string, group: Group){
        this.nemTransaction.sendControlData([member], ControlMessageType.INVITE, group.id, [this.loader.groupToGroupStorage(group), true]);
        this.presentToast("⏳ Sending Invitation...");
    }
    /**
     * Sends the transaction details to all members of the group.
     * @param receipients List of addresses that are part of the transaction
     */
    public recordDebt(receipients: string[], group: Group, amount: number, purpose: string){
        this.nemTransaction.sendControlData(Array.from(group.members.keys()), ControlMessageType.TX, group.id, [this.account.getAdress(), receipients, amount, purpose])
        this.presentToast("⏳ Announcing Debt...");
    }
    /**
     * Answers an invitation message, adds the group to the list and listens for new incomming
     * transactions on the receipients account until an ControlMessage.MEMBER message is sent.
     * @param receipient Sender of the invitation
     */
    public answerInvititation(receipient: string, group: Group, accept: boolean){
        this.nemTransaction.sendControlData([receipient], ControlMessageType.ANSWER, group.id, [accept]);
        this.loader.addGroup(group);
        if(accept){
            this.presentToast("⏳ Sending Confirmation...");
        }
    }
    /**
     * Removes the given group from the list and sends a leave message to all members of the group
     */
    public leaveGroup(group: Group){
        let receipients: string[] = Array.from(group.members.keys());
        this.nemTransaction.sendControlData(receipients, ControlMessageType.LEAVE, group.id, null);
        this.loader.removeGroup(group.id);
        this.presentToast("⏳ Announcing leave....");
    }

    /**
     * Loads latest Transactions and process them.
     * @param (Optional) specify a groupID that you are not offically part yet
     * @returns Promise that resolves once the updates are applied
     */
    public loadUpdates(groupID?: string): Promise<void>{
        return this.nemLoader.loadAndProcessLatestTransactions(this,
             groupID===undefined? undefined : this.loader.getAccountsToLoad(groupID), groupID);
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
    public handleTransaction(senderAcc: PublicAccount, groupID: string, deadline: LocalDateTime, type: string, payload: string) {
        let group = this.loader.getGroup(groupID);
        if(group === null || group.deadline.isBefore(deadline)){
            this.applyControlUpdate(groupID, type, payload, senderAcc);
            group.deadline = deadline;
            this.loader.update();
        }
    }

    private applyControlUpdate(groupID: string, type: string, payload: string, senderAcc: PublicAccount) {
        switch (type) {
            case ControlMessageType.INVITE:
                let invitationMessage: InviteMessage = JSON.parse(payload);
                let group :Group = this.loader.groupStorageToGroup(invitationMessage.group);
                let accept = function(isGroup: boolean){
                    if(isGroup){this.loader.addGroup(group)
                    }else{this.loader.addFriend(group)}
                    this.loader.registerNewAccountListener(groupID, senderAcc.publicKey);
                }
                this.presentConfirm("Do you want to accept "+invitationMessage.senderName+'\'s ' 
                + (invitationMessage.isGroup? 'group ': 'friend ') +'invitation?', accept);
                break;
            case ControlMessageType.ANSWER:
                let answerMessage: AnswerMessage = JSON.parse(payload);
                if(answerMessage.accept){
                    let receipients: string[] = Array.from(this.loader.getGroup(groupID).members.keys());
                    this.nemTransaction.sendControlData(receipients, ControlMessageType.MEMBER, groupID,
                         [answerMessage.username, senderAcc.address.plain()]);
                    this.loader.addMember(groupID, answerMessage.username, senderAcc.address.plain());
                }
                break;
            case ControlMessageType.MEMBER:
                let memberMessage: MemberMessage = JSON.parse(payload);
                this.loader.addMember(groupID, memberMessage.address, memberMessage.username);
                if(memberMessage.address === this.account.getAdress()){
                    this.loadUpdates(groupID);
                }
                break;
            case ControlMessageType.LEAVE:
                let leaveMessage: LeaveMessage = JSON.parse(payload);
                this.loader.removeMember(groupID, leaveMessage.address);
                break;
            case ControlMessageType.TX:
                let infoMessage: TxMessage = JSON.parse(payload);
                this.applyTransaction(groupID, infoMessage)
            default:
                break;
        }
    }

    private applyTransaction(groupID, infoMessage: TxMessage){
        let g: Group = this.loader.getGroup(groupID);
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

        /**
 * Presents the given toast message to the user for 1.5sec
 * @param message : Message to be shown
 */
  private presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }
    
}
