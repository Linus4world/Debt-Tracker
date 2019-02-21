import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendsPage } from './friends';
import { DeptOverviewCardComponent } from '../../components/dept-overview-card/dept-overview-card';

@NgModule({
  declarations: [
    FriendsPage,
    DeptOverviewCardComponent
  ],
  imports: [
    IonicPageModule.forChild(FriendsPage),
  ],
})
export class FriendsPageModule {}
