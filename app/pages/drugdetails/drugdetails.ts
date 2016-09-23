import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import {DrugsService} from '../../providers/data/drugs/drugsservice';

// Import the drug model
import {Drug} from '../../models/drug';
//import {supplier} from '../../models/supplier';

/*
  Generated class for the DrugdetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/drugdetails/drugdetails.html',
  providers: [DrugsService]
})
export class DrugdetailsPage {
  drugparams: any;
  drugid: number;
  searching: any = false;
  vwdrug: Drug = new Drug;
  lbatchcount = -1;
  //vwsuppliers: supplier = new supplier;
  //vwbatches : any;

  constructor(public navParams: NavParams, private drugsService:DrugsService) {
      this.drugid = navParams.data;

      this.searching=true;

      // get detailed drug information
      this.lbatchcount = -1;
      //this.vwsuppliers = null;
      this.drugsService.getDrugDetails(this.drugid).then((data) => {

      this.vwdrug = data;
     
      this.lbatchcount = this.vwdrug.suppliers.length;
     //console.log("batch count:");
     // console.log(this.lbatchcount);
      this.drugsService.drugdetailsdata=null;
      this.searching=false;
      
 
      
    });

  }


   

}
