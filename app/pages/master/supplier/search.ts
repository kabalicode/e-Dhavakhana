import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding} from 'ionic-angular';

//import { DrugdetailsPage } from '../../inventory/details';
import { AddSupplierPage } from '../../master/supplier/addsupplier';
//import {Toast} from "ionic-native";

// providers
import {SupplierAPIService} from '../../../providers/data/supplier/supplierservice';
import {LocalSupplierMaster} from '../../../providers/data/local/supplierservice';


@Component({
  templateUrl: 'build/pages/master/supplier/search.html',
  providers : [SupplierAPIService]
})
export class SupplierSearchPage {
 
    vwsuppliers: any;
    modelsuppliers:any;
   
    suppliersearchcount = -1;
    queryText = '';
    searching: any = false;
    //segment:any;
    //public favlist: any;

    //drugslist: Array<Object>;
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private supplierapiservice:SupplierAPIService,
                private localsupplierservice : LocalSupplierMaster,
                public alertCtrl: AlertController) {
        
        //set the default to Drugs Inventory tab segment
      // this.segment = "invt";

        console.log("constructor method");




    }
    
 
    updatesuppliersearch(){
        this.vwsuppliers = null;
        var filtervalue = [];
		
       
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();

 

           if (fltvar.trim().length == 0){
               
                this.suppliersearchcount = -1;
                this.vwsuppliers = null;
                this.modelsuppliers = null;
                this.searching=false;
        }else
        {

            this.modelsuppliers = this.localsupplierservice.globalsupplierlist;
            var serachData=this.modelsuppliers;
            this.searching=false;
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
  


  gotoSupplierDetails(supplierid)
    {
        // go to the drug details page
        // and pass in the drug data
       // this.nav.push(DrugdetailsPage, drugid);
        
    } 

      public gotoAddSuppliers()
    {
        // go to the drug details page
        // and pass in the drug data
        console.log("dsdsdsdsds");
       this.nav.push(AddSupplierPage);
        
    } 
 
}