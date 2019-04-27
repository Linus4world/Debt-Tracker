import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { FriendcreationPage } from '../friendcreation/friendcreation';
import { LoaderProvider } from '../../providers/loader/loader';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  friend_list: Group[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public account: AccountProvider, public loader: LoaderProvider) {
      this.friend_list = loader.getFriends();
      this.loader.friends_list$.subscribe((data: Group[]) => {
        this.friend_list = data;
      })
    }

  ionViewDidLoad() {
  }

  public getOwnBalance(balances: Map<string, number>){
    return balances.get(this.account.getAdress());
  }

  createFriend(){
    this.navCtrl.push(FriendcreationPage);
  }

}
