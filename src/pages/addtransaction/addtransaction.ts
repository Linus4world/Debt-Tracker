import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';

/**
 * Generated class for the AddtransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.group = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddtransactionPage');
  }

  addMember(){
    if(this.group.members.has(this.memberAddress)){
      this.members.push(this.memberAddress);
      this.memberAddress = '';
    }
  }

  checkInput(): boolean{
    return !(this.title === "" || this.members.length <= 1 || this.amount === null || this.amount === 0);
  }

  submit(){
    if(this.checkInput()){
      this.createTransAction();
      this.navCtrl.pop();
    }else{
      //TODO inform user
      console.log('NO')
    }
    
  }

  createTransAction(){
    //TODO
    console.log("Transaction done!");
  }

}
