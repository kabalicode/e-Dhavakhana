import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { SupplierSearchPage } from '../master/supplier/search';
import {DrugsPage} from '../inventory/search'

@Component({
  templateUrl: 'build/pages/master/master.html'
})
export class MasterPage {
  constructor(private navCtrl: NavController) {
  
  }

gotoSupplierPage(){
  this.navCtrl.push(SupplierSearchPage);
}

gotoDrugsPage(){
  this.navCtrl.push(DrugsPage);
}  

}