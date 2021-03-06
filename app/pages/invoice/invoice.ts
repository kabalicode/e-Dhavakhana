import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding,LoadingController} from 'ionic-angular';
import { UserData } from '../../providers/data/user-data';
import {InvoiceService} from '../../providers/data/invoice/invoiceservice';
import {SQLite, Toast} from "ionic-native";
import {InvoiceDetailsPage} from '../invoice/invoicedetails';
import {InvoiceAddPage} from '../invoice-add/invoice-add';

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
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private invoiceService:InvoiceService,
                private user: UserData,
                public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
              //set the default to Drugs Inventory tab segment
              this.segment = "invt";

              //retrieve the drug favorites if any
              this.invoiceService.getFavSuppliers().then((data) => {
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
        Toast.show(message, "short", position).subscribe(
            toast => {
                console.log(toast);
            }
        );
    }

    public addFavorite(item) {
      if(this.favlist){
            var found = JSON.stringify(this.favlist).indexOf(item.supplierid);
            if(found>-1){
                this.showToast("Error: Supplier already added to Favourites","bottom"); 
                return;
            }
        }

      let result = this.invoiceService.addFavSupplier(item);
      this.refresh();
      if( result == 1){
        this.showToast("Favorite added successfully","bottom");
      }
    }
 
    public refresh() {
        this.invoiceService.getFavSuppliers().then((data) => {
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
 
    updatesuppliersearch(){
        this.vwsuppliers = null;
        var filtervalue = [];        
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();
 
        console.log("query text:" + this.queryText);
        // We will only perform the search if we have 3 or more characters
        if ((fltvar.trim().length > 2 )) {
                
                let loading = this.loadingCtrl.create({
                    content: 'Please Wait...'
                });

                loading.present();
                
                this.invoiceService.getSuppliers(fltvar).then((data) => {
                    this.modelsupplier = data;
                    this.vwsuppliers = this.modelsupplier;
                    console.log("suppliers result:" + JSON.stringify(this.vwsuppliers));
                    console.log("suppliers result length:" + this.vwsuppliers.length);
                    this.suppliersearchcount = this.vwsuppliers.length;
                    
                    loading.dismiss();
                });

        }else{
                this.suppliersearchcount = -1;
                this.vwsuppliers = null;
                this.modelsupplier = null;
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
            let navTransition = alert.dismiss();  

            let result = this.invoiceService.removeFavSupplier(item);
            this.refresh();

            if(result == 1){
                this.showToast("Favorite removed","bottom");
            }

            navTransition.then(() => {
                this.nav.pop();
                });
           
            // close the sliding item and hide the option buttons
            slidingItem.close();
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