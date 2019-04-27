import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderProvider } from '../../providers/loader/loader';

/**
 * Generated class for the AddmemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addmember',
  templateUrl: 'addmember.html',
})
export class AddmemberPage {
  address: string = '';
  inputOK = true;
  groupID: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private loader: LoaderProvider) {
    this.groupID = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddmemberPage');
  }

  submit() {
    //TODO check address with nem
    this.inputOK=this.address.length === 40;
    if (this.inputOK) {
      this.loader.addMember(this.groupID, 'member' + Math.floor(Math.random()*100), this.address);
      this.navCtrl.pop();
    }else{
      console.log('NO!');
    }
  }

}
