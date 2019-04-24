import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';
import { DeptOverviewCardComponent } from '../components/dept-overview-card/dept-overview-card';
import { CurrencyProvider } from '../providers/currency/currency';
import { HttpClientModule } from '@angular/common/http';
import { AccountProvider } from '../providers/account/account';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { GroupcreationPage } from '../pages/groupcreation/groupcreation';
import { File } from '@ionic-native/file/ngx';
import { FriendcreationPage } from '../pages/friendcreation/friendcreation';
import { LoaderProvider } from '../providers/loader/loader';
import { GroupdetailPage } from '../pages/groupdetail/groupdetail';
import { AddmemberPage } from '../pages/addmember/addmember';
import { AddtransactionPage } from '../pages/addtransaction/addtransaction';
import { RegisterPage } from '../pages/register/register';
import { NemTransactionProvider } from '../providers/nem/transaction';
import { NemSettingsProvider } from '../providers/nem/nemsettings';
import { NemMonitorProvider } from '../providers/nem/monitor';

@NgModule({
  declarations: [
    MyApp,
    FriendsPage,
    HomePage,
    TabsPage,
    GroupsPage,
    GroupcreationPage,
    DeptOverviewCardComponent,
    FriendcreationPage,
    GroupdetailPage,
    AddmemberPage,
    AddtransactionPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FriendsPage,
    HomePage,
    TabsPage,
    GroupsPage,
    GroupcreationPage,
    FriendcreationPage,
    GroupdetailPage,
    AddmemberPage,
    AddtransactionPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CurrencyProvider,
    AccountProvider,
    File,
    LoaderProvider,
    NemTransactionProvider,
    NemSettingsProvider,
    NemMonitorProvider
  ]
})
export class AppModule {}
