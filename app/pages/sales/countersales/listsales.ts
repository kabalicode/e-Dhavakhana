import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { CounterSaleAddPage } from '../../sales/countersales/addsale';

@Component({
  templateUrl: 'build/pages/sales/countersales/listsales.html'
})
export class ListCounterSalesPage {
  constructor(private navCtrl: NavController) {
  
  }

gotoAddCounterSales(){
  console.log("counter sales !!");
  this.navCtrl.push(CounterSaleAddPage);
}


}