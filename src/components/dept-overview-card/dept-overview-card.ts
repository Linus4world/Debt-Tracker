import { Component, Input, SimpleChanges } from '@angular/core';
import { CurrencyProvider } from '../../providers/currency/currency';
import { Currency } from '../../models/enums';

/**
 * The component displays the user's current balance in that group.
 */
@Component({
  selector: 'dept-overview-card',
  templateUrl: 'dept-overview-card.html'
})

export class DeptOverviewCardComponent {
  @Input() name: string = '';
  @Input() balance: number = 0.00;
  @Input() moneypoolBalance: {current: number, initial: number};
  balanceString: string;  
  currency: Currency;

  constructor( public currencyProvider: CurrencyProvider) {
    this.setBalanceString();
    this.currency = currencyProvider.currency
  }

  ngOnChanges(changes: SimpleChanges) {
    this.balance = changes.balance.currentValue;
    this.name = changes.name.currentValue;
    this.setBalanceString();
  }

  private setBalanceString(){
    this.balanceString = (Math.abs(this.balance))+this.currency;
  }

}