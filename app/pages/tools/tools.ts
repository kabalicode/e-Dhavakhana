import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { SearchAlternativePage } from '../tools/search-alternative/search-alternative';

import { SearchDrugDictonaryPage } from '../tools/drugdictonary/search';
import {OrderWantingsPage} from '../tools/orderwanting/wanting';
import {LocalOrderBookService} from '../../providers/data/local/orderservice';

@Component({
  templateUrl: 'build/pages/tools/tools.html'
})
export class ToolsPage {
    
    constructor(private navCtrl: NavController, private localorderbookservice : LocalOrderBookService) {
        
  }

gotoDrugAlternativePage(){
    // go to the drug details page
        // and pass in the drug data
        this.navCtrl.push(SearchAlternativePage);
}  

gotoDrugDictonaryPage(){
    // go to the drug details page
        // and pass in the drug data
        this.navCtrl.push(SearchDrugDictonaryPage);
} 

gotoOrderWantingPage(){
    // go to the drug details page
        // and pass in the drug data
      //  this.vwdrugs = this.localorderbookservice.globalorderbooklist;
        this.navCtrl.push(OrderWantingsPage);
} 

}
