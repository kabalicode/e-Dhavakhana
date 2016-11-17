import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import {SupplierAPIService} from '../../../providers/data/supplier/supplierservice';

import { EditSupplierPage } from '../../master/supplier/editsupplier';

/*
  Generated class for the DrugdetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/master/supplier/details.html',
  providers: [SupplierAPIService]
})
export class SupplierDetailsPage {

  supplierid: string;
  
 // vwsupplier: Supplier = new Supplier;
 
 vwsupplier:any;

  //vwsuppliers: supplier = new supplier;
  suppliername: string;
  suppliertown: string;
  areaname : string;
  pin: string;
  state: string;
  country:string
  city: string;
  contactname: string;
  officeno: number;
  mobileno: number;
  GSTNo: string;
  TINNo: string;

  constructor(public navParams: NavParams, 
              private supplierservice:SupplierAPIService,
              public loadingCtrl:LoadingController,
              private nav: NavController,
              private toastCtrl: ToastController) {
      this.supplierid = navParams.data;

    

  }

      public gotoEditupplier()
    {
        // go to the drug details page
        // and pass in the drug data
        console.log("dsdsdsdsds");
         if (typeof this.vwsupplier !== 'undefined' && this.vwsupplier !== null)
              this.nav.push(EditSupplierPage,this.vwsupplier);
        else
          {
            console.log("error!!")
          }
      
        
    } 
   
   ionViewWillEnter() {
      console.log("ionviewwillenter"); 

       // this.searching=true;
      let loading = this.loadingCtrl.create({
                    content: 'Please Wait...'
        });

        loading.present();


      this.supplierservice.getSupplierDetails(this.supplierid).then((data) => {

        if(data!=null && data.name == "Error")
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
            this.vwsupplier = data;
            
            console.log(this.vwsupplier);
            this.supplierservice.data=null;
            //loading.dismiss();
            
            this.suppliername="";

            if (typeof this.vwsupplier !== 'undefined' && this.vwsupplier !== null)
            {
                this.suppliername=this.vwsupplier.suppliername;
                this.suppliertown = this.vwsupplier.suppliertown;

            }


            if (typeof this.vwsupplier.address !== 'undefined' && this.vwsupplier.address !== null)
            {
              this.areaname = this.vwsupplier.address.areaname;
              this.city = this.vwsupplier.address.suppliercity;
              this.state = this.vwsupplier.address.state;
              this.country = this.vwsupplier.address.country;
              this.pin = this.vwsupplier.address.pin;
            }

            if (typeof this.vwsupplier.contactdetails !== 'undefined' && this.vwsupplier.contactdetails !== null)
            {
                this.contactname = this.vwsupplier.contactdetails.contactname;
                this.officeno = this.vwsupplier.contactdetails.landlineno;
                this.mobileno = this.vwsupplier.contactdetails.mobileno;
            }

            
            if (typeof this.vwsupplier.taxdetails !== 'undefined' && this.vwsupplier.taxdetails !== null)
            {
                this.GSTNo = this.vwsupplier.taxdetails.GST;
                this.TINNo = this.vwsupplier.taxdetails.TIN;
              // console.log(this.GSTNo);
            }

        //console.log("new supplier details page");
 
        });// on dismiss lop
        loading.dismiss();
    });

   }// ion viewwillenter

       showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    } 

}
