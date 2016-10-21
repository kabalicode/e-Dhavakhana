import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController , LoadingController} from 'ionic-angular';
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
              public loadingCtrl:LoadingController) 
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
  console.log("i am here");

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


    //this.searching=true;
    let JSONPayload : string;

   

    JSONPayload = '{"suppliername":"' + supplieritem.suppliername + '",'
    JSONPayload = JSONPayload + '"address": {"areaname":"' + supplieritem.address + '",'
    JSONPayload = JSONPayload + '"suppliercity":"' + supplieritem.suppliercity + '",'
    JSONPayload = JSONPayload + '"state":"' + supplieritem.state + '",'
    JSONPayload = JSONPayload + '"pin" :"' + supplieritem.pin + '"},'
    JSONPayload = JSONPayload + '"contactinfo": {"contactname":"' + supplieritem.contactname + '",'
    JSONPayload = JSONPayload + '"landlineno" :' + supplieritem.landline + ','
    JSONPayload = JSONPayload + '"mobileno": ' + supplieritem.mobileno + '},'
    JSONPayload = JSONPayload + '"taxdetails": {"TIN":"' + supplieritem.TIN + '",'
    JSONPayload = JSONPayload + '"GST":"' + supplieritem.GST + '"}}'

    console.log(JSONPayload);
    
    let loading = this.loadingCtrl.create({
                    content: 'Please Wait...'
        });

    loading.present();

     this.supplierapiservice.manageSupplier(JSONPayload).then((res) => {
 
            //loading.dismiss();
            //this.nav.popToRoot();
            console.log("success!!")  
            //console.log(res);
           

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
                    let ssupplierid = responseobject.supplierid;
                    supplieritem.supplierid = ssupplierid; //Append drug id

                    let soperation = responseobject.operation;
                    let smessage = "";
                    let stitle = "";

                    if (soperation == "UPDATE")
                    {
                      smessage = this.vendorname + " has been  updated  sucessfully !";
                      stitle = "Update Supplier : " //+ this.vendorname;
                    }else if (soperation == "CREATE")
                    {
                      smessage = this.vendorname + " has been added sucessfully !";
                      stitle = "Add New Supplier : " //+ this.vendorname
                    }

                      let alert = this.alertCtrl.create({
                        title: stitle,
                        message: smessage,
                        buttons: [
                          {
                            text: 'Ok',
                            handler: () => {
                              console.log('Ok clicked');
                               loading.dismiss();
                              // store drug info to local store
                             this.syncdrugdata_local(supplieritem); // store data to local

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
                              //this.addsupplier.valid=false;
 
                            }
                          }
                        ]
                      });
                      loading.dismiss();
                      alert.present();

                  }
                    console.log("new code");

                }
            }



        }, (err) => {
            console.log(err);
           
        });

}


syncdrugdata_local(item:any){
    this.localsupplierservice.searchSupplier(item).then((res) => {
      let responseobject : any;
      responseobject = res;

       if (typeof responseobject!== 'undefined' && responseobject!== null)
                {
                      responseobject = responseobject.res;
                      responseobject = responseobject.rows[0];

                      if (responseobject.TOTALRECORDS >0)
                      {

                        this.localsupplierservice.updateSupplier(item).then((res) => {
                         console.log("UPDATE RECORD TO LOCAL STORE");
                          return res;
                        });
                      }else
                      {
                          this.localsupplierservice.addSupplier(item).then((res) => {
                          console.log("INSERT NEW RECORDS TO LOCAL STORE");
                          return  res;
                          });
                      }
                }
                return false;
   });
 }// store drug data to local



 showSuggestedAddressModal () {
      let modal = this.modalCtrl.create(AutocompleteAddressPage);
      let me = this;
      
      modal.onDidDismiss(data => {

      //this.address.place = data;
      console.log(data);
      //this.vendorname = data;
      //this.vendorname = this.vendorname.toUpperCase();

     // this.ldrugdetails = 0;
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

} // add drugs page