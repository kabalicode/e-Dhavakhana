import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding} from 'ionic-angular';
import {DrugsService} from '../../providers/data/drugs/drugsservice';
import {Toast} from "ionic-native";

@Component({
  templateUrl: 'build/pages/drugs/adddrugs.html',
  providers: [DrugsService]
})
export class AddDrugsPage {
 
    vwdrugs: any;
    bdrugapiinvoked= false;
    drugsearchcount = -1;
    searching: any = false;
    
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private drugsService:DrugsService,
                public alertCtrl: AlertController) {
        
              
        }    
}