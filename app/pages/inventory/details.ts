import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
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
             private safenetwork: SafeHttp) {
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

        //this.searching=false;

        loading.dismiss();
        
        console.log("new inventory details page");
  
        
      });
  
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

}
