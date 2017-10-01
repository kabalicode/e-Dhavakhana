import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController,LoadingController,ToastController } from 'ionic-angular';
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
  packform:AbstractControl;
  packmrp:AbstractControl;
  packptr:AbstractControl;
  unitqty: AbstractControl;

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
  packageform:any;
  packagemrp:any;
  packageptr:any;
  stdunit: any;
    
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
              private safenetwork: SafeHttp,
              private toastCtrl: ToastController) 
    {

        this.adddrug = fb.group({
            drugname: ['', Validators.compose([Validators.required])],
            drugtype: ['',Validators.compose([Validators.required])],
            mfgcode: ['',Validators.compose([Validators.required,])],
            scheduledrug: ['',Validators.compose([Validators.required])],
            rackposition: [''],
            minqty: ['',Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
            packtype: [''],
            composition: [''],
            packform:[''],
            unitqty:['',Validators.compose([Validators.required,Validators.pattern('[.0-9]*')])],
            packptr:['',Validators.compose([Validators.required,Validators.pattern('[.0-9]*')])],
            packmrp:['',Validators.compose([Validators.required,Validators.pattern('[.0-9]*')])]
          });

        this.drugname = this.adddrug.controls['drugname']; 
        this.drugtype = this.adddrug.controls['drugtype']; 
        this.mfgcode = this.adddrug.controls['mfgcode'];
        this.scheduledrug = this.adddrug.controls['scheduledrug'];
        this.rackposition = this.adddrug.controls['rackposition'];
        this.minqty = this.adddrug.controls['minqty'];
        this.packtype = this.adddrug.controls['packtype'];
        this.composition = this.adddrug.controls['composition'];
        this.packform = this.adddrug.controls['packform'];
        this.unitqty = this.adddrug.controls['unitqty'];
        this.packmrp = this.adddrug.controls['packmrp'];
        this.packptr = this.adddrug.controls['packptr'];


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
            unitqty:this.stdunit,
            packagemrp: this.packagemrp,
            packageptr: this.packageptr,
            composition: this.comp.toUpperCase()
        };


    this.localdrugservice.searchDrugByName(drugitem).then((res) => {
          let responseobject : any;
          responseobject = res;
          console.log(responseobject);

          if(responseobject.name == "Error")
          {
            console.log("Error:" + responseobject.message);
            this.showToast("Error occurred while searching drug name in local store:" + responseobject.message, "middle");
            return;
          } // Error handling loop

          if (typeof responseobject!== 'undefined' && responseobject!== null)
                    {
                            responseobject = responseobject.res;
                            //responseobject = responseobject.rows[0];
                            responseobject = responseobject.rows

                            if (responseobject.length >0)
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
              if(res.name == "Error")
                {
                  console.log("Error:" + res.message);
                  this.showToast("Error occurred while updating drug in local store:" + res.message, "middle");
                  return;
                } // Error handling loop
              return res;
            });
          }else
          {
             this.localdrugservice.addDrug(item).then((res) => {
                 if(res.name == "Error")
                {
                  console.log("Error:" + res.message);
                  this.showToast("Error occurred while adding drug in local store:" + res.message, "middle");
                  return;
                } // Error handling loop
              return  res;
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

                if(response.name == "Error")
                {
                  console.log("Error:" + response.message);
                  this.showToast("Error occurred while searching drug in local store:" + response.message, "middle");
                  return;
                } // Error handling loop  

                
                if (typeof response!== 'undefined' && response!== null)
                  {
                        response = response.res;
                        //response = response.rows[0];
                        response = response.rows.item(0);
                        
                        let drugid = response.drugid;
                        item.drugid = drugid; //Append drug id


                        JSONPayload = '{"drugid":' + item.drugid + ','
                        JSONPayload = JSONPayload+ '"drugname":"' + item.drugname + '",'
                        JSONPayload = JSONPayload + '"drugtype":"' + item.drugtype + '",'
                        JSONPayload = JSONPayload + '"mfgcode":"' + item.mfgcode + '",'
                        JSONPayload = JSONPayload + '"scheduledrug":"' + item.scheduledrug + '",'
                        JSONPayload = JSONPayload + '"rackposition":"' + item.rackposition + '",'
                        JSONPayload = JSONPayload + '"minqty":' + item.minqty + ','
                        JSONPayload = JSONPayload + '"packagetype" :"' + item.packagetype + '",'
                        JSONPayload = JSONPayload + '"unitqty" :"' + item.unitqty + '",'
                        JSONPayload = JSONPayload + '"packagemrp" :"' + item.packagemrp + '",'
                        JSONPayload = JSONPayload + '"packageptr" :"' + item.packageptr + '",'
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
                        JSONPayload = JSONPayload + '"unitqty" :"' + item.unitqty + '",'
                        JSONPayload = JSONPayload + '"packagemrp" :"' + item.packagemrp + '",'
                        JSONPayload = JSONPayload + '"packageptr" :"' + item.packageptr + '",'
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

          if(responseobject.name == "Error")
          {
            console.log("Error:" + responseobject.message);
            loading.onDidDismiss(() => {
                this.showToast("Error occurred while updating drug to AWS:" + responseobject.message, "middle");
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
                        let drugid = responseobject.drugid;
                        item.drugid = drugid; //Append drug id

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
                                  //this.viewCtrl.dismiss();
                                  this.medicinename=null;
                                  this.medicinetype =null;
                                  this.manufacturer="";
                                  this.schedulemedicine="";
                                  this.medicineposition = "";
                                  this.reorderqty ="";
                                  this.packagetype="";
                                  this.comp="";
                                  this.packageform="";
                                  this.stdunit="";
                                  this.packagemrp="";
                                  this.packageptr="";

                                }
                              }
                            ]
                          });
                          //loading.dismiss();
                          alert.present();
                        //});
                      } // success if loop
                      
                        //console.log("new code");
                    } // staus = 200
                } // if loop
          }); // onDidDismiss loop
         loading.dismiss();
      });// manageDrug loop
}



 showSuggestedDrugsModal () {
      let modal = this.modalCtrl.create(AutocompletePage);
      let me = this;
      
      modal.onDidDismiss(data => {
      
      let druginfoobject: any;
      
      //this.address.place = data;
      console.log("dismiss");
      console.log(data);
      
     

      druginfoobject = data;
      console.log(druginfoobject);

      //this.medicinename = this.medicinename.toUpperCase();

      this.ldrugdetails = 0;
      this.manufacturer = "";
      this.medicinetype ="";
      this.reorderqty="";
      this.stdunit=0;
      this.packagetype ="";
      this.packageform="";
      this.comp="";
      this.vwmedicinedetails = null;
      let sdrugtype ="";

      if (typeof druginfoobject === 'object')
      {
        this.medicinename = druginfoobject.name;
        sdrugtype = druginfoobject.form;
        
        console.log("sss" + sdrugtype);
        sdrugtype = sdrugtype.toUpperCase();
        
        this.medicinetype = druginfoobject.form;
        this.medicinetype = this.medicinetype.toUpperCase();
        console.log(this.medicinetype);
        
        if (sdrugtype === "ML OF SUSPENSION") this.medicinetype = "SUSPENSION";
        if (sdrugtype === "ML OF INJECTION") this.medicinetype = "INJECTION";
        console.log(this.medicinetype);
        
        this.manufacturer = druginfoobject.manufacturer;
        this.manufacturer = this.manufacturer.toUpperCase();

        this.packagetype = druginfoobject.size;
        this.packagetype =  this.packagetype.toUpperCase();
        
        this.schedulemedicine = druginfoobject.schedule.category;
        this.schedulemedicine = this.schedulemedicine.toUpperCase();

        this.packageform = druginfoobject.packageForm;
        this.packageform = this.packageform.toUpperCase();

        this.packageptr = druginfoobject.price;
        this.stdunit = druginfoobject.standardUnits;

        if (typeof druginfoobject.constituents !== 'undefined' && druginfoobject.constituents!==null)
        {
          var mixture="";
          for (var index=0 ; index < druginfoobject.constituents.length; index++)
          {
            mixture = mixture + druginfoobject.constituents[index].name + "-" + druginfoobject.constituents[index].strength + ";" ;
            mixture = mixture.replace("\r","");
          }
          this.comp = mixture.toUpperCase();
        }  
      }else if (typeof druginfoobject === 'string')
      {
          if ((druginfoobject.indexOf("|!|DISMISS")>0) || (druginfoobject=="|!|DISMISS"))
          druginfoobject = druginfoobject.replace("|!|DISMISS","")
          this.medicinename = druginfoobject;
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