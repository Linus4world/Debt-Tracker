import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendcreationPage } from './friendcreation';

@NgModule({
  declarations: [
    FriendcreationPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendcreationPage),
  ],
})
export class FriendcreationPageModule {}
