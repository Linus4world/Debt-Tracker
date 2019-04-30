import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderProvider } from '../../providers/loader/loader';
import { NemAPI } from '../../providers/nem/nemapi';

@IonicPage()
@Component({
  selector: 'page-addmember',
  templateUrl: 'addmember.html',
})
export class AddmemberPage {
  address: string = '';
  inputOK = true;
  groupID: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private loader: LoaderProvider,
    private nemAPI: NemAPI) {
    this.groupID = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddmemberPage');
  }

  submit() {
    //TODO check address with nem
    this.inputOK=this.address.length === 40;
    if (this.inputOK) {
      this.nemAPI.addMember(this.address, this.loader.getGroup(this.groupID));
      this.navCtrl.pop();
    }else{
      console.log('NO!');
    }
  }

}
