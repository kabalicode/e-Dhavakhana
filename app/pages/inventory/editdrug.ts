import {Component} from "@angular/core";
import { Page,NavController,AlertController,ModalController,LoadingController,ToastController } from 'ionic-angular';
import {ViewController,NavParams} from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { AbstractControl} from '@angular/common';
import {AutocompletePage} from './autocomplete';

// providers
import {InventoryService} from '../../providers/data/inventory/inventoryservice';
import {LocalDrugInventory} from '../../providers/data/local/inventoryservice';
import {UtilitiesService} from '../../providers/data/utilities/utilitiesservice'



@Component({
  templateUrl: 'build/pages/inventory/editdrug.html',
  providers: [InventoryService,UtilitiesService]
})
export class EditDrugsPage {
 
  // form controls
  drugname: AbstractControl;
  drugtype: AbstractControl;
  mfgcode:AbstractControl;
  scheduledrug:AbstractControl;
  rackposition:AbstractControl;
  minqty:AbstractControl;
  packtype:AbstractControl;
  composition:AbstractControl;
  packmrp:AbstractControl;
  packptr:AbstractControl;
  unitqty: AbstractControl;

  // form name  
  editdrug : any;


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
  drugid:number;
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
              public navParams: NavParams,
              private toastCtrl: ToastController) 
    {

        this.editdrug = fb.group({
            scheduledrug: ['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 ]*'),Validators.maxLength(2)])],
            rackposition: [''],
            minqty: ['',Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
            packtype: [''],
            composition: [''],
            unitqty:['',Validators.compose([Validators.required,Validators.pattern('[.0-9]*')])],
            packptr:['',Validators.compose([Validators.required,Validators.pattern('[.0-9]*')])],
            packmrp:[''],
          });

        console.log(navParams.data);

        this.scheduledrug = this.editdrug.controls['scheduledrug'];
        this.rackposition = this.editdrug.controls['rackposition'];
        this.minqty = this.editdrug.controls['minqty'];
        this.packtype = this.editdrug.controls['packtype'];
        this.composition = this.editdrug.controls['composition'];
        this.unitqty = this.editdrug.controls['unitqty'];
        this.packmrp = this.editdrug.controls['packmrp'];
        this.packptr = this.editdrug.controls['packptr'];

        console.log(navParams.data);

        this.medicinename = navParams.data.drugname;
        this.medicinetype = navParams.data.drugtype;
        this.manufacturer= navParams.data.mfgcode;
        this.schedulemedicine= navParams.data.scheduledrug;
        this.medicineposition= navParams.data.rackposition;
        this.reorderqty = navParams.data.minqty;
        this.packagetype = navParams.data.packagetype;
        this.comp = navParams.data.composition;
        this.drugid = navParams.data.drugid;

        console.log(navParams.data.mrp);
        
        this.packagemrp = navParams.data.mrp;
        //this.packagemrp="40";
        //this.reorderqty = navParams.data.mrp;

        this.packageptr = navParams.data.ptr;
        this.stdunit = navParams.data.unitqty;


    }    

 updateDrugItem(): void {
  
   console.log("save!!!!")
    
    let drugitem = {
        drugid: this.drugid,
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

    let JSONPayload : string;
    JSONPayload = '{"drugid":' + drugitem.drugid + ','
    JSONPayload = JSONPayload+ '"drugname":"' + drugitem.drugname + '",'
    JSONPayload = JSONPayload + '"drugtype":"' + drugitem.drugtype + '",'
    JSONPayload = JSONPayload + '"mfgcode":"' + drugitem.mfgcode + '",'
    JSONPayload = JSONPayload + '"scheduledrug":"' + drugitem.scheduledrug + '",'
    JSONPayload = JSONPayload + '"rackposition":"' + drugitem.rackposition + '",'
    JSONPayload = JSONPayload + '"minqty":' + drugitem.minqty + ','
    JSONPayload = JSONPayload + '"packagetype" :"' + drugitem.packagetype + '",'
    JSONPayload = JSONPayload + '"unitqty" :"' + drugitem.unitqty + '",'
    JSONPayload = JSONPayload + '"packagemrp" :"' + drugitem.packagemrp + '",'
    JSONPayload = JSONPayload + '"packageptr" :"' + drugitem.packageptr + '",'
    JSONPayload = JSONPayload + '"composition":"' + drugitem.composition + '"}'
    
    console.log(JSONPayload);
    
    this.syncdrugdata_AWS_local(JSONPayload,drugitem);
 

  } // manage drug



syncdrugdata_local(item:any, soperation:string){

          //console.log(soperation);
          if (soperation == "UPDATE")
          {
            this.localdrugservice.updateDrug(item).then((res) => {
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
                  } // sucess if loop
                  
              } // status : 200
          } // if loop

      }); //loading dismiss loop  
      loading.dismiss();
    }); // manage drug loop
     
}


/*
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

                if(data.name == "Error")
                {
                  console.log("Error:" + data.message);
                  this.showToast("Error occurred while retriving drug details:" + data.message, "middle");
                  return;
                } // Error handling loop

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

  }*/

    showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    } 

} // add drugs page