import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';
import { LoaderProvider } from '../../providers/loader/loader';
import { CurrencyProvider } from '../../providers/currency/currency';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  NAME: string = 'Unknown';
  CURRENCY: string;
  balance: string;

  constructor(public navCtrl: NavController, account: AccountProvider, loader: LoaderProvider, currency: CurrencyProvider) {
    this.CURRENCY = currency.currency;
    loader.overAllBalance$.subscribe((data: string) => {
      this.balance = data;
    })
    this.NAME = account.getName();
  }

}
