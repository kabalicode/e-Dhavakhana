import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController,LoadingController,ToastController } from 'ionic-angular';
import {ViewController} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { AbstractControl} from '@angular/common';

// providers
import {LocalOrderBookService} from '../../../providers/data/local/orderservice';
import {SafeHttp} from '../../../providers/data/utilities/safehttp';
import {OrderWantingsPage} from '../../tools/orderwanting/wanting';


@Component({
  templateUrl: 'build/pages/tools/orderwanting/addorder.html',
 // providers: [LocalOrderBookService]
})
export class AddOrderPage {
 
  // form controls
  drugname: AbstractControl;
  drugtype: AbstractControl;
  mfgcode:AbstractControl;
  qty:AbstractControl;

  // form name  
  adddrug : any;


  // variables to hold data
  manufacturer:any;
  medicinename:any;
  medicinetype:any;
  orderqty:any;
  vwmedicinedetails:any;
  ldrugdetails = 0;

  constructor(private nav: NavController, 
              private modalCtrl: ModalController,
              private localorderbookservice: LocalOrderBookService,
              public alertCtrl: AlertController,
              private fb: FormBuilder,
              private toastCtrl: ToastController,
              public loadingCtrl:LoadingController,
              public viewCtrl: ViewController,
              private safenetwork: SafeHttp) 
    {

        this.adddrug = fb.group({
            drugname: ['', Validators.compose([Validators.required])],
            drugtype: ['',Validators.compose([Validators.required])],
            mfgcode: ['',Validators.compose([Validators.required,])],
            qty: ['',Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
          });

        this.drugname = this.adddrug.controls['drugname']; 
        this.drugtype = this.adddrug.controls['drugtype']; 
        this.mfgcode = this.adddrug.controls['mfgcode'];
        this.qty = this.adddrug.controls['qty'];


    }    

 manageDrug(): void {
  
   console.log("save!!!!")

   try {
            if (this.safenetwork.connection)
            { 
                  let drugitem = {
                      drugname: this.medicinename.toUpperCase(),
                      drugtype: this.medicinetype.toUpperCase(),
                      mfgcode: this.manufacturer.toUpperCase(),
                      status: "OPEN",
                      qty : this.orderqty,
              };

              this.localorderbookservice.addOrder(drugitem).then((res) => {

                  //return true;
                  if( res == true){
                              let alert = this.alertCtrl.create({
                              title: "Order Book",
                              message: drugitem.drugname + " - "+ drugitem.drugtype + " is sucessfully added to the order wanting book",
                              buttons: [
                              {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: () => {
                                  //console.log('Cancel clicked');
                                  // do nothing
                                }
                              },
                              {
                                text: 'Ok',
                                handler: () => {
                                  //console.log('Update Clicked');
                                this.dismiss();
                                }
                              }
                            ]
                          });
                          alert.present(); 
               }else{
                   
                      this.showToast("Error Occurred while adding order:" + res.message, "middle");
                      return;
              }
      
          });

            }else
            {
              this.safenetwork.showNetworkAlert();
            }  
   } catch (error) {
    // console.log("ee")
     console.log(error);
   }


  } // manage drug

  dismiss(){
      this.viewCtrl.dismiss();
  }

  showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    }

} // add drugs page