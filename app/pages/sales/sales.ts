import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { BillingSearchPage } from '../sales/billing/search';
import { ListCounterSalesPage } from '../sales/countersales/listsales';
import {DrugsPage} from '../inventory/search'

@Component({
  templateUrl: 'build/pages/sales/sales.html'
})
export class SalesPage {
  constructor(private navCtrl: NavController) {
  
  }

gotoCounterSales(){
  console.log("counter sales !!");
  this.navCtrl.push(ListCounterSalesPage);
}

gotoBillingPage(){
  this.navCtrl.push(BillingSearchPage);
}  

}