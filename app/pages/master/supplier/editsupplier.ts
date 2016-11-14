import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController , LoadingController,NavParams,ToastController} from 'ionic-angular';
import {ViewController} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { AbstractControl} from '@angular/common';
import {AutocompleteAddressPage} from './autocomplete';

// providers
import {SupplierAPIService} from '../../../providers/data/supplier/supplierservice';
import {LocalSupplierMaster} from '../../../providers/data/local/supplierservice';
import {UtilitiesService} from '../../../providers/data/utilities/utilitiesservice'

@Component({
  templateUrl: 'build/pages/master/supplier/editsupplier.html',
  providers: [SupplierAPIService,UtilitiesService]
})
export class EditSupplierPage {
 
  
  address:AbstractControl;
  state:AbstractControl;
  country:AbstractControl;
  pin:AbstractControl;
  
  contactname:AbstractControl;
  landlineno:AbstractControl;
  mobileno:AbstractControl;
  
  GSTNO:AbstractControl;
  TINNO:AbstractControl;

  // form name  
  editsupplier : any;


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
  supplierid: string;
    
  constructor(private nav: NavController, 
              private modalCtrl: ModalController,
              private supplierapiservice:SupplierAPIService,
              private localsupplierservice: LocalSupplierMaster,
              private utildrugservice: UtilitiesService,
              public alertCtrl: AlertController,
              private fb: FormBuilder,
              public loadingCtrl:LoadingController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private toastCtrl: ToastController) 
    {

        this.editsupplier = fb.group({
            address: ['',Validators.compose([Validators.required,])],
            state: [''],
            country: [''],
            pin: [''],
            contactname: ['',Validators.compose([Validators.required,])],
            landlineno: ['',Validators.compose([Validators.required,])],
            mobileno: ['',Validators.compose([Validators.required,])],
            GSTNO: ['',Validators.compose([Validators.required,])],
            TINNO: ['',Validators.compose([Validators.required,])]
          });



       // this.suppliername = this.editsupplier.controls['suppliername'];
        this.address = this.editsupplier.controls['address'];
        this.state = this.editsupplier.controls['state'];
        this.country = this.editsupplier.controls['country'];
        this.pin = this.editsupplier.controls['pin'];

        this.contactname = this.editsupplier.controls['contactname'];
        this.landlineno= this.editsupplier.controls['landlineno'];
        this.mobileno=this.editsupplier.controls['mobileno'];
        this.GSTNO=this.editsupplier.controls['GSTNO'];
        this.TINNO=this.editsupplier.controls['TINNO'];
  
        console.log(navParams.data);
         
        
        this.vendorname = navParams.data.suppliername;
        this.vendoraddress = navParams.data.address.areaname;
        console.log("address:"+this.address);

        this.vendorcity  = navParams.data.address.suppliercity;
        this.vendorstate  = navParams.data.address.state;
        this.vendorcountry= navParams.data.address.country;
        this.vendorpin= navParams.data.address.pin;

        this.vendorcontactname= navParams.data.contactdetails.contactname;
        this.vendorlandlineno= navParams.data.contactdetails.landlineno;
        this.vendormobileno= navParams.data.contactdetails.mobileno;

        this.vendorGST= navParams.data.taxdetails.GST;
        this.vendorTIN= navParams.data.taxdetails.TIN;

        this.supplierid = navParams.data.supplierid;

        console.log("suppname" + navParams.data.suppliername);
     
      


    } 



postSupplierInfo(){

   let supplieritem = {
        supplierid: this.supplierid,
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

    let JSONPayload: string;
    
    JSONPayload = '{"supplierid":"' + supplieritem.supplierid + '",'
    JSONPayload = JSONPayload+ '"suppliername":"' + supplieritem.suppliername + '",'
    JSONPayload = JSONPayload + '"address": {"areaname":"' + supplieritem.address + '",'
    JSONPayload = JSONPayload + '"suppliercity":"' + supplieritem.suppliercity + '",'
    JSONPayload = JSONPayload + '"state":"' + supplieritem.state + '",'
    JSONPayload = JSONPayload + '"country":"' + supplieritem.country + '",'
    JSONPayload = JSONPayload + '"pin" :"' + supplieritem.pin + '"},'
    JSONPayload = JSONPayload + '"contactinfo": {"contactname":"' + supplieritem.contactname + '",'
    JSONPayload = JSONPayload + '"landlineno" :' + supplieritem.landline + ','
    JSONPayload = JSONPayload + '"mobileno": ' + supplieritem.mobileno + '},'
    JSONPayload = JSONPayload + '"taxdetails": {"TIN":"' + supplieritem.TIN + '",'
    JSONPayload = JSONPayload + '"GST":"' + supplieritem.GST + '"}}'
    
    this.syncdrugdata_AWS(JSONPayload,supplieritem);
}



syncdrugdata_AWS(JSONPayload: string, item: any){
       
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
                        
                      // loading.onDidDismiss(() => {
                          let alert = this.alertCtrl.create({
                            title: stitle,
                            message: smessage,
                            buttons: [
                              {
                                text: 'Ok',
                                handler: () => {
                                  console.log('Ok clicked');
                                  //loading.dismiss();
                                  this.viewCtrl.dismiss();
                                }
                              }
                            ]
                          });
                          alert.present();
                        //});

                      } // sucess if loop
                    } // status == 200
                } // if loop
        }); // loading dismiss loop
        loading.dismiss();
      }); // manage supplier loop
     
}
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