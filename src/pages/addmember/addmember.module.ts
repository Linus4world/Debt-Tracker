import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddmemberPage } from './addmember';

@NgModule({
  declarations: [
    AddmemberPage,
  ],
  imports: [
    IonicPageModule.forChild(AddmemberPage),
  ],
})
export class AddmemberPageModule {}
