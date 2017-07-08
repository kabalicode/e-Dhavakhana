import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { BillingSearchPage } from '../sales/billing/search';
import {DrugsPage} from '../inventory/search'
import {OrderWantingsPage} from '../tools/orderwanting/wanting';
import {OrderBookPage} from '../order/orderbooking/order';

@Component({
  templateUrl: 'build/pages/order/order.html'
})
export class OrderPage {
  constructor(private navCtrl: NavController) {
  
  }

gotoCounterSales(){
  console.log("counter sales !!");
  this.navCtrl.push(OrderBookPage);
}


gotoOrderWantingPage(){
    // go to the order wanting page
        this.navCtrl.push(OrderWantingsPage);
} 

}