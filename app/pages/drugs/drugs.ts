import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding} from 'ionic-angular';
import { UserData } from '../../providers/data/user-data';
import {DrugsService} from '../../providers/data/drugs/drugsservice';
import { DrugdetailsPage } from '../drugdetails/drugdetails';
import { AddDrugsPage } from '../drugs/adddrugs';
import {Toast} from "ionic-native";

@Component({
  templateUrl: 'build/pages/drugs/drugs.html',
  providers: [UserData, DrugsService]
})
export class DrugsPage {
 
    vwdrugs: any;
    modeldrugs:any;
    bdrugapiinvoked= false;
    drugsearchcount = -1;
    queryText = '';
    searching: any = false;
    segment:any;
    public favlist: any;
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private drugsService:DrugsService,
                private user: UserData,
                public alertCtrl: AlertController) {
              //set the default to Drugs Inventory tab segment
              this.segment = "invt";

              //retrieve the drug favorites if any
              this.drugsService.getFavDrugs().then((data) => {
                    this.favlist = [];
                    console.log("number of fav:" + data.res.rows.length);
                    if(data.res.rows.length > 0) {
                        for(var i = 0; i < data.res.rows.length; i++) {
                            this.favlist.push({id: data.res.rows.item(i).id, name: data.res.rows.item(i).name,type: data.res.rows.item(i).type });
                        }
                    }
              });
    }
 
    showToast(message, position) {
        Toast.show(message, "short", position).subscribe(
            toast => {
                console.log(toast);
            }
        );
    }

    public addFavorite(item) {

      if(this.favlist){
            var found = JSON.stringify(this.favlist).indexOf(item.drugid);
            if(found>-1){
                this.showToast("Error: Drug already added to Favourites","bottom"); 
                return;
            }
        }

      let result = this.drugsService.addFavDrug(item);
      this.refresh();
      if( result == 1){
        this.showToast("Favorite added successfully","bottom");
      }
    }
 
    public refresh() {
        this.drugsService.getFavDrugs().then((data) => {
            this.favlist = [];
                    console.log("number of fav:" + data.res.rows.length);
                    if(data.res.rows.length > 0) {
                        for(var i = 0; i < data.res.rows.length; i++) {
                            this.favlist.push({id: data.res.rows.item(i).id, name: data.res.rows.item(i).name,type: data.res.rows.item(i).type });
                        }
            }
        });
    }

    ionViewLoaded(){
 
    }
 
    updatedrugsearch(){
        this.vwdrugs = null;
        var filtervalue = [];
		
        
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();
 

        // We will only perform the search if we have 3 or more characters
        if ((fltvar.trim().length == 3) || (fltvar.trim().length >3 && this.bdrugapiinvoked==false)) {
                this.searching=true;
                this.drugsService.getDrugs(fltvar).then((data) => {
                //console.log(data);
                //this.vwdrugs = data;
                this.modeldrugs = data;
                //this.adddrugimages();
                this.vwdrugs = this.modeldrugs;
                this.bdrugapiinvoked = true;
                this.drugsService.data=null;
                this.drugsearchcount = this.vwdrugs.length;
                this.searching=false;
                //console.log("drugcount inside if:" + this.drugsearchcount);
            });

        }else if (fltvar.trim().length == 0){
                this.bdrugapiinvoked = false;
                this.drugsearchcount = -1;
                this.drugsService.data=null;
                this.vwdrugs = null;
                this.modeldrugs = null;
                this.searching=false;
        }else {
            var serachData=this.modeldrugs;
            this.searching=false;
            if (typeof serachData !== 'undefined' && serachData !== null)
              {
                    for (var i = 0; i <serachData.length; i++) {

                    var jsval = (serachData[i].drugname);

                    if (jsval.indexOf(fltvar) >= 0) 
                        filtervalue.push(serachData[i]);
                    
                }
                this.vwdrugs = filtervalue;
                this.drugsearchcount = filtervalue.length;
              }

          }        
        }
  

   removeFavorite(slidingItem: ItemSliding, item) {
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Would you like to remove this drug from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            let navTransition = alert.dismiss();  

            let result = this.drugsService.removeFavDrug(item);
            this.refresh();

            if(result == 1){
                this.showToast("Favorite removed","bottom");
            }

            navTransition.then(() => {
                this.nav.pop();
                });
           
            // close the sliding item and hide the option buttons
            slidingItem.close();
            return false;
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  gotoDrugDetails(drugid)
    {
        // go to the drug details page
        // and pass in the drug data
        this.nav.push(DrugdetailsPage, drugid);
        
    } 

      public gotoAddDrugs()
    {
        // go to the drug details page
        // and pass in the drug data
        console.log("dsdsdsdsds");
        this.nav.push(AddDrugsPage);
        
    } 
 
}