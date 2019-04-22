import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { NemTransactionProvider } from '../../providers/nem/transaction';

@IonicPage()
@Component({
  selector: 'page-addtransaction',
  templateUrl: 'addtransaction.html',
})
export class AddtransactionPage {
  group: Group;
  title: string = "";
  amount: number = 0;
  memberAddress:string = "";
  members: Array<string> = new Array<string>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public nemTransaction: NemTransactionProvider) {
    this.group = navParams.data;
  }

  addMember(){
    if(this.group.members.has(this.memberAddress)){
      this.members.push(this.memberAddress);
      this.memberAddress = '';
    }
  }

  checkInput(): boolean{
    return !(this.title === "" || this.members.length < 1 || this.amount === null || this.amount === 0);
  }

  submit(){
    if(this.checkInput()){
      this.createTransaction();
      this.navCtrl.pop();
    }else{
      //TODO inform user
      console.log('NO')
    }
  }

  private createTransaction(){
    this.nemTransaction.createTransAction(this.members, this.title, this.amount);
  }



}
