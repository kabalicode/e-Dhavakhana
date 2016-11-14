import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController , LoadingController,ToastController} from 'ionic-angular';
import {ViewController} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { AbstractControl} from '@angular/common';
import {AutocompleteAddressPage} from './autocomplete';

// providers
import {SupplierAPIService} from '../../../providers/data/supplier/supplierservice';
import {LocalSupplierMaster} from '../../../providers/data/local/supplierservice';
import {UtilitiesService} from '../../../providers/data/utilities/utilitiesservice'



@Component({
  templateUrl: 'build/pages/master/supplier/addsupplier.html',
  providers: [SupplierAPIService,UtilitiesService]
})
export class AddSupplierPage {
 
  // form controls
  suppliername: AbstractControl;
  
  address:AbstractControl;
  city:AbstractControl;
  state:AbstractControl;
  country:AbstractControl;
  pin:AbstractControl;
  
  contactname:AbstractControl;
  landlineno:AbstractControl;
  mobileno:AbstractControl;
  
  GSTNO:AbstractControl;
  TINNO:AbstractControl;

  // form name  
  addsupplier : any;


  // variables to hold data
  vendorname:any;
  vendoraddress:any;
  vendorcity:any;
  vendorstate:any;
  vendorcountry:any;
  vendorpin:any;
  vendorcontactname:any;
  vendorlandlineno:any;
  vendormobileno:any;
  vendorGST:any;
  vendorTIN:any;

  
  vwmedicinedetails:any;
  
    
  // busy variables
  //searching: any = false;

  

  constructor(private nav: NavController, 
              private modalCtrl: ModalController,
              private supplierapiservice:SupplierAPIService,
              private localsupplierservice: LocalSupplierMaster,
              private utildrugservice: UtilitiesService,
              public alertCtrl: AlertController,
              private fb: FormBuilder,
              public loadingCtrl:LoadingController,
              private toastCtrl: ToastController) 
    {

        this.addsupplier = fb.group({
            suppliername: ['', Validators.compose([Validators.required])],
            address: ['',Validators.compose([Validators.required,])],
            city: ['',],
            state: [''],
            country: [''],
            pin: [''],
            contactname: ['',Validators.compose([Validators.required,])],
            landlineno: ['',Validators.compose([Validators.required,])],
            mobileno: ['',Validators.compose([Validators.required,])],
            GSTNO: ['',Validators.compose([Validators.required,])],
            TINNO: ['',Validators.compose([Validators.required,])]
          });

        this.suppliername = this.addsupplier.controls['suppliername']; 

        this.address = this.addsupplier.controls['address'];
        this.city = this.addsupplier.controls['city'];
        this.state = this.addsupplier.controls['state'];
        this.country = this.addsupplier.controls['country'];
        this.pin = this.addsupplier.controls['pin'];

        this.contactname = this.addsupplier.controls['contactname'];
        this.landlineno= this.addsupplier.controls['landlineno'];
        this.mobileno=this.addsupplier.controls['mobileno'];
        this.GSTNO=this.addsupplier.controls['GSTNO'];
        this.TINNO=this.addsupplier.controls['TINNO'];
  
    


    }    

postSupplierInfo(){
  //console.log("i am here");

let supplieritem = {
        supplierid: null,
        suppliername: this.vendorname.toUpperCase(),
        address: this.vendoraddress.toUpperCase(),
        suppliercity: this.vendorcity.toUpperCase(),
        state: this.vendorstate.toUpperCase(),
        country : this.vendorcountry,
        pin:  this.vendorpin,
        contactname: this.vendorcontactname.toUpperCase(),
        landline:this.vendorlandlineno,
        mobileno:this.vendormobileno,
        GST: this.vendorGST,
        TIN: this.vendorTIN

    };

    this.localsupplierservice.searchSupplierByName(supplieritem).then((res) => {
      
      let responseobject : any;
      responseobject = res;
      
      if(responseobject.name == "Error")
        {
            console.log("Error:" + responseobject.message);
            this.showToast("Error occurred while searching supplier name in local store:" + responseobject.message, "middle");
            return;
        } // Error handling loop

       if (typeof responseobject!== 'undefined' && responseobject!== null)
                {
                        responseobject = responseobject.res;
                        responseobject = responseobject.rows[0];

                        if (responseobject.TOTALRECORDS >0)
                        {

                            let alert = this.alertCtrl.create({
                            title: "Duplicate Supplier",
                            message: supplieritem.suppliername + " - "+ supplieritem.suppliercity + " already exits in the database. Would you like to update the supplier with new details?",
                            buttons: [
                              {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: () => {
                                  //console.log('Cancel clicked');
                                }
                              },
                              {
                                text: 'Update',
                                handler: () => {
                                  //console.log('Update Clicked');
                                  this.updatesupplierdata(supplieritem,"UPDATE");
                                }
                              }
                            ]
                          });
                          alert.present();
                        }else
                        {
                          this.updatesupplierdata(supplieritem,"INSERT");
                        }
                         
                  }
              });  


}


syncdrugdata_local(item:any, soperation:string){

          //console.log(soperation);
          if (soperation == "UPDATE")
          {

            this.localsupplierservice.updateSupplier(item).then((res) => {
                if(res.name == "Error")
                {
                  console.log("Error:" + res.message);
                  this.showToast("Error occurred while updating supplier name in local store:" + res.message, "middle");
                  return;
                } // Error handling loop
                return res;
            });
          }else
          {
              this.localsupplierservice.addSupplier(item).then((res) => {
                if(res.name == "Error")
                {
                  console.log("Error:" + res.message);
                  this.showToast("Error occurred while adding supplier name in local store:" + res.message, "middle");
                  return;
                } // Error handling loop
              return  res;
              });
          }
                
 }// store drug data to local

syncdrugdata_AWS_local(JSONPayload: string, item: any){

//console.log(JSONPayload);  
       
  let loading = this.loadingCtrl.create({
                  content: 'Please Wait...'
      });

  loading.present();

  this.supplierapiservice.manageSupplier(JSONPayload).then((res) => {

          let responseobject : any;
          responseobject = res;

          if(responseobject.name == "Error")
          {
            console.log("Error:" + responseobject.message);
            loading.onDidDismiss(() => {
                this.showToast("Error occurred while updating supplier to AWS:" + responseobject.message, "middle");
            });
            loading.dismiss();
            return;
          } // Error handling loop

          loading.onDidDismiss(() => 
          {

              if (typeof responseobject!== 'undefined' && responseobject!== null)
              {
                  if (responseobject.status==200)
                  {
                    let sjsonresponse = responseobject._body;
                    responseobject = JSON.parse(sjsonresponse);

                    if (responseobject.response == "SUCESS")
                    {
                      let ssupplierid = responseobject.supplierid;
                      item.supplierid = ssupplierid; //Append supplier id

                      let soperation = responseobject.operation;
                      let smessage = "";
                      let stitle = "";

                      if (soperation == "UPDATE")
                      {
                        smessage = this.vendorname + " has been  updated  sucessfully !";
                        stitle = "Update Supplier : "
                      }else if (soperation == "CREATE")
                      {
                        smessage = this.vendorname + " has been added sucessfully !";
                        stitle = "Add New Supplier : " 
                      }
                        // store drug info to local store
                        this.syncdrugdata_local(item,soperation); // store data to local

                        let alert = this.alertCtrl.create({
                          title: stitle,
                          message: smessage,
                          buttons: [
                            {
                              text: 'Ok',
                              handler: () => {
                                this.vendorname=null;
                                this.vendoraddress =null;
                                this.vendorcity="";
                                this.vendorstate="";
                                this.vendorcountry = "";
                                this.vendorpin ="";
                                this.vendorcontactname="";
                                this.vendorlandlineno="";
                                this.vendormobileno="";
                                this.vendorGST="";
                                this.vendorTIN="";
                              }
                            }
                          ]
                        });
                        alert.present();
                    } // success if loop
                  } // staus = 200
              } // if loop
          }); // on dismiss loop
          loading.dismiss();
      }); // manageSupplier loop
     
}


 updatesupplierdata(item:any,soperation:string)
 {
            //this.searching=true;
            let JSONPayload : string;
            let response:any;

            JSONPayload ="";

            if (soperation === "UPDATE")
            {
                
                //console.log(response); 
                this.localsupplierservice.getSupplierId(item).then((response) => {

                if(response.name == "Error")
                {
                  console.log("Error:" + response.message);
                  this.showToast("Error occurred while searching supplier name in local store:" + response.message, "middle");
                  return;
                } // Error handling loop
                
                if (typeof response!== 'undefined' && response!== null)
                  {
                        response = response.res;
                        response = response.rows[0];
                        let supplierid = response.supplierid;
                        item.supplierid = supplierid; //Append supplier id

                        //console.log(supplierid);

                        JSONPayload = '{"supplierid":"' + item.supplierid + '",'
                        JSONPayload = JSONPayload+ '"suppliername":"' + item.suppliername + '",'
                        JSONPayload = JSONPayload + '"address": {"areaname":"' + item.address + '",'
                        JSONPayload = JSONPayload + '"suppliercity":"' + item.suppliercity + '",'
                        JSONPayload = JSONPayload + '"state":"' + item.state + '",'
                        JSONPayload = JSONPayload + '"pin" :"' + item.pin + '"},'
                        JSONPayload = JSONPayload + '"contactinfo": {"contactname":"' + item.contactname + '",'
                        JSONPayload = JSONPayload + '"landlineno" :' + item.landline + ','
                        JSONPayload = JSONPayload + '"mobileno": ' + item.mobileno + '},'
                        JSONPayload = JSONPayload + '"taxdetails": {"TIN":"' + item.TIN + '",'
                        JSONPayload = JSONPayload + '"GST":"' + item.GST + '"}}'
                        this.syncdrugdata_AWS_local(JSONPayload,item);
                  }

                });

            }else
            {
                        JSONPayload = '{"suppliername":"' + item.suppliername + '",'
                        JSONPayload = JSONPayload + '"address": {"areaname":"' + item.address + '",'
                        JSONPayload = JSONPayload + '"suppliercity":"' + item.suppliercity + '",'
                        JSONPayload = JSONPayload + '"state":"' + item.state + '",'
                        JSONPayload = JSONPayload + '"pin" :"' + item.pin + '"},'
                        JSONPayload = JSONPayload + '"contactinfo": {"contactname":"' + item.contactname + '",'
                        JSONPayload = JSONPayload + '"landlineno" :' + item.landline + ','
                        JSONPayload = JSONPayload + '"mobileno": ' + item.mobileno + '},'
                        JSONPayload = JSONPayload + '"taxdetails": {"TIN":"' + item.TIN + '",'
                        JSONPayload = JSONPayload + '"GST":"' + item.GST + '"}}'
                        this.syncdrugdata_AWS_local(JSONPayload,item);
            }
 }



 showSuggestedAddressModal () {
      let modal = this.modalCtrl.create(AutocompleteAddressPage);
      let me = this;
      
      modal.onDidDismiss(data => {

       if (typeof data!== 'undefined' && data!== null)
        {
          this.vendoraddress = data.Address;
          this.vendorcity = data.City;
          this.vendorstate= data.State;
          this.vendorcountry =data.Country;
          this.vendorpin = data.Pincode;
        }
    });
   
    modal.present();

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