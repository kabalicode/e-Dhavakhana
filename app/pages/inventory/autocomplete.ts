import {Component} from '@angular/core';
import {ViewController,LoadingController,ToastController} from 'ionic-angular';
import {UtilitiesService} from '../../providers/data/utilities/utilitiesservice'
import {SafeHttp} from '../../providers/data/utilities/safehttp';
import { AbstractControl} from '@angular/common';
import {Validators, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'build/pages/inventory/autocomplete.html',
  providers: [UtilitiesService]
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  result;
  vwdrugs:any;
  bdrugapiinvoked= false;
  
    // form controls
  drugname: AbstractControl;

   // form name  
  formdrugsearch : any;

  constructor (public viewCtrl: ViewController, 
              private drugutilservice:UtilitiesService,
              public loadingCtrl:LoadingController,
              private safenetwork: SafeHttp,
              private toastCtrl: ToastController,
              private fb: FormBuilder) {

    this.formdrugsearch = fb.group({
            drugname: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
          });

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
    //console.log("choosen item" + item);
    //console.log(typeof(item));
    this.viewCtrl.dismiss(item);
  }
  
  updateSearch(){
        var fltvar = this.autocomplete.drugquery;
        fltvar = fltvar.toUpperCase();
      
        if (fltvar == ""){
                this.autocompleteItems = [];
                this.vwdrugs = null;
                this.result="";
        }else if (typeof this.vwdrugs !== 'undefined' && this.vwdrugs !== null) {
            var serachData=this.vwdrugs;
            let me = this;
            me.result="";
            me.autocompleteItems=[];
            if (typeof serachData !== 'undefined' && serachData !== null)
              {
                    for (var i = 0; i <serachData.length; i++) {

                    var jsval = (serachData[i].suggestion);
                    jsval = jsval.toUpperCase();

                    if (jsval.indexOf(fltvar) >= 0) 
                        me.autocompleteItems.push(serachData[i].suggestion);
                }
                if (me.autocompleteItems.length==0)
                {
                   me.result = "No drug(s) found with matching criteria."
                   me.autocompleteItems.push(me.autocomplete.drugquery);
                }
              }
        }

  }


  drugSearch() {
 
        var fltvar = this.autocomplete.drugquery;
        fltvar = fltvar.toUpperCase();

         if (this.safenetwork.connection)
            {         
                  let me = this;

                  let loading = this.loadingCtrl.create({
                        content: 'Please Wait...'
                  });

                  loading.present();
                  
                  this.drugutilservice.getSuggestedDrugs(this.autocomplete.drugquery).then((data) => {
                        
                        if(data!=null && data.name == "Error")
                        {
                            console.log("Error:" + data.message);
                            loading.onDidDismiss(() => {
                                this.showToast("Error occurred while retrieving suggested drugs:" + data.message, "middle");
                            });
                            loading.dismiss();
                            return;
                        } // Error handling loop

                        loading.onDidDismiss(() => 
                        {
                            this.vwdrugs = data;
                            this.drugutilservice.suggesteddrugdata=null;
                            this.autocompleteItems = [];
                            this.bdrugapiinvoked = true;
                            me.result="";
                            this.vwdrugs = this.vwdrugs.response;
                            this.vwdrugs = this.vwdrugs.suggestions;
                            if ((this.vwdrugs.length >0))
                            {
                                    this.vwdrugs.forEach(function (prediction) {
                                    me.autocompleteItems.push(prediction.suggestion);                 
                                //   this.autocompleteItems.push(prediction.DrugName);
                                });
                            }else
                            {
                                me.result = "No drug(s) found with matching criteria."
                                me.autocompleteItems.push(me.autocomplete.drugquery);
                            }
                        }); //loading onDidDismiss loop 

                        loading.dismiss();
                  }); //get suggested drugs loop
            }else 
            {
                this.safenetwork.showNetworkAlert();
            }    
} // end of function

  showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    }

} // end of export class