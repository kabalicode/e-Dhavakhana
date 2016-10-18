import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {UtilitiesService} from '../../../providers/data/utilities/utilitiesservice'

@Component({
  templateUrl: 'build/pages/master/supplier/autocomplete.html',
  providers: [UtilitiesService]
})

export class AutocompleteAddressPage {
  //autocompleteItems;
  autocomplete;
  result;
  vwaddress:any;
  searching: any = false;
  //service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, private drugutilservice:UtilitiesService) {
   // this.autocompleteItems = [];
    this.autocomplete = {
      pinquery: ''
    };
    this.result = "";
  }

  dismiss() {
    var strdrugname = this.autocomplete.pinquery;
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
    if (this.autocomplete.pinquery == '') {
      this.vwaddress=null;
      return;
    }
   let me = this;
    console.log(this.autocomplete.pinquery);

    if ((this.autocomplete.pinquery.trim().length == 6))
    {
        this.searching=true;
        this.drugutilservice.findAddress(this.autocomplete.pinquery).then((data) => {

                    this.searching=false;
                    this.vwaddress = data;
                    this.drugutilservice.addressdetails=null;
                    //this.autocompleteItems = [];
                    me.result="";
                    
                    this.vwaddress = this.vwaddress.Data;
                    console.log(this.vwaddress);
                    if ((this.vwaddress.length <=0))
                    {
                         
                        me.result = "No address found for supplied pin no."
                        //me.autocompleteItems.push(me.autocomplete.pinquery);
                    }

            });

    }else if ((this.autocomplete.pinquery.trim().length < 6))
    {
        this.vwaddress=null;
        me.result = "";
    } 

   
  }
}
