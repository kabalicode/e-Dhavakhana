import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { SearchAlternativePage } from '../tools/search-alternative/search-alternative';

import { SearchDrugDictonaryPage } from '../tools/drugdictonary/search';
import {OrderWantingsPage} from '../tools/orderwanting/wanting';
import {LocalOrderBookService} from '../../providers/data/local/orderservice';
import {ErrorDetailsPage} from '../tools/errors/details';
import {MyCustomExceptionHandler} from  '../../providers/data/utilities/customexceptionhandler';

@Component({
  templateUrl: 'build/pages/tools/tools.html',
  providers : [MyCustomExceptionHandler],
  //{useClass: MyCustomExceptionHandler}
})
export class ToolsPage {
    
    private objerrorslist : any;

    constructor(private navCtrl: NavController, private localorderbookservice : LocalOrderBookService, private localerrors: MyCustomExceptionHandler) {
        

  }

ionViewWillEnter() {
    this.localerrors.getLocalErrors()
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
    // go to the order wanting page
        this.navCtrl.push(OrderWantingsPage);
} 

gotoSystemErrors(){
    // go to the system errors page
     this.objerrorslist = this.localerrors.globalerrors
     this.navCtrl.push(ErrorDetailsPage, this.objerrorslist)
}

}
