import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding} from 'ionic-angular';
import { UserData } from '../../providers/data/user-data';
import {DrugsService} from '../../providers/data/drugs/drugsservice';

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
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private drugsService:DrugsService,
                private user: UserData,
                public alertCtrl: AlertController) {
              //set the default to Drugs Inventory tab segment
              this.segment = "invt";
    }
 
    ionViewLoaded(){
 
    }
 
    adddrugimages(){
        if (typeof this.modeldrugs !== 'undefined' && this.modeldrugs !== null)
            {    
                this.modeldrugs.forEach(function(adg) 
                {
                    //console.log('inside for loop');
                    
                    
                    var strdrugtype = adg.drugtype;
                    strdrugtype = strdrugtype.toUpperCase();
                    
                    switch (strdrugtype) {
                        case "TABLET":
                            adg.drugimage = "img/tablet.png";
                            break;
                        case "CREAM":
                            adg.drugimage = "img/ointment.png";
                            break;
                        case "SYRUP":
                            adg.drugimage = "img/syrup.png";
                            break;
                        case "DROPS":
                            adg.drugimage = "img/drops.png";
                            break;
                        case "SUSPENSION":
                            adg.drugimage = "img/suspension.png";
                            break;
                    }

                });                             
            }
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
  

    addFavorite(slidingItem: ItemSliding, drugdata) {
        console.log(drugdata.drugname);

    if (this.user.hasFavorite(drugdata.drugid)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, drugdata, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(drugdata.drugid);
    console.log("ok")
      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Drug Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            console.log("close");
           // slidingItem.close()
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

   removeFavorite(slidingItem: ItemSliding, sessionData, title) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
           

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }
 
}