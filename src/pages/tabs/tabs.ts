import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { GroupsPage } from '../groups/groups';
import { FriendsPage } from '../friends/friends';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = GroupsPage;
  tab3Root = FriendsPage;

  constructor() {

  }
}
