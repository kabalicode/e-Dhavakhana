import {Component} from '@angular/core';
import {ViewController,LoadingController,ToastController} from 'ionic-angular';
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
  //searching: any = false;
  //service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, 
               private drugutilservice:UtilitiesService,
               public loadingCtrl:LoadingController,
               private toastCtrl: ToastController) {
   // this.autocompleteItems = [];
    this.autocomplete = {
      pinquery: ''
    };
    this.result = "";
  }

  dismiss() {
   
    this.viewCtrl.dismiss();
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
        //this.searching=true;
        let loading = this.loadingCtrl.create({
                    content: 'Please Wait...'
        });

        loading.present();
        
        this.drugutilservice.findAddress(this.autocomplete.pinquery).then((data) => {


                    if(data!=null && data.name == "Error")
                    {
                      console.log("Error:" + data.message);
                      loading.onDidDismiss(() => {
                          this.showToast("Error occurred while searching address:" + data.message, "middle");
                      });
                      loading.dismiss();
                      return;
                    } // Error handling loop

                    loading.onDidDismiss(() => 
                    {

                        this.vwaddress = data;
                        this.drugutilservice.addressdetails=null;

                        me.result="";
                        
                        
                        this.vwaddress = this.vwaddress.data;
                        console.log(this.vwaddress);
                        if ((this.vwaddress.length <=0))
                        {
                            
                            me.result = "No address found for supplied pin no."
                            //me.autocompleteItems.push(me.autocomplete.pinquery);
                        }
                  }); // on dismiss loop
                  loading.dismiss();
            });

    }else if ((this.autocomplete.pinquery.trim().length < 6))
    {
        this.vwaddress=null;
        me.result = "";
    } 

   
  }

    showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    } 

}
