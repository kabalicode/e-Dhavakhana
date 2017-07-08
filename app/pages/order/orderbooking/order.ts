import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding,ToastController,LoadingController} from 'ionic-angular';

import { DrugdetailsPage } from '../../inventory/details';
import { AddDrugsPage } from '../../inventory/add';
import {Toast} from "ionic-native";

// providers
//import {InventoryService} from '../../../providers/data/inventory/inventoryservice';
import {LocalDrugInventory} from '../../../providers/data/local/inventoryservice';
import {OrderService} from '../../../providers/data/order/orderservice';
import {SafeHttp} from '../../../providers/data/utilities/safehttp';


@Component({
  templateUrl: 'build/pages/order/orderbooking/order.html',
  providers : [OrderService]
})
export class OrderBookPage {
 
    //vwdrugs: any;
    modeldrugs:any;
    bdrugapiinvoked= false;
    drugsearchcount = -1;
    queryText = '';
    //searching: any = false;
    segment:any;
    public favlist: any;
    ERROR = false;
    lordercount = 0;
    vworders: any;

    //drugslist: Array<Object>;
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private ordersvcs:OrderService,
                private localdrugservice : LocalDrugInventory,
                public alertCtrl: AlertController,
                private safenetwork: SafeHttp,
                public loadingCtrl:LoadingController,
                private toastCtrl: ToastController) {
        
        //set the default to Drugs Inventory tab segment
        this.segment = "invt";

        console.log("constructor method");


    }
    

ionViewWillEnter() {
  console.log("ionviewwillenter");
  if (this.safenetwork.connection)
   {
        let loading = this.loadingCtrl.create({
                    content: 'Please Wait...'
        });

        loading.present();

        this.ERROR = false;
        

        // get detailed drug information
        this.lordercount = 0;


        this.ordersvcs.getAllOrders().then((data) => {

            if (data === null)
            {
                this.ERROR = true;
                //this.drugname = "";
                this.lordercount = -1;
            }else if(data.name == "Error")
            {
                console.log("Error:" + data.message);
                loading.onDidDismiss(() => {
                    this.showToast("Error occurred while retrieving orders:" + data.message, "middle");
                });
                loading.dismiss();
                return;
            } // Error handling loop

            loading.onDidDismiss(() => 
            {
              
                this.vworders = data;
        
                if ((typeof this.vworders === 'undefined') || (this.vworders === null))
                  {
                    this.ERROR = true;
                    this.lordercount = -1;
                  }
                else
                {
                  this.ERROR = false;
                  this.lordercount = this.vworders.length;
                }  

                //console.log(this.errormessage);  

                this.ordersvcs.ordersdata=null;
            }); // loading on dismiss loop

        loading.dismiss();
        console.log("new inventory details page");
      }); //get drug details loop
  
   }else
   {
     this.safenetwork.showNetworkAlert();
   }

}


 
     showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    } 


 

    ionViewLoaded(){
 
    }
 
  


  gotoDrugDetails(drugid)
    {
        // go to the drug details page
        // and pass in the drug data
        this.nav.push(DrugdetailsPage, drugid);
        
    } 

      public gotoAddDrugs()
    {
        // go to the drug details page
        // and pass in the drug data
        //console.log("dsdsdsdsds");
        this.nav.push(AddDrugsPage);
        
    } 
 
}