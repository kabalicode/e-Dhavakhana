import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding} from 'ionic-angular';
import {InventoryService} from '../../providers/data/inventory/inventoryservice';
import {Toast} from "ionic-native";

@Component({
  templateUrl: 'build/pages/inventory/add.html',
  providers: [InventoryService]
})
export class AddDrugsPage {
 
    vwdrugs: any;
    bdrugapiinvoked= false;
    drugsearchcount = -1;
    searching: any = false;
    
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private invtservice:InventoryService,
                public alertCtrl: AlertController) {
        
              
        }    
}