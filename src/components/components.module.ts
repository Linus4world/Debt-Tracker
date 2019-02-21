import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DeptOverviewCardComponent } from './dept-overview-card/dept-overview-card';
import { CurrencyProvider } from '../providers/currency/currency';
@NgModule({
	declarations: [
    DeptOverviewCardComponent],
	imports: [IonicModule],
	exports: [
	DeptOverviewCardComponent],
})
export class ComponentsModule {}
