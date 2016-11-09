import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController,LoadingController } from 'ionic-angular';
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
                  //console.log("UPDATE RECORD TO LOCAL STORE");
                  //return true;

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
            
          });

     /*
              this.localdrugservice.searchDrugByName(drugitem).then((res) => {
                    let responseobject : any;
                    responseobject = res;
                   // console.log(responseobject);

                    if (typeof responseobject!== 'undefined' && responseobject!== null)
                              {
                                      responseobject = responseobject.res;
                                      responseobject = responseobject.rows[0];

                                      if (responseobject.TOTALRECORDS >0)
                                      {

                                          let alert = this.alertCtrl.create({
                                          title: "Duplicate Drug",
                                          message: drugitem.drugname + " - "+ drugitem.drugtype + " already exits in the database. Would you like to update with the new information?",
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
                                              text: 'Update',
                                              handler: () => {
                                                //console.log('Update Clicked');
                                                this.updatedrugdata(drugitem,"UPDATE");
                                              }
                                            }
                                          ]
                                        });
                                        alert.present();
                                      }else
                                      {
                                        this.updatedrugdata(drugitem,"INSERT");
                                      }
                                      
                                }
                      });  */
            }else
            {
              this.safenetwork.showNetworkAlert();
            }  
   } catch (error) {
    // console.log("ee")
     console.log(error);
   }

 

  } // manage drug

/*
syncdrugdata_local(item:any, soperation:string){

          //console.log(soperation);
          if (soperation == "UPDATE")
          {
            this.localorderbookservice.addOrder(item).then((res) => {
              //console.log("UPDATE RECORD TO LOCAL STORE");
              return true;
            });
          }else
          {
             this.localdrugservice.addDrug(item).then((res) => {
              //console.log("INSERT NEW RECORDS TO LOCAL STORE");
              return  true;
              });
          }
   
 }// store drug data to local


updatedrugdata(item:any,soperation:string)
 {
            //this.searching=true;
            let JSONPayload : string;
            let response:any;

            JSONPayload ="";

            if (soperation === "UPDATE")
            {
                
                //console.log(response); 
                this.localdrugservice.getDrugId(item).then((response) => {

                
                if (typeof response!== 'undefined' && response!== null)
                  {
                        response = response.res;
                        response = response.rows[0];
                        let drugid = response.drugid;
                        item.drugid = drugid; //Append supplier id


                        JSONPayload = '{"drugid":' + item.drugid + ','
                        JSONPayload = JSONPayload+ '"drugname":"' + item.drugname + '",'
                        JSONPayload = JSONPayload + '"drugtype":"' + item.drugtype + '",'
                        JSONPayload = JSONPayload + '"mfgcode":"' + item.mfgcode + '",'
                        JSONPayload = JSONPayload + '"scheduledrug":"' + item.scheduledrug + '",'
                        JSONPayload = JSONPayload + '"rackposition":"' + item.rackposition + '",'
                        JSONPayload = JSONPayload + '"minqty":' + item.minqty + ','
                        JSONPayload = JSONPayload + '"packagetype" :"' + item.packagetype + '",'
                        JSONPayload = JSONPayload + '"composition":"' + item.composition + '"}'
                       // console.log(JSONPayload);
                        this.syncdrugdata_AWS_local(JSONPayload,item);
                  }
                        
                });

            }else
            {
                       
                        JSONPayload = JSONPayload+ '{"drugname":"' + item.drugname + '",'
                        JSONPayload = JSONPayload + '"drugtype":"' + item.drugtype + '",'
                        JSONPayload = JSONPayload + '"mfgcode":"' + item.mfgcode + '",'
                        JSONPayload = JSONPayload + '"scheduledrug":"' + item.scheduledrug + '",'
                        JSONPayload = JSONPayload + '"rackposition":"' + item.rackposition + '",'
                        JSONPayload = JSONPayload + '"minqty":' + item.minqty + ','
                        JSONPayload = JSONPayload + '"packagetype" :"' + item.packagetype + '",'
                        JSONPayload = JSONPayload + '"composition":"' + item.composition + '"}'
                       
                        this.syncdrugdata_AWS_local(JSONPayload,item);
                        
            }
             
 }
 

syncdrugdata_AWS_local(JSONPayload: string, item: any){

//console.log(JSONPayload);  
       
  let loading = this.loadingCtrl.create({
                  content: 'Please Wait...'
      });

  loading.present();

  this.invtservice.manageDrug(JSONPayload).then((res) => {

          let responseobject : any;
          responseobject = res;

          if (typeof responseobject!== 'undefined' && responseobject!== null)
          {
              if (responseobject.status==200)
              {
                let sjsonresponse = responseobject._body;
                responseobject = JSON.parse(sjsonresponse);

                if (responseobject.response == "SUCESS")
                {
                  let drugid = responseobject.drugid;
                  item.drugid = drugid; //Append supplier id

                  let soperation = responseobject.operation;
                  let smessage = "";
                  let stitle = "";

                  if (soperation == "UPDATE")
                  {
                    smessage = this.medicinename + ":" + this.medicinetype +", sucessfully updated !";
                    stitle = "Update Drug : "
                  }else if (soperation == "CREATE")
                  {
                   smessage = this.medicinename + ":" + this.medicinetype +", sucessfully added !";
                    stitle = "Add New Drug : " 
                  }
                  this.syncdrugdata_local(item,soperation);

                  loading.onDidDismiss(() => {
                    let alert = this.alertCtrl.create({
                      title: stitle,
                      message: smessage,
                      buttons: [
                        {
                          text: 'Ok',
                          handler: () => {
                           // console.log('Ok clicked');
                            //loading.dismiss();
                            //this.viewCtrl.dismiss();
                            this.medicinename=null;
                            this.medicinetype =null;
                            this.manufacturer="";
                           // this.schedulemedicine="";
                           // this.medicineposition = "";
                            this.orderqty ="";
                           // this.packagetype="";
                           // this.comp="";
                          }
                        }
                      ]
                    });
                    //loading.dismiss();
                    alert.present();
                  });

                }
                  loading.dismiss();
                  //console.log("new code");

              }
          }



      }, (err) => {
          console.log(err);
        
      });
    
}

 */

  dismiss(){
      this.viewCtrl.dismiss();
  }

} // add drugs page