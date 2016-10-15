import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {UtilitiesService} from '../../providers/data/utilities/utilitiesservice'

@Component({
  templateUrl: 'build/pages/inventory/autocomplete.html',
  providers: [UtilitiesService]
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  result;
  vwdrugs:any;
  //service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, private drugutilservice:UtilitiesService) {
    this.autocompleteItems = [];
    this.autocomplete = {
      drugquery: ''
    };
    this.result = "";
  }

  dismiss() {
    var strdrugname = this.autocomplete.drugquery;
    strdrugname = strdrugname + "|!|DISMISS"
    strdrugname = strdrugname.toUpperCase();
    this.viewCtrl.dismiss(strdrugname);
  }

  chooseItem(item: any) {
    console.log("choosen item" + item);
    console.log(typeof(item));
    this.viewCtrl.dismiss(item);
  }
  
  updateSearch() {
    if (this.autocomplete.drugquery == '') {
      this.autocompleteItems = [];
      return;
    }
   let me = this;
    console.log(this.autocomplete.drugquery);

    this.drugutilservice.getSuggestedDrugs(this.autocomplete.drugquery).then((data) => {

      
                this.vwdrugs = data;
                this.drugutilservice.suggesteddrugdata=null;
                this.autocompleteItems = [];
                me.result="";
                
                if ((this.vwdrugs.length >0))
                {
                        this.vwdrugs.forEach(function (prediction) {
                        me.autocompleteItems.push(prediction.DrugName);                 
                     //   this.autocompleteItems.push(prediction.DrugName);
                    });
                }else
                {
                    me.result = "No drug(s) found with matching criteria."
                    me.autocompleteItems.push(me.autocomplete.drugquery);
                }


                

            });



   
  }
}
