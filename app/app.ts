import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, AlertController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {DrugsPage} from './pages/inventory/search';
//import {AddDrugsPage} from './pages/inventory/add';
import {InvoicePage} from './pages/invoice/invoice';
import {InvoiceAddPage} from './pages/invoice-add/invoice-add';
import {SearchAlternativePage} from './pages/search-alternative/search-alternative';
import {MymessagesPage} from './pages/mymessages/mymessages';
import {SupplierSearchPage} from './pages/master/supplier/search';
import {enableProdMode} from '@angular/core';
import {DefaultPage} from './pages/default/default';
import { Network } from 'ionic-native';
//import providers
import {LocalDrugInventory} from './providers/data/local/inventoryservice';
import {LocalSupplierMaster} from './providers/data/local/supplierservice';
import {SafeHttp} from './providers/data/utilities/safehttp';


@Component({
  templateUrl: 'build/app.html',
  providers: [SafeHttp]
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
    public menu: MenuController,
    private safeHttp: SafeHttp
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Dashboard', icon:'add', component: HomePage , showchild:false ,child: null},
      { title: 'Sales', icon:'pricetags', component: DefaultPage, showchild:false , child: null  },
      { title: 'Invoice', icon:'clipboard', component: InvoicePage, showchild:false , child:[
          { title: 'New Invoice', icon:'add', component: InvoiceAddPage}] },
      { title: 'Inventory', icon:'home', showchild:false , child: null, component: DrugsPage},
      { title: 'Master Data', icon:'build', component: DrugsPage, showchild:false , child:[
          { title: 'Supplier', icon:'contact', component: SupplierSearchPage}]  },
      { title: 'Analytics', icon:'stats', component: DefaultPage, showchild:false , child: null },
      { title: 'Notifications', icon:'chatboxes', component: MymessagesPage, showchild:false , child: null },
      { title: 'Tools', icon:'hammer', showchild:false , component: HomePage,
        child:[
          { title: 'Substitutes', icon:'search', component: SearchAlternativePage}]},
      { title: 'Books', icon:'logo-usd', component: DefaultPage, showchild:false , child: null  },
      { title: 'MyAccount', icon:'person', component: DefaultPage, showchild:false , child: null },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      /* Code for listening to network connection */
      console.log("Network Connection type :" + Network.connection.valueOf());
      this.safeHttp.connectionType = Network.connection.toString();
      let disconnectSubscription = Network.onDisconnect().subscribe(() => {
        this.safeHttp.connection = false;
        this.showNetworkAlert();
       });

       let connectSubscription = Network.onConnect().subscribe(() => {
        this.safeHttp.connection = true;
        this.safeHttp.connectionType = Network.connection.toString();
        console.log("Network Connection type:" + Network.connection.toString);
       });
       /*Code for listening to network connection */

    });
    
  }

  showNetworkAlert(){
      let alert = this.alertCtrl.create({
            title: "Network Error",
            message: "Internet Connection lost. Please check your connection",
            buttons: ['OK']
        });
        alert.present();
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
enableProdMode();
ionicBootstrap(MyApp,[SafeHttp,LocalDrugInventory,LocalSupplierMaster]);