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
import {SafeHttp} from '../../providers/data/utilities/safehttp';


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
              public loadingCtrl:LoadingController,
              public viewCtrl: ViewController,
              private safenetwork: SafeHttp) 
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
   if (this.safenetwork.connection)
   { 
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


    this.localdrugservice.searchDrugByName(drugitem).then((res) => {
          let responseobject : any;
          responseobject = res;
          console.log(responseobject);

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
            });  
   }else
   {
     this.safenetwork.showNetworkAlert();
   }

  } // manage drug


syncdrugdata_local(item:any, soperation:string){

          //console.log(soperation);
          if (soperation == "UPDATE")
          {
            this.localdrugservice.updateDrug(item).then((res) => {
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
                        console.log(JSONPayload);
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
                            console.log('Ok clicked');
                            //loading.dismiss();
                            //this.viewCtrl.dismiss();
                            this.medicinename=null;
                            this.medicinetype =null;
                            this.manufacturer="";
                            this.schedulemedicine="";
                            this.medicineposition = "";
                            this.reorderqty ="";
                            this.packagetype="";
                            this.comp="";
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



 showSuggestedDrugsModal () {
      let modal = this.modalCtrl.create(AutocompletePage);
      let me = this;
      
      modal.onDidDismiss(data => {

      //this.address.place = data;
      this.medicinename = data;
      //this.medicinename = this.medicinename.toUpperCase();

      this.ldrugdetails = 0;
      this.manufacturer = "";
      this.medicinetype ="";
      this.reorderqty="";
      this.packagetype ="";
      this.comp="";
      this.vwmedicinedetails = null;

      if ((this.medicinename.indexOf("|!|DISMISS")>0) || (this.medicinename=="|!|DISMISS"))
        {
          this.medicinename = this.medicinename.replace("|!|DISMISS","")
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
                          this.comp = mixture.toUpperCase();
                        }  
                        
                       this.vwmedicinedetails = this.vwmedicinedetails.medicine;
                       if(this.vwmedicinedetails) 
                        {  
                            if (typeof this.vwmedicinedetails.manufacturer !== 'undefined' && this.vwmedicinedetails.manufacturer !==null)
                            {   
                                this.manufacturer = this.vwmedicinedetails.manufacturer;
                                this.manufacturer = this.manufacturer.toUpperCase();
                            }
                                console.log("MFG" + this.vwmedicinedetails.manufacturer);

                            if (typeof this.vwmedicinedetails.category !== 'undefined' && this.vwmedicinedetails.category !==null)
                            {
                                this.medicinetype = this.vwmedicinedetails.category;
                                this.medicinetype = this.medicinetype.toUpperCase();
                            }   
                
                            
                            if ( (typeof this.vwmedicinedetails.package_type !== 'undefined' && this.vwmedicinedetails.package_type!==null)  &&
                                (typeof this.vwmedicinedetails.package_qty !== 'undefined' && this.vwmedicinedetails.package_qty!==null) )
                            {     
                              let packageqty = this.vwmedicinedetails.package_qty ;
                              packageqty = parseInt(packageqty, 10)

                              console.log("packageqty:" + packageqty);

                              this.packagetype = packageqty + " " + this.vwmedicinedetails.package_type;
                              this.packagetype = this.packagetype.toUpperCase();

                            }
                        }
                     

                   }   
                }

            }); 
        }   
    });
   
    modal.present();

  }

} // add drugs page