import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding} from 'ionic-angular';
import {Toast} from "ionic-native";
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
                public alertCtrl: AlertController) {
        
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
          }
        },
        {
          text: 'Remove',
          handler: () => {
            let navTransition = alert.dismiss();  

            let result = this.localorderbookservice.removeOrder(item);
            this.vwdrugs = this.localorderbookservice.globalorderbooklist;

            //if(result == 1){
               // this.showToast("Sucessfully removed from the order book","bottom");
           // }

            navTransition.then(() => {
                this.nav.pop();
               });
            
           
            // close the sliding item and hide the option buttons
            //slidingItem.close();
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
        Toast.show(message, "short", position).subscribe(
            toast => {
                //console.log(toast);
            }
        );
    }
 
}