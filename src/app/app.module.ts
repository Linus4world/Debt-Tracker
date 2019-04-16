import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

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
import { FilemanagerProvider } from '../providers/filemanager/filemanager';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [
    MyApp,
    FriendsPage,
    HomePage,
    TabsPage,
    GroupsPage,
    GroupcreationPage,
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
    GroupsPage,
    GroupcreationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CurrencyProvider,
    AccountProvider,
    FilemanagerProvider,
    File
  ]
})
export class AppModule {}
