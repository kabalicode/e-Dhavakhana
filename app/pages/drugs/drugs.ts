import {Component} from "@angular/core";
import {NavController, AlertController,ModalController,ItemSliding} from 'ionic-angular';
import { UserData } from '../../providers/data/user-data';
import {DrugsService} from '../../providers/data/drugs/drugsservice';
import {SQLite, Toast} from "ionic-native";

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
    public database: SQLite;
    public favlist: Array<Object>;
 
    constructor(private nav: NavController, 
                private modalCtrl: ModalController,
                private drugsService:DrugsService,
                private user: UserData,
                public alertCtrl: AlertController) {
              //set the default to Drugs Inventory tab segment
              this.segment = "invt";

              this.database = new SQLite();
              this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
                  this.refresh();
              }, (error) => {
                  console.log("ERROR opening database while retrieving drugs fav list : ", error);
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
                //this.alertCtrl.create( {title: "Error", message:"Drug already added to Favourites",buttons:[{text:'OK'}]}).present();
                this.showToast("Error: Drug already added to Favourites","bottom");
                return;
            }
        }
        this.database.executeSql("INSERT INTO DRUG_FAVORITES (id, name, type) VALUES (?,?,?)", [item.drugid, item.drugname, item.drugtype]).then((data) => {
            console.log("INSERTED fav drug into fav table: " + JSON.stringify(data));
            this.showToast("Favorite added successfully","bottom");
        }, (error) => {
            console.log("ERROR: during inserting drug into fav table" + JSON.stringify(error.err));
        });
        this.refresh();
    }
 
    public refresh() {
        this.database.executeSql("SELECT * FROM DRUG_FAVORITES", []).then((data) => {
            this.favlist = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.favlist.push({id: data.rows.item(i).id, name: data.rows.item(i).name,type: data.rows.item(i).type });
                }
            }
        }, (error) => {
            console.log("ERROR: during retrieving favorites from local table " + JSON.stringify(error));
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
            // they want to remove this drug from their favorites
            this.database.executeSql("DELETE FROM DRUG_FAVORITES WHERE ID = ?", [item.id]).then((data) => {
                console.log("Deleted fav drug from fav table: " + JSON.stringify(data));
                this.showToast("Favorite removed!!!","bottom");
                navTransition.then(() => {
                   this.nav.pop();
                 });
            }, (error) => {
                console.log("ERROR: during deleting drug from fav table" + JSON.stringify(error.err));
                navTransition.then(() => {
                   this.nav.pop();
                 });
            });
            this.refresh();
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
 
}