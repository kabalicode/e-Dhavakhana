import { Component } from '@angular/core';
import { NavController,ToastController, NavParams } from 'ionic-angular';
@Component({
  templateUrl: 'build/pages/tools/errors/details.html',
})
export class ErrorDetailsPage {

    vwerrors: any;
    errorlist = [];
    searchcount = -1;
   // searching: any = false;


  constructor(private navCtrl: NavController, 
             private toastCtrl: ToastController,
              public navParams: NavParams) {
        this.searchcount = -1;
        this.vwerrors = navParams.data ; 

         if (typeof this.vwerrors === 'undefined' || this.vwerrors === null)
          this.searchcount = 0
  }


}

