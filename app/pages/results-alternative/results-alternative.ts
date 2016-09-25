import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UtilitiesService} from '../../providers/data/utilities/utilitiesservice';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the ResultsAlternativePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/results-alternative/results-alternative.html',
  providers: [UtilitiesService]
})
export class ResultsAlternativePage {

  drugparams: any;
  drugname: any;
  searching: any = false;
  vwalternativedrugdetails : any
  lresultcount = 0;

  constructor(public navParams: NavParams,private navCtrl: NavController, private utilitydrugsService:UtilitiesService) {

      console.log(navParams.data);
      this.drugname = navParams.data;
      

      this.searching=true;

      // get detailed drug information
      this.lresultcount = -1;
      //this.vwsuppliers = null;
      this.utilitydrugsService.getAlternativeDrugs(this.drugname).then((data) => {

      this.vwalternativedrugdetails = data;
     
      this.lresultcount = this.vwalternativedrugdetails.length;
     
     //console.log("batch count:");
     // console.log(this.lbatchcount);
      this.utilitydrugsService.data=null;
      this.searching=false;

  });


  }
}
