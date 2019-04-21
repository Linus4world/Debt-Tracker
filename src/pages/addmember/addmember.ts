import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupdetailPage } from '../groupdetail/groupdetail';

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
  name: string = '';
  page: GroupdetailPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddmemberPage');
  }

  submit() {
    //TODO check address with nem
    if (this.address !== '' || name !== '') {
      this.page.addMember(this.address, this.name);
      this.navCtrl.pop();
    }else{
      console.log('NO!');
    }
    //this.eRef.nativeElement.className = "wrongInput";
  }

}
