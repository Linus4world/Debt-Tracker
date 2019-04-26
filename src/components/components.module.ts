import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DeptOverviewCardComponent } from './dept-overview-card/dept-overview-card';
import { ChartComponent } from './chart/chart';
@NgModule({
	declarations: [
    DeptOverviewCardComponent,
    ChartComponent],
	imports: [IonicModule],
	exports: [
	DeptOverviewCardComponent,
    ChartComponent],
})
export class ComponentsModule {}
