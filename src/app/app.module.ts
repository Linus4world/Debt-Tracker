import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';
import { DeptOverviewCardComponent } from '../components/dept-overview-card/dept-overview-card';
import { CurrencyProvider } from '../providers/currency/currency';
import { HttpClientModule } from '@angular/common/http';
import { AccountProvider } from '../providers/account/account';

@NgModule({
  declarations: [
    MyApp,
    FriendsPage,
    HomePage,
    TabsPage,
    GroupsPage,
    DeptOverviewCardComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FriendsPage,
    HomePage,
    TabsPage,
    GroupsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CurrencyProvider,
    AccountProvider
  ]
})
export class AppModule {}
