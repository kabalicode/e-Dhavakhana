import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import {InventoryService} from '../../providers/data/inventory/inventoryservice';
import {SafeHttp} from '../../providers/data/utilities/safehttp';

// Import the drug model
import {Drug} from '../../models/drug';
import { EditDrugsPage } from '../../pages/inventory/editdrug';

/*
  Generated class for the DrugdetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/inventory/details.html',
  providers: [InventoryService]
})
export class DrugdetailsPage {
  drugparams: any;
  drugid: number;
  drugname : string;
  vwdrug: Drug = new Drug;
  lbatchcount = -1;
  ERROR = false;

  constructor(public navParams: NavParams, 
             private invtdataservice:InventoryService,
             public loadingCtrl:LoadingController,
             private nav: NavController,
             private safenetwork: SafeHttp,
             private toastCtrl: ToastController) {
      this.drugid = navParams.data;

      //this.searching=true;

     

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
        this.lbatchcount = -1;

        this.invtdataservice.getDrugDetails(this.drugid).then((data) => {

            if (data === null)
            {
                this.ERROR = true;
                this.drugname = "";
                this.lbatchcount = -1;
            }else if(data.name == "Error")
            {
                console.log("Error:" + data.message);
                loading.onDidDismiss(() => {
                    this.showToast("Error occurred while retrieving suggested drug details:" + data.message, "middle");
                });
                loading.dismiss();
                return;
            } // Error handling loop

            loading.onDidDismiss(() => 
            {
              
                this.vwdrug = data;
        
                if ((typeof this.vwdrug === 'undefined') || (this.vwdrug === null))
                  {
                    this.ERROR = true;
                    this.drugname = "";
                    this.lbatchcount = -1;
                  }
                else
                {
                  this.ERROR = false;
                  this.drugname = this.vwdrug.drugname;
                  this.lbatchcount = this.vwdrug.suppliers.length;
                }  

                //console.log(this.errormessage);  

                this.invtdataservice.drugdetailsdata=null;
            }); // loading on dismiss loop

        loading.dismiss();
        console.log("new inventory details page");
      }); //get drug details loop
  
   }else
   {
     this.safenetwork.showNetworkAlert();
   }

}


  public gotoEditDrug()
    {
        // go to the drug details page
        // and pass in the drug data
        console.log("dsdsdsdsds");
         if (typeof this.vwdrug !== 'undefined' && this.vwdrug !== null)
              this.nav.push(EditDrugsPage,this.vwdrug);
        else
          {
            console.log("error!!")
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

}
