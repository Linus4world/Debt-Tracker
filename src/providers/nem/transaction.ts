import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Account, Address, Deadline, PlainMessage,
  TransferTransaction, TransactionHttp, AggregateTransaction, SignedTransaction, InnerTransaction
} from 'nem2-sdk';
import { AccountProvider } from '../account/account';
import { NemSettingsProvider } from './nemsettings';
import { ToastController } from 'ionic-angular';
import { NemMonitorProvider } from './monitor';
import { ControlMessageType } from '../../models/enums';
import { InviteMessage, AnswerMessage, MemberMessage, LeaveMessage, InfoMessage } from '../../models/control.model';


@Injectable()
export class NemTransactionProvider {

  private acc: Account;

  constructor(public http: HttpClient, public account: AccountProvider, public nemSettings: NemSettingsProvider,
    public toastCtrl: ToastController, public monitor: NemMonitorProvider) {
    console.log('Hello NemTransactionProvider Provider');
    console.log(account.getPrivateKey());
    this.acc = Account.createFromPrivateKey(account.getPrivateKey(), this.nemSettings.networkType);
  }

  /**
   * Sends a transaction with the given amount to the given receipients
   */
  public createTransAction(receipients: string[], purpose: string, amount: number, groupID: string){
    this.sendControlData(receipients, ControlMessageType.TX, groupID, [this.account.getAdress(), receipients, amount, purpose]);
  }

    /**
   * Sends the given control data into to the given receipients
   * @param receipients 
   * @param type 
   * @param groupID 
   * @param params 
   */
  public sendControlData(receipients: string[], type: ControlMessageType, groupID: string, params: any[]) {
    if (receipients.length == 1) {
      let tx = this.prepareControlMessage(receipients[0], type, groupID, params);
      this.announceTransaction(this.acc, this.acc.sign(tx));
    } else {
      let txs: InnerTransaction[] = [];
      for (let receipient of receipients) {
        let tx = this.prepareControlMessage(receipient, type, groupID, params);
        txs.push(tx.toAggregate(this.acc.publicAccount));
        let aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), txs, this.nemSettings.networkType, []);
        this.announceTransaction(this.acc, this.acc.sign(aggregateTransaction));
      }
    }
  }

  /**
   * Creates a transaction that is used to transfer control data
   */
  private createControlTransactionObject(receipient: string, type: ControlMessageType, payload: string, groupID: string): TransferTransaction {
    return TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(receipient),
      [],
      PlainMessage.create(groupID + '$' + type + '$' + payload),
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
      error => { console.error(error); this.monitor.presentToast("❌ Transaction failed!") });
  }

  private prepareControlMessage(receipient: string, type: ControlMessageType,
     groupID: string, params: any[]): TransferTransaction {
    let payload: any;
    switch (type) {
      case ControlMessageType.INVITE:
        let inviteMessage: InviteMessage = {
          senderName: this.account.getName(), group: params[0], isGroup: params[1]
        };
        payload = inviteMessage;
        break;
      case ControlMessageType.ANSWER:
        let answerMessage: AnswerMessage = {
          username: this.account.getName(),
          accept: params[0]
        }
        payload = answerMessage;
        break;
      case ControlMessageType.MEMBER:
        let memberMessage: MemberMessage = {
          username: params[1],
          address: params[0],
        }
        payload = memberMessage;
        break;
      case ControlMessageType.LEAVE:
        let leaveMessage: LeaveMessage = {
          address: params[0]
        }
        payload = leaveMessage;
        break;
      case ControlMessageType.TX:
        let infoMessage: InfoMessage = {
          sender: params[0],
          receipients: params[1],
          amount: params[2],
          purpose: params[3]
        }
        payload = infoMessage;
      default:
        break;
    }
    return this.createControlTransactionObject(receipient, type, JSON.stringify(payload), groupID);
  }
}
