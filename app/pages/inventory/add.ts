import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController,LoadingController } from 'ionic-angular';
import {ViewController} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { AbstractControl} from '@angular/common';
import {AutocompletePage} from './autocomplete';

// providers
import {InventoryService} from '../../providers/data/inventory/inventoryservice';
import {LocalDrugInventory} from '../../providers/data/local/inventoryservice';
import {UtilitiesService} from '../../providers/data/utilities/utilitiesservice'



@Component({
  templateUrl: 'build/pages/inventory/add.html',
  providers: [InventoryService,UtilitiesService]
})
export class AddDrugsPage {
 
  // form controls
  drugname: AbstractControl;
  drugtype: AbstractControl;
  mfgcode:AbstractControl;
  scheduledrug:AbstractControl;
  rackposition:AbstractControl;
  minqty:AbstractControl;
  packtype:AbstractControl;
  composition:AbstractControl;

  // form name  
  adddrug : any;


  // variables to hold data
  manufacturer:any;
  medicinename:any;
  medicinetype:any;
  reorderqty:any;
  packagetype:any;
  comp: any;
  schedulemedicine:any;
  medicineposition:any;
  vwmedicinedetails:any;
  ldrugdetails = 0;
    
  // busy variables
 // searching: any = false;

  

  constructor(private nav: NavController, 
              private modalCtrl: ModalController,
              private invtservice:InventoryService,
              private localdrugservice: LocalDrugInventory,
              private utildrugservice: UtilitiesService,
              public alertCtrl: AlertController,
              private fb: FormBuilder,
              public loadingCtrl:LoadingController) 
    {

        this.adddrug = fb.group({
            drugname: ['', Validators.compose([Validators.required])],
            drugtype: ['',Validators.compose([Validators.required])],
            mfgcode: ['',Validators.compose([Validators.required,])],
            scheduledrug: ['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 ]*'),Validators.maxLength(2)])],
            rackposition: [''],
            minqty: ['',Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
            packtype: [''],
            composition: ['']
          });

        this.drugname = this.adddrug.controls['drugname']; 
        this.drugtype = this.adddrug.controls['drugtype']; 
        this.mfgcode = this.adddrug.controls['mfgcode'];
        this.scheduledrug = this.adddrug.controls['scheduledrug'];
        this.rackposition = this.adddrug.controls['rackposition'];
        this.minqty = this.adddrug.controls['minqty'];
        this.packtype = this.adddrug.controls['packtype'];
        this.composition = this.adddrug.controls['composition'];



    }    

 manageDrug(): void {
  
   console.log("save!!!!")
    
    let drugitem = {
        drugid: null,
        drugname: this.medicinename.toUpperCase(),
        drugtype: this.medicinetype.toUpperCase(),
        mfgcode: this.manufacturer.toUpperCase(),
        scheduledrug: this.schedulemedicine.toUpperCase(),
        rackposition: this.medicineposition.toUpperCase(),
        minqty : this.reorderqty,
        packagetype: this.packagetype.toUpperCase(),
        composition: this.comp.toUpperCase()
    };

      let loading = this.loadingCtrl.create({
                  content: 'Please Wait...'
      });
      loading.present();
    this.invtservice.manageDrug(drugitem).then((res) => {
 
            //loading.dismiss();
            //this.nav.popToRoot();
            console.log("success!!")  


            let responseobject : any;
            responseobject = res;
            //console.log(responseobject);

            if (typeof responseobject!== 'undefined' && responseobject!== null)
            {
                if (responseobject.status==200)
                {
                  let sjsonresponse = responseobject._body;
                  responseobject = JSON.parse(sjsonresponse);

                  //console.log(responseobject.response);

                  if (responseobject.response == "SUCESS")
                  {
                    let sdrugid = responseobject.drugid;
                    drugitem.drugid = sdrugid; //Append drug id

                    let soperation = responseobject.operation;
                    let smessage = "";
                    let stitle = "";
                    //console.log(soperation);  
                    if (soperation == "UPDATE")
                    {
                      smessage = this.medicinename + " has been sucessfully updated to the drug inventory  !";
                      stitle = "Update Drug : " //+ this.medicinename;
                    }else if (soperation == "CREATE")
                    {
                      smessage = this.medicinename + " has been added sucessfully to the drug inventory !";
                      stitle = "Add New Drug : " //+ this.medicinename
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
                              this.syncdrugdata_local(drugitem); // store data to local

                              this.medicinename="";
                              this.packagetype ="";
                              this.schedulemedicine="H";
                              this.medicineposition=null;
                              this.manufacturer = "";
                              this.medicinetype ="";
                              this.reorderqty=0;
                              this.comp="";
 
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

  } // manage drug


syncdrugdata_local(item:any){
 // console.log("syncdrugdata_local");
 // console.log(item);
    this.localdrugservice.searchDrug(item).then((res) => {
      let responseobject : any;
      responseobject = res;
   //   console.log(res);

       if (typeof responseobject!== 'undefined' && responseobject!== null)
                {
                      responseobject = responseobject.res;
                      responseobject = responseobject.rows[0];

                      if (responseobject.TOTALRECORDS >0)
                      {

                        this.localdrugservice.updateDrug(item).then((res) => {
                         console.log("UPDATE RECORD TO LOCAL STORE");
                          return res;
                        });
                      }else
                      {
                          this.localdrugservice.addDrug(item).then((res) => {
                          console.log("INSERT NEW RECORDS TO LOCAL STORE");
                          return  res;
                          });
                      }
                }
                return false;
   });
 }// store drug data to local


 showSuggestedDrugsModal () {
      let modal = this.modalCtrl.create(AutocompletePage);
      let me = this;
      
      modal.onDidDismiss(data => {

      //this.address.place = data;
      this.medicinename = data;
      this.medicinename = this.medicinename.toUpperCase();

      this.ldrugdetails = 0;
      if ((this.medicinename.indexOf("|!|DISMISS")>0) || (this.medicinename=="|!|DISMISS"))
        {
          this.medicinename = this.medicinename.replace("|!|DISMISS","")
          this.manufacturer = "";
          this.medicinetype ="";
          this.reorderqty=0;
          this.packagetype ="";
          this.comp="";
        }else  
        {
            // get detailed drug information.
           
            this.utildrugservice.getDrugDetails(this.medicinename).then((data) => {

                this.vwmedicinedetails = data;
                 
                if (typeof this.vwmedicinedetails!== 'undefined' && this.vwmedicinedetails!== null)
                {
                   this.ldrugdetails = 1;
                   this.vwmedicinedetails = this.vwmedicinedetails.response;
                   if(this.vwmedicinedetails) 
                   {
                     if (typeof this.vwmedicinedetails.constituents !== 'undefined' && this.vwmedicinedetails.constituents!==null)
                     {
                       var mixture="";
                       for (var index=0 ; index < this.vwmedicinedetails.constituents.length; index++)
                       {
                         mixture = mixture + this.vwmedicinedetails.constituents[index].name + "-" + this.vwmedicinedetails.constituents[index].strength + ";" ;
                         mixture = mixture.replace("\r","");
                       }
                     }

                     this.comp = mixture.toUpperCase();

                      this.vwmedicinedetails = this.vwmedicinedetails.medicine;
                      this.manufacturer = this.vwmedicinedetails.manufacturer;
                      
                      this.medicinetype = this.vwmedicinedetails.category;
                      this.medicinetype = this.medicinetype.toUpperCase();
                      
                      this.packagetype = this.vwmedicinedetails.package_type;
                      this.packagetype = this.packagetype.toUpperCase();

            
                   }   
                }

            }); 
        }   
    });
   
    modal.present();

  }

} // add drugs page