import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, AlertController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {DrugsPage} from './pages/drugs/drugs';
import {InvoicePage} from './pages/invoice/invoice';
import {SearchAlternativePage} from './pages/search-alternative/search-alternative';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HomePage the root (or first) page
  rootPage: any = HomePage;
  pages: Array<{title: string, icon:string, component: any, showchild:boolean,
    child: Array<{title:string, icon:string, component: any}>}>;

  constructor(
    public platform: Platform,
    public alertCtrl: AlertController,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Dashboard', icon:'add', component: HomePage , showchild:false ,child: null},
      { title: 'Sales', icon:'pricetags', component: DrugsPage, showchild:false , child: null  },
      { title: 'Invoice', icon:'clipboard', component: InvoicePage, showchild:false , child: null },
      { title: 'Drug Inventory', icon:'home', showchild:false , component: DrugsPage,
        child:[
          { title: 'Add New Drug', icon:'add', component: DrugsPage},
          { title: 'Edit Drug', icon: 'create', component: DrugsPage},
          { title: 'Search Drug', icon: 'search', component: DrugsPage},
          { title: 'Import Drugs', icon: 'swap', component: DrugsPage} ]},
      { title: 'Master Data', icon:'build', component: DrugsPage, showchild:false , child: null  },
      { title: 'Analytics', icon:'stats', component: DrugsPage, showchild:false , child: null },
      { title: 'Notifications', icon:'chatboxes', component: DrugsPage, showchild:false , child: null },
      { title: 'Tools', icon:'hammer', showchild:false , component: HomePage,
        child:[
          { title: 'Alternative Drug', icon:'search', component: SearchAlternativePage}]},
      { title: 'Book of business', icon:'logo-usd', component: DrugsPage, showchild:false , child: null  },
      { title: 'MyAccount', icon:'person', component: DrugsPage, showchild:false , child: null },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

    });
    
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  toggleMenuItem(p){
    p.showchild = !p.showchild;
  }
}

ionicBootstrap(MyApp);