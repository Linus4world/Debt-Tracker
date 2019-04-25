import { Component, Input, SimpleChanges } from '@angular/core';
import { CurrencyProvider } from '../../providers/currency/currency';
import { NavController } from 'ionic-angular';
import { GroupdetailPage } from '../../pages/groupdetail/groupdetail';
import { Group } from '../../models/group.model';
import { AccountProvider } from '../../providers/account/account';
import { GroupsPage } from '../../pages/groups/groups';
import { Observable } from 'rxjs';

/**
 * The component displays the user's current balance in that group.
 */
@Component({
  selector: 'dept-overview-card',
  templateUrl: 'dept-overview-card.html'
})

export class DeptOverviewCardComponent {
  @Input() group: Group;
  @Input() clickable: boolean = true;
  @Input() groupsPage: GroupsPage;
  @Input() observer: Observable<number>;
  balanceString: string;  

  constructor( public currencyProvider: CurrencyProvider, public navCtrl: NavController,
    public account: AccountProvider) {
    this.setBalanceString();
    if(this.observer !== undefined){
      this.observer.subscribe((data) => {
        this.group.balances.set(this.account.getAdress(), data);
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes!")
    this.group = changes.group.currentValue;
    this.setBalanceString();
  }

  private setBalanceString(){
    this.balanceString = (Math.abs(this.getOwnBalance())).toFixed(2)+this.currencyProvider.currency;
  }

    /**
   * Returns the users balance in the group
   */
  getOwnBalance(): number{
    if(this.group === undefined || this.group.balances === null){
      return 0;
    }
    return this.group.balances.get(this.account.getAdress());
  }

  showGroupDetails(){
    if(this.clickable){
      this.navCtrl.push(GroupdetailPage, {group: this.group, groupPage: this.groupsPage});
    }
  }

}