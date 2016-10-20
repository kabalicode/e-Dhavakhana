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
  providers : [LocalSupplierMaster,SupplierAPIService]
})
export class SupplierSearchPage {
 
    vwsuppliers: any;
    modelsuppliers:any;
    bdrugapiinvoked= false;
    drugsearchcount = -1;
    queryText = '';
    searching: any = false;
    segment:any;
    //public favlist: any;

    //drugslist: Array<Object>;
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private supplierapiservice:SupplierAPIService,
                private localsupplierservice : LocalSupplierMaster,
                public alertCtrl: AlertController) {
        
        //set the default to Drugs Inventory tab segment
       this.segment = "invt";

        console.log("constructor method");


        //retrieve the drug favorites if any
     /*   this.invtservice.getFavDrugs().then((data) => {
            this.favlist = [];
            if(data.res.rows.length > 0) {
                for(var i = 0; i < data.res.rows.length; i++) {
                    this.favlist.push({id: data.res.rows.item(i).id, name: data.res.rows.item(i).name,type: data.res.rows.item(i).type });
                }
            }
        });*/

    }
    
 
    updatesuppliersearch(){
        this.vwsuppliers = null;
        var filtervalue = [];
		
       
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();

 /*
        if (fltvar.trim().length == 0){
                this.bdrugapiinvoked = false;
                this.drugsearchcount = -1;
                this.invtservice.data=null;
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

                    var jsval = (serachData[i].drugname);

                    if (jsval.indexOf(fltvar) >= 0) 
                        filtervalue.push(serachData[i]);
                    
                }
                this.vwsuppliers = filtervalue;
                this.drugsearchcount = filtervalue.length;
                }
        }*/

        // We will only perform the search if we have 3 or more characters
        if ((fltvar.trim().length == 3) || (fltvar.trim().length >3 && this.bdrugapiinvoked==false)) {
                this.searching=true;
                this.supplierapiservice.searchSupplier(fltvar).then((data) => {
                //console.log(data);
                //this.vwdrugs = data;
                this.modelsuppliers = data;
                //this.adddrugimages();
                this.vwsuppliers = this.modelsuppliers;
                this.bdrugapiinvoked = true;
                this.supplierapiservice.data=null;
                this.drugsearchcount = this.vwsuppliers.length;
                this.searching=false;
                //console.log("drugcount inside if:" + this.drugsearchcount);
            });

        }else if (fltvar.trim().length == 0){
                this.bdrugapiinvoked = false;
                this.drugsearchcount = -1;
                this.supplierapiservice.data=null;
                this.vwsuppliers = null;
                this.modelsuppliers = null;
                this.searching=false;
        }else {
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
                this.drugsearchcount = filtervalue.length;
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