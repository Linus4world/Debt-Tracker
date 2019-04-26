import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupdetailPage } from './groupdetail';
import { ChartComponent } from '../../components/chart/chart';

@NgModule({
  declarations: [
    GroupdetailPage,
    ChartComponent
  ],
  imports: [
    IonicPageModule.forChild(GroupdetailPage),
    ChartComponent
  ],
})
export class GroupdetailPageModule {}
