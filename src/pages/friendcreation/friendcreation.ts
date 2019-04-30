import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { UInt64 } from 'nem2-sdk';
import { LoaderProvider } from '../../providers/loader/loader';
import { LocalDateTime } from 'js-joda';

@IonicPage()
@Component({
  selector: 'page-friendcreation',
  templateUrl: 'friendcreation.html',
})
export class FriendcreationPage {
  address: string = '';
  inputOK = true;
  @ViewChild('addressField') eRef: ElementRef;


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public account: AccountProvider, private loader: LoaderProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendcreationPage');
  }

  submit(){
    //TODO check address with nem
    this.inputOK = this.address.length === 40;
    if(this.inputOK){
      let ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      let m = new Map<string,string>();
      m.set(this.account.getAdress(), this.account.getName());
      m.set(this.address, 'Friend'+ID)
      let b = new Map<string,number>();
      b.set(this.account.getAdress(), 0);
      b.set(this.address, 0);
      
      let f: Group = {
        id: ID,
        name: m.get(this.address),
        members: m,
        balances: b,
        deadline: LocalDateTime.now()
      }
      this.loader.addFriend(f);
      this.navCtrl.pop();
    }else{
      console.log('NO!');
    }
  }

}
