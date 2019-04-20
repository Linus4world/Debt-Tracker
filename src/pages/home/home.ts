import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';
import { LoaderProvider } from '../../providers/loader/loader';
import { CurrencyProvider } from '../../providers/currency/currency';
import { Group } from '../../models/group.model';

//declare function generate();


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  NAME: string = 'Unknown';
  CURRENCY: string;
  group: Group;

  constructor(public navCtrl: NavController, account: AccountProvider, loader: LoaderProvider,
     currency: CurrencyProvider) {
    this.CURRENCY = currency.currency;
    var b = new Map();
    b.set(account.getAdress(), 0);
    let m = new Map();
    m.set(account.getAdress(), account.getName());
    this.group = {id:"", name: "Overall Balance", balances: b, members: m};

    loader.overAllBalance$.subscribe((data: number) => {
      this.group.balances.set(account.getAdress(),data);
    })
    this.NAME = account.getName();
  }

  generateNewAccount(){
    console.log("generating account...");
    //console.log(generate());
    // let account = this.g.generateAccount();
    // console.log(account)
  }

}
