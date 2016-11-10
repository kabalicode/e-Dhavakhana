import {Component} from "@angular/core";
import {NavController, ToastController, AlertController,ModalController,ItemSliding,LoadingController} from 'ionic-angular';
import { UserData } from '../../providers/data/user-data';
import {InvoiceService} from '../../providers/data/invoice/invoiceservice';
import {SQLite, Toast} from "ionic-native";
import {InvoiceDetailsPage} from '../invoice/invoicedetails';
import {InvoiceAddPage} from '../invoice/invoice-add/invoice-add';
import {LocalSupplierMaster} from '../../providers/data/local/supplierservice';

@Component({
  templateUrl: 'build/pages/invoice/invoice.html',
  providers: [UserData, InvoiceService]
})
export class InvoicePage {
 
    vwsuppliers: any;
    modelsupplier:any;
    binvoiceapiinvoked= false;
    suppliersearchcount = -1;
    queryText = '';
    searching: any = false;
    segment:any;
    public favlist: any;
    searchkey:string;
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private invoiceService:InvoiceService,
                private user: UserData,
                private localSupplierMaster: LocalSupplierMaster,
                private toastCtrl: ToastController,
                public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
              //set the default to Drugs Inventory tab segment
              this.segment = "invt";

              //retrieve the drug favorites if any
              this.invoiceService.getFavSuppliers().then((data) => {
                  if(data.name == "Error"){
                      this.showToast("Error Occurred while retrieving favorites:" + data.message, "middle");
                      return;
                  }
                    this.favlist = [];
                    console.log("number of fav:" + data.res.rows.length);
                    if(data.res.rows.length > 0) {
                        for(var i = 0; i < data.res.rows.length; i++) {
                            this.favlist.push({id: data.res.rows.item(i).id, name: data.res.rows.item(i).name,streetname: data.res.rows.item(i).streetname, city: data.res.rows.item(i).city });
                        }
                    }
              });
    }
 
    showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    }

    public addFavorite(item) {
      if(this.favlist){
            var found = JSON.stringify(this.favlist).indexOf(item.supplierid);
            if(found>-1){
                this.showToast("Error: Supplier already added to Favourites","bottom"); 
                return;
            }
        }

      this.invoiceService.addFavSupplier(item).then(result => {
        this.refresh();
        if( result == 1){
            this.showToast("Favorite added successfully","bottom");
        }else{
            this.showToast("Error occurred while adding Favorite","bottom"); 
        }
      });
    }
 
    public refresh() {
        this.invoiceService.getFavSuppliers().then((data) => {
            if(data.name == "Error"){
                this.showToast("Error Occurred while retrieving favorites:" + data.message, "middle");
                return;
            }

            this.favlist = [];
                    console.log("number of fav:" + data.res.rows.length);
                    if(data.res.rows.length > 0) {
                        for(var i = 0; i < data.res.rows.length; i++) {
                            this.favlist.push({id: data.res.rows.item(i).id, name: data.res.rows.item(i).name,streetname: data.res.rows.item(i).streetname, city: data.res.rows.item(i).city });
                        }
            }
        });
    }

    ionViewLoaded(){
 
    }

 /*
    checkmatches(obj){
        console.log(obj);
        console.log("search key in checkmatches:" + this.searchkey);
        if (obj.suppliername.toUpperCase().indexOf(this.searchkey.toUpperCase()) > -1) {
            return true;
        } else {
            return false;
        }
    }

    updatesuppliersearch(){
        this.vwsuppliers = null;
        var filtervalue = [];        
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();
 
        console.log("query text:" + this.queryText);
        // We will only perform the search if we have 3 or more characters
        if ((fltvar.trim().length > 2 )) {
                
              /* let loading = this.loadingCtrl.create({
                    content: 'Please Wait...'
                });

                loading.present();*/
                //var params = {searchkey:this.queryText.trim()};
              //  this.vwsuppliers = this.localSupplierMaster.globalsupplierlist.filter(this.checkmatches,params);
               // this.suppliersearchcount = this.vwsuppliers.length;
                
             /*   this.invoiceService.getSuppliers(fltvar).then((data) => {
                    this.modelsupplier = data;
                    this.vwsuppliers = this.modelsupplier;
                    console.log("suppliers result:" + JSON.stringify(this.vwsuppliers));
                    console.log("suppliers result length:" + this.vwsuppliers.length);
                    this.suppliersearchcount = this.vwsuppliers.length;
                    
                    //loading.dismiss();
                });*/

       // }else{
             //   this.suppliersearchcount = -1;
            //    this.vwsuppliers = null;
               // this.modelsupplier = null;
    //   }        
  //  } */

      updatesuppliersearch(){
        this.vwsuppliers = null;
        var filtervalue = [];
		
       
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();

 

           if (fltvar.trim().length == 0){
               
                this.suppliersearchcount = -1;
                this.vwsuppliers = null;
                this.modelsupplier = null;
               // this.searching=false;
        }else
        {

            this.modelsupplier = this.localSupplierMaster.globalsupplierlist;
            var serachData=this.modelsupplier;
            console.log(serachData);
            //this.searching=false;
            if (typeof serachData !== 'undefined' && serachData !== null)
                {
                    for (var i = 0; i <serachData.length; i++) {

                    var jsval = (serachData[i].suppliername);

                    if (jsval.indexOf(fltvar) >= 0) 
                        filtervalue.push(serachData[i]);
                    
                }
                this.vwsuppliers = filtervalue;
                this.suppliersearchcount = filtervalue.length;
                }
        }    
    }
  

   removeFavorite(slidingItem: ItemSliding, item) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Would you like to remove this supplier from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            
            this.invoiceService.removeFavSupplier(item).then(result => {
            this.refresh();

            alert.dismiss().then(res =>  
                {    
                if(result == 1){
                    this.showToast("Favorite removed","bottom");
                }else{
                    this.showToast("Error Occured while removing Favorite","bottom");
                }});
            });
 
            // close the sliding item and hide the option buttons
            //slidingItem.close();
            return false;
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
   }

   getSupplierInvoices(supplierid, suppliername){
       this.nav.push(InvoiceDetailsPage, {id:supplierid, name:suppliername});
   }

   addNewInvoice(){
        /*let invoiceAddPageModal = this.modalCtrl.create(InvoiceAddPage);
        invoiceAddPageModal.present();*/
        this.nav.push(InvoiceAddPage);
    }
 
}