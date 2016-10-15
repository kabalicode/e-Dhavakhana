import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import {InventoryService} from '../../providers/data/inventory/inventoryservice';

// Import the drug model
import {Drug} from '../../models/drug';
//import {supplier} from '../../models/supplier';

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
  searching: any = false;
  vwdrug: Drug = new Drug;
  lbatchcount = -1;
  //vwsuppliers: supplier = new supplier;
  //vwbatches : any;

  constructor(public navParams: NavParams, private invtdataservice:InventoryService) {
      this.drugid = navParams.data;

      this.searching=true;

      // get detailed drug information
      this.lbatchcount = -1;
      //this.vwsuppliers = null;
      this.invtdataservice.getDrugDetails(this.drugid).then((data) => {

      this.vwdrug = data;
     
      this.lbatchcount = this.vwdrug.suppliers.length;
     //console.log("batch count:");
     // console.log(this.lbatchcount);
      this.invtdataservice.drugdetailsdata=null;
      this.searching=false;
      
      console.log("new inventory details page");
 
      
    });

  }


   

}
