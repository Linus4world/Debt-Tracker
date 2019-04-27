import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { NemTransactionProvider } from '../../providers/nem/transaction';
import { MemberSearch } from '../../models/membersearch.model';
import { AccountProvider } from '../../providers/account/account';

@IonicPage()
@Component({
  selector: 'page-addtransaction',
  templateUrl: 'addtransaction.html',
})
export class AddtransactionPage {
  group: Group;
  title: string = "";
  amount: number = 1;
  members: Array<string> = new Array<string>();
  memberOptions: MemberSearch[] = [];
  selectedMembers: MemberSearch[] = [];
  amountOK = true;
  memberOK = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nemTransaction: NemTransactionProvider,
    account: AccountProvider) {
    this.group = navParams.data;
    this.group.members.forEach((value, key, _) => {
      if(key !== account.getAdress()){
        this.memberOptions.push({address: key, name: value});
      }
    })
  }

  checkInput(): boolean{
    this.amountOK = this.amount !== null && this.amount > 0;
    this.memberOK = this.selectedMembers.length > 0;
    return this.amountOK && this.memberOK ;
  }

  submit(){
    if(this.checkInput()){
      this.members = [];
      this.selectedMembers.forEach((value, i, _) => {
        this.members.push(value.address);
      })
      this.createTransaction();
      this.navCtrl.pop();
    }else{
      //TODO inform user
      console.log('NO')
    }
  }

  private createTransaction(){
    this.amount = Math.floor(this.amount*10);
    this.nemTransaction.createTransAction(this.members, this.title, this.amount, this.group.id);
  }


}
