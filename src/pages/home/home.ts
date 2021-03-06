import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoaderProvider } from '../../providers/loader/loader';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { Group } from '../../models/group.model';
import { NemAPI } from '../../providers/nem/nemapi';

//declare function generate();


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  NAME: string = 'Unknown';
  CURRENCY: string;
  group: Group = {id: "", name: "...", members: null, balances: null, deadline: null};

  constructor(public navCtrl: NavController, public loader: LoaderProvider, 
    public account: AccountProvider,currency: CurrencyProvider, nemAPI: NemAPI) {
    this.init();
    nemAPI.loadUpdates();
    this.CURRENCY = currency.currency;
  }

  private init(){
    console.log("initializing home page...")
    var b = new Map();
    b.set(this.account.getAdress(), 0);
    let m = new Map();
    m.set(this.account.getAdress(), this.account.getName());
    this.group = {id:"", name: "Overall Balance", balances: b, members: m, deadline: null};

    this.loader.overAllBalance$.subscribe((data: number) => {
      this.group.balances.set(this.account.getAdress(),data);
    })
    this.NAME = this.account.getName();
  }

  //TODO Only for Dev
  storeAll(){
    this.loader.saveAll();
  }

  //TODO Only for Dev
  clearAll(){
    this.loader.clearAll();
  }

}
