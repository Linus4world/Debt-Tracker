import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  NAME: string = 'Unknown';
  CURRENCY: string = "€";
  balance: number;

  constructor(public navCtrl: NavController, private account: AccountProvider) {
    this.NAME = account.getName();
    this.balance = -50.32;
  }

}
