import {Component, ViewChild, ExceptionHandler, provide} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, AlertController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import { Network } from 'ionic-native';
import {enableProdMode} from '@angular/core';
import {MyCustomExceptionHandler} from './providers/data/utilities/customexceptionhandler';
import {AwsUtil} from './providers/auth/aws.service'

// Pages
import {HomePage} from './pages/home/home';
import {LoginComponent,LogoutComponent} from './pages/security/auth';
import {ToolsPage} from './pages/tools/tools';
import {DrugsPage} from './pages/inventory/search';
import {MasterPage} from './pages/master/master';
import {InvoicePage} from './pages/invoice/invoice';
import {InvoiceAddPage} from './pages/invoice/invoice-add/invoice-add';
import {SearchAlternativePage} from './pages/tools/search-alternative/search-alternative';
import {MymessagesPage} from './pages/mymessages/mymessages';
import {SupplierSearchPage} from './pages/master/supplier/search';
import {DefaultPage} from './pages/default/default';
import {SalesPage} from './pages/sales/sales';
import {OrderPage} from './pages/order/order';


//import providers
import {LocalDrugInventory} from './providers/data/local/inventoryservice';
import {LocalSupplierMaster} from './providers/data/local/supplierservice';
import {SafeHttp} from './providers/data/utilities/safehttp';
import {UserProfile} from './providers/data/utilities/UserProfile';
import {LocalOrderBookService} from './providers/data/local/orderservice';
import {InventoryService} from './providers/data/inventory/inventoryservice';
import {SupplierAPIService} from './providers/data/supplier/supplierservice';


import {
  CognitoUtil,
  UserLoginService,
  UserParametersService,
  UserRegistrationService,
  CognitoCallback,LoggedInCallback,
  Callback
} from "./providers/auth/cognito.service";

import {
  EventsService
} from "./providers/auth/events.service";

declare var Connection;



@Component({
  templateUrl: 'build/app.html',
  //providers: [SafeHttp]
})
export class MyApp implements Callback {
  @ViewChild(Nav) nav: Nav;
  onDevice: boolean;
 

 
  rootPage:any;
  pages: Array<{title: string, icon:string, component: any, showchild:boolean,
    child: Array<{title:string, icon:string, component: any}>}>;

  networkstatus: string;  
  constructor(
    public platform: Platform,
    public alertCtrl: AlertController,
    public menu: MenuController,
    private safeHttp: SafeHttp,
    private awsUtil: AwsUtil,
    private userLoginService: UserLoginService,
    private eventsService: EventsService,
    private UserProfile: UserProfile,
    public userService:UserLoginService,
    private userparamutil: UserParametersService,
    private invtservice:InventoryService
  ) {
    this.initializeApp();
    this.onDevice = this.platform.is('cordova');

    // set our app's pages
    this.pages = [
      { title: 'Home', icon:'home', component: HomePage , showchild:false ,child: null},
      { title: 'Sales', icon:'pricetags', component: SalesPage, showchild:false , child: null  },
      { title: 'Invoice', icon:'clipboard', component: InvoicePage, showchild:false , child:null },
      { title: 'Inventory', icon:'flask', showchild:false , child: null, component: DrugsPage},
      { title: 'Order', icon:'paper', component: OrderPage, showchild:false , child: null  },
      { title: 'Master', icon:'build', component: MasterPage, showchild:false , child:null},
      { title: 'Reports', icon:'stats', component: DefaultPage, showchild:false , child: null },
      { title: 'Notifications', icon:'notifications', component: MymessagesPage, showchild:false , child: null },
      { title: 'Tools', icon:'hammer', showchild:false , component: ToolsPage,child:null}, 
      { title: 'Finance', icon:'logo-usd', component: DefaultPage, showchild:false , child: null  },
      { title: 'CRM', icon:'person', component: DefaultPage, showchild:false , child: null },
      { title: 'Settings', icon:'settings', component: DefaultPage, showchild:false , child: null }
    ];
  }

  callback(){

  }

  callbackWithParam(result:any){
    console.log("user param inside app.ts util: results-------");
    for (var i = 0; i < result.length; i++) {
    switch (result[i].getName()){
        case "custom:accountno" :
            this.UserProfile.setStoreAccountNo(result[i].getValue());
            break;
        case "custom:storename" :
           this.UserProfile.setStoreName(result[i].getValue());
            break;
        case "name" :
            this.UserProfile.setLoggedUserName(result[i].getValue());
            break;
        case "email" :
            this.UserProfile.setUserEmail(result[i].getValue());
            break;
    }
    }
    this.rootPage = HomePage; // redirect to home page once the user attributes are retrieved !!
    return ;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      this.rootPage = HomePage;

      // commenting code for development
      /*this.awsUtil.initAwsService();
      console.log("logged in user in app.ts:" + this.awsUtil.firstLogin);
      if (this.awsUtil.firstLogin) {
          this.userparamutil.getParameters(this)
      }else
      {
        this.rootPage = LoginComponent;
      }*/

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

  logout(){
      this.userLoginService.logout();
      this.nav.setRoot(LoginComponent);
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
ionicBootstrap(MyApp,[provide(ExceptionHandler, {useClass: MyCustomExceptionHandler}),
    CognitoUtil,
    AwsUtil,
    UserLoginService,
    UserParametersService,
    EventsService,
    UserRegistrationService,
    SafeHttp,
    UserProfile,
    LocalDrugInventory,
    LocalSupplierMaster,
    InventoryService,
    SupplierAPIService,
    LocalOrderBookService]);