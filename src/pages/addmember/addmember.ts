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
  name: string = '';
  groupID: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private loader: LoaderProvider) {
    this.groupID = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddmemberPage');
  }

  submit() {
    //TODO check address with nem
    if (this.address.length === 40 && this.name !== '') {
      this.loader.addMember(this.groupID, this.name, this.address);
      this.navCtrl.pop();
    }else{
      console.log('NO!');
    }
    //this.eRef.nativeElement.className = "wrongInput";
  }

}
