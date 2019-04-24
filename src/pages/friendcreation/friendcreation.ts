import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FriendsPage } from '../friends/friends';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { UInt64 } from 'nem2-sdk';

/**
 * Generated class for the FriendcreationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friendcreation',
  templateUrl: 'friendcreation.html',
})
export class FriendcreationPage {
  address: string = '';
  friendsPage: FriendsPage;
  @ViewChild('addressField') eRef: ElementRef;


  constructor(public navCtrl: NavController, public navParams: NavParams, public account: AccountProvider) {
    this.friendsPage = navParams.get('friendsPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendcreationPage');
  }

  submit(){
    //TODO check address with nem
    if(this.address != ''){
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
        blockHeight: UInt64.fromUint(0)
      }
      this.friendsPage.addFriend(f);
      this.navCtrl.pop();
    }
    console.log('NO!');
    //this.eRef.nativeElement.className = "wrongInput";
  }

}
