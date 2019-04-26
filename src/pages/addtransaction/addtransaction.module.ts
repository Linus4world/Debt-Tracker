import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddtransactionPage } from './addtransaction';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    AddtransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddtransactionPage),
    IonicSelectableModule
  ],
})
export class AddtransactionPageModule {}
