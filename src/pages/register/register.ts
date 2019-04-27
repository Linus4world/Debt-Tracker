import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderProvider } from '../../providers/loader/loader';
import { TabsPage } from '../tabs/tabs';
import { AccountProvider } from '../../providers/account/account';
import { Account } from 'nem2-sdk';
import { Storage } from '@ionic/storage';
import { AccountDetails } from '../../models/accountdetails.model';
import { NemSettingsProvider } from '../../providers/nem/nemsettings';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  userName = "";
  loaded = false;
  /**
   * Just for debugging if we do not want to enter the name again and again.
   * For deployment set this value to false.
   */
  private hideRegisterPage = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loader: LoaderProvider, public account: AccountProvider, storage: Storage,
    public nemSettings: NemSettingsProvider) {
    storage.get("ACCOUNT").then((data) => {
      let acc: AccountDetails = JSON.parse(data);
      if (this.hideRegisterPage || acc !== null) {
        if (acc === null) {
          console.log('Using account mock...');
          acc = {
            name: 'Anonymus', ADRESS: 'TAWLSI7TPPXTTPVMCCZRCD2YAFXAY6IB2UH7BQ5Q',
            PUBLIC_KEY: '2189cec45b3d9659178ad697891c2b19a4f88a7d4355759af4e553fe57b6ce92',
            PRIVATE_KEY: '945ef5e3111f78334bac11cfb9ea0adde38d40844edc2315bf1cb82a96744075'
          }
        }
        this.userName = acc.name;
        account.setAccountDetails(this.userName, acc.ADRESS, acc.PUBLIC_KEY,
          acc.PRIVATE_KEY).then(() => {
            this.goToNextPage(false);
          });
      } else {
        this.loaded = true;
      }
    })
  }

  continue() {
    if (this.userName !== "") {
      this.createAccount(),
        this.goToNextPage(true);
    }
  }

  /**
   * This function creates a new Nem account and stores all account details.
   * It will only be called on the very first run.
   */
  private createAccount() {
    let acc = Account.generateNewAccount(this.nemSettings.networkType);
    this.account.setAccountDetails(this.userName, acc.address.plain(),
     acc.publicKey, acc.privateKey).then(() => this.loader.saveAccount(this.account.getSelf()));
    }

  private goToNextPage(firstTime: boolean) {
    console.log("continue...");
    this.loader.init().then(() => {
      this.loaded = true;
      this.navCtrl.push(TabsPage, firstTime);
      this.navCtrl.setRoot(TabsPage);
    })
  }
}
