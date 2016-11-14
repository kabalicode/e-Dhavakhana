import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding,ToastController} from 'ionic-angular';
//import {Toast} from "ionic-native";
import { AddOrderPage } from '../../tools/orderwanting/addorder';

// providers
import {LocalOrderBookService} from '../../../providers/data/local/orderservice';


@Component({
  templateUrl: 'build/pages/tools/orderwanting/wanting.html',
})
export class OrderWantingsPage {
 
    vwdrugs: any;
   
    //segment:any;
    //public favlist: any;

    //drugslist: Array<Object>;
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private localorderbookservice : LocalOrderBookService,
                public alertCtrl: AlertController,
                private toastCtrl: ToastController) {
        
        //set the default to Drugs Inventory tab segment
      // this.segment = "invt";

       // console.log("constructor method");


    }
    
 ionViewWillEnter() {
      console.log("ionviewwillenter");
      this.vwdrugs = this.localorderbookservice.globalorderbooklist;
 }
   
    public gotoAddOrder()
    {
        // go to the drug details page
        // and pass in the drug data
       // console.log("dsdsdsdsds");
        this.nav.push(AddOrderPage);
        
    } 

removeOrder(slidingItem: ItemSliding, item) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Would you like to remove this drug from your order book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
           // console.log('Cancel clicked');
            alert.dismiss();
            return true;
          }
        },
        {
          text: 'Remove',
          handler: () => {
            let navTransition = alert.dismiss();  

            this.localorderbookservice.removeOrder(item).then((data) => {
              console.log(data.name);
              console.log("ss");
              if(data.name === "Error"){
                this.showToast("Error Occurred while retrieving favorites:" + data.message, "middle");
                return false;
              }
            });

            this.vwdrugs = this.localorderbookservice.globalorderbooklist;
            navTransition.then(() => {
              this.nav.pop();
            });
            alert.dismiss();
            return false;

          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }
 
  showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    }
}