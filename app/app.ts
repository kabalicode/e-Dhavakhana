import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, AlertController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ToolsPage} from './pages/tools/tools';
import {DrugsPage} from './pages/inventory/search';

import {MasterPage} from './pages/master/master';
//import {AddDrugsPage} from './pages/inventory/add';
import {InvoicePage} from './pages/invoice/invoice';
import {InvoiceAddPage} from './pages/invoice/invoice-add/invoice-add';
import {SearchAlternativePage} from './pages/tools/search-alternative/search-alternative';
import {MymessagesPage} from './pages/mymessages/mymessages';
import {SupplierSearchPage} from './pages/master/supplier/search';
import {enableProdMode} from '@angular/core';
import {DefaultPage} from './pages/default/default';
import { Network } from 'ionic-native';

//import providers
import {LocalDrugInventory} from './providers/data/local/inventoryservice';
import {LocalSupplierMaster} from './providers/data/local/supplierservice';
import {SafeHttp} from './providers/data/utilities/safehttp';
import {LocalOrderBookService} from './providers/data/local/orderservice';

declare var Connection;

@Component({
  templateUrl: 'build/app.html',
  //providers: [SafeHttp]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;
  onDevice: boolean;
  // make HomePage the root (or first) page
  rootPage: any = HomePage;
  pages: Array<{title: string, icon:string, component: any, showchild:boolean,
    child: Array<{title:string, icon:string, component: any}>}>;

  networkstatus: string;  

  constructor(
    public platform: Platform,
    public alertCtrl: AlertController,
    public menu: MenuController,
    private safeHttp: SafeHttp
  ) {
    this.initializeApp();
    this.onDevice = this.platform.is('cordova');

    // set our app's pages
    this.pages = [
      { title: 'Sales', icon:'pricetags', component: DefaultPage, showchild:false , child: null  },
      { title: 'Invoice', icon:'clipboard', component: InvoicePage, showchild:false , child:null },
      { title: 'Inventory', icon:'flask', showchild:false , child: null, component: DrugsPage},
      { title: 'Master', icon:'build', component: MasterPage, showchild:false , child:null},
      { title: 'Reports', icon:'stats', component: DefaultPage, showchild:false , child: null },
      { title: 'Notifications', icon:'notifications', component: MymessagesPage, showchild:false , child: null },
      { title: 'Tools', icon:'hammer', showchild:false , component: ToolsPage,child:null}, 
      { title: 'Finance', icon:'logo-usd', component: DefaultPage, showchild:false , child: null  },
      { title: 'CRM', icon:'person', component: DefaultPage, showchild:false , child: null },
      { title: 'Settings', icon:'settings', component: DefaultPage, showchild:false , child: null },
      { title: 'Logout', icon:'log-out', component: DefaultPage, showchild:false , child: null },
    ];
  }

/*
        child:[
              { title: 'Order Management', icon:'cart', component: DefaultPage},
              { title: 'Substitutes', icon:'search', component: SearchAlternativePage}]},
*/

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

   

      // check connection and set accordingly
      if (this.isOnline()) 
         { 
           this.safeHttp.connection = true; 
           this.networkstatus = "Online";
           
         }
      else  
         {
           this.showNetworkAlert();
            this.safeHttp.connection = false;
            this.networkstatus = "Offline";
         }  
      
      /* Code for listening to network connection */
      this.safeHttp.connectionType = Network.connection.toString();
      let disconnectSubscription = Network.onDisconnect().subscribe(() => {
        this.safeHttp.connection = false;
        this.networkstatus = "Offline";
        this.showNetworkAlert();
       });

       let connectSubscription = Network.onConnect().subscribe(() => {
        this.safeHttp.connection = true;
         this.networkstatus = "Online";
        this.safeHttp.connectionType = Network.connection.toString();
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

    isOnline(): boolean {
    if(this.onDevice && Network.connection){
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }

}
enableProdMode();
ionicBootstrap(MyApp,[SafeHttp,LocalDrugInventory,LocalSupplierMaster,LocalOrderBookService]);