import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { SearchAlternativePage } from '../search-alternative/search-alternative';

@Component({
  templateUrl: 'build/pages/tools/tools.html'
})
export class ToolsPage {
  constructor(private navCtrl: NavController) {
  
  }

gotoDrugAlternativePage(){
    // go to the drug details page
        // and pass in the drug data
        this.navCtrl.push(SearchAlternativePage);
}  

}
