import { Component } from '@angular/core';
import { NavController,AlertController,ModalController,ItemSliding } from 'ionic-angular';
import {UtilitiesService} from '../../providers/data/utilities/utilitiesservice';
import { ResultsAlternativePage } from '../results-alternative/results-alternative';

/*
  Generated class for the SearchAlternativePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/search-alternative/search-alternative.html',
  providers: [UtilitiesService]
})
export class SearchAlternativePage {

    vwsearchresults: any;
    modelsearchresults:any;
    bapiinvoked= false;
    searchcount = -1;
    queryText = '';
    searching: any = false;


  constructor(private navCtrl: NavController, private utilitydrugsService:UtilitiesService) {

  }

updatedrugsearch(){
      
        this.vwsearchresults = null;
        var filtervalue = [];
		
        
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();
        console.log(fltvar);

        // We will only perform the search if we have 3 or more characters
        if ((fltvar.length == 5) || (fltvar.length >5 && this.bapiinvoked==false)) {
                this.searching=true;
                this.utilitydrugsService.getSuggestedDrugs(fltvar).then((data) => {
                console.log(data);
                //this.vwdrugs = data;
                this.modelsearchresults = data;
                //this.adddrugimages();
                this.vwsearchresults = this.modelsearchresults;
                this.bapiinvoked = true;
                this.utilitydrugsService.data=null;
                this.searchcount = this.vwsearchresults.length;
                this.searching=false;
                //console.log("drugcount inside if:" + this.drugsearchcount);
            });

        }else if (fltvar.trim().length == 0){
                this.bapiinvoked = false;
                this.searchcount = -1;
                this.utilitydrugsService.data=null;
                this.vwsearchresults = null;
                this.modelsearchresults = null;
                this.searching=false;
        }else {
            var serachData=this.modelsearchresults;
            this.searching=false;
            if (typeof serachData !== 'undefined' && serachData !== null)
              {
                    for (var i = 0; i <serachData.length; i++) {

                    var jsval = (serachData[i].DrugName);
                    jsval = jsval.toUpperCase();

                   // console.log(jsval);
                   // console.log(jsval.indexOf(fltvar));
                    if (jsval.indexOf(fltvar) >= 0) 
                        filtervalue.push(serachData[i]);

                   // console.log()    
                    
                }
                this.vwsearchresults = filtervalue;
                this.searchcount = filtervalue.length;
              }

          }        
      }

  gotoAlternativeDrugDetails(drugname)
    {
        // go to the drug details page
        // and pass in the drug data
        this.navCtrl.push(ResultsAlternativePage, drugname);
        
    } 

}
