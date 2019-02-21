import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { GroupsPage } from './groups';
import { DeptOverviewCardComponent } from '../../components/dept-overview-card/dept-overview-card';

@NgModule({
  declarations: [
    GroupsPage,
    DeptOverviewCardComponent
  ],
  imports: [
    IonicPageModule.forChild(GroupsPage),
    IonicModule,
    DeptOverviewCardComponent
  ],
})
export class GroupsPageModule {}
