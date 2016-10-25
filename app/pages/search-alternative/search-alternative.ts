import { Component } from '@angular/core';
import { NavController,AlertController,ModalController,ItemSliding, ViewController, NavParams, LoadingController } from 'ionic-angular';
import {UtilitiesService} from '../../providers/data/utilities/utilitiesservice';
//import { ResultsAlternativePage } from '../results-alternative/results-alternative';

/*
  Generated class for the SearchAlternativePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/search-alternative/search-alternative.html',
  providers: [UtilitiesService]
})
export class SearchAlternativePage {

    vwsearchresults: any;
    modelsearchresults:any;
    bapiinvoked= false;
    searchcount = -1;
    queryText = '';
   // searching: any = false;


  constructor(private navCtrl: NavController, 
             private utilitydrugsService:UtilitiesService,  
             public modalCtrl: ModalController,
             public loadingCtrl:LoadingController) {

  }

updatedrugsearch(){
      
        this.vwsearchresults = null;
        var filtervalue = [];
		
        
        var fltvar = this.queryText;
        fltvar = fltvar.toUpperCase();
        console.log(fltvar);

        // We will only perform the search if we have 3 or more characters
        if ((fltvar.length == 5) || (fltvar.length >5 && this.bapiinvoked==false)) {
                //this.searching=true;

                let loading = this.loadingCtrl.create({
                        content: 'Please Wait...'
                });

                loading.present();


                this.utilitydrugsService.getSuggestedDrugs(fltvar).then((data) => {
                console.log(data);
                //this.vwdrugs = data;
                this.modelsearchresults = data;
                //this.adddrugimages();
                
                this.vwsearchresults = this.modelsearchresults;
                this.bapiinvoked = true;
                this.utilitydrugsService.suggesteddrugdata=null;
                
                
                this.vwsearchresults = this.vwsearchresults.response;
                this.vwsearchresults = this.vwsearchresults.suggestions;
                this.searchcount = this.vwsearchresults.length;

                loading.dismiss();
               
                //this.searching=false;
                //console.log("drugcount inside if:" + this.drugsearchcount);
            });

        }else if (fltvar.trim().length == 0){
                this.bapiinvoked = false;
                this.searchcount = -1;
                this.utilitydrugsService.suggesteddrugdata=null;
                this.vwsearchresults = null;
                this.modelsearchresults = null;
                //this.searching=false;
        }else {
            var serachData=this.modelsearchresults;
           // this.searching=false;
            if (typeof serachData !== 'undefined' && serachData !== null)
              {
                    for (var i = 0; i <serachData.length; i++) {

                    var jsval = (serachData[i].suggestion);
                    jsval = jsval.toUpperCase();

                   // console.log(jsval);
                   // console.log(jsval.indexOf(fltvar));
                    if (jsval.indexOf(fltvar) >= 0) 
                        filtervalue.push(serachData[i]);

                   // console.log()    
                    
                }
                this.vwsearchresults = filtervalue;
                this.searchcount = filtervalue.length;
              }

          }        
      }

  gotoAlternativeDrugDetails(drugname)
    {
        // go to the drug details page
        // and pass in the drug data
        //this.navCtrl.push(ResultsAlternativePage, drugname);

        //let DrugsModal = this.modalCtrl.create(SubstitueDrugsModal, {drugname:drugname});
       // DrugsModal.present();

        this.navCtrl.push(SubstitueDrugsModal, drugname);
        
    } 

}


// <<<<<<<<<<<<<<<<<<<<<<< Class to display substitue results >>>>>>>>>>>>>>

@Component({
  templateUrl: 'build/pages/search-alternative/substituteresultsmodal.html',
  providers: [UtilitiesService]
})

export class SubstitueDrugsModal {

    drugparams: any;
    drugname: any;
    //searching: any = false;
    vwalternativedrugdetails : any
    lresultcount = 0;
    vwmedicinedetails:any;
    vwconstituents: any;
    ldrugdetails = 0;
    composition: string;
    packagetype:string

    constructor(public navParams: NavParams,
               private navCtrl: NavController, 
               private utilitydrugsService:UtilitiesService,
               public viewCtrl: ViewController,
               public loadingCtrl:LoadingController) {
           // console.log(navParams.data);
            //this.drugname = navParams.data.drugname;
            
            this.drugname = navParams.data;
            //this.searching=true;

            let loading = this.loadingCtrl.create({
                    content: 'Please Wait...'
            });

            loading.present();

            // get detailed drug information
            this.lresultcount = -1;
           // console.log("ss");
           // console.log(this.drugname);
            //get alternative drug information
            this.utilitydrugsService.getAlternativeDrugs(this.drugname).then((data) => {

            this.vwalternativedrugdetails = data;
            this.vwalternativedrugdetails = this.vwalternativedrugdetails.response;
            this.vwalternativedrugdetails = this.vwalternativedrugdetails.medicine_alternatives;
            
            this.lresultcount = this.vwalternativedrugdetails.length;
            
            //console.log("batch count:");
            this.utilitydrugsService.alternativedrugs=null;

            });

            // get detailed drug information.
           
            this.ldrugdetails = 0;
            this.utilitydrugsService.getDrugDetails(this.drugname).then((data) => {

                this.vwmedicinedetails = data;
                
                 
                if (typeof this.vwmedicinedetails!== 'undefined' && this.vwmedicinedetails!== null)
                {
                    this.ldrugdetails = 1;
                    this.vwmedicinedetails = this.vwmedicinedetails.response;

                    if (typeof this.vwmedicinedetails.constituents !== 'undefined' && this.vwmedicinedetails.constituents!==null)
                    {
                        var mixture="";
                        for (var index=0 ; index < this.vwmedicinedetails.constituents.length; index++)
                        {
                            mixture = mixture + this.vwmedicinedetails.constituents[index].name + "-" + this.vwmedicinedetails.constituents[index].strength + ";" ;
                            mixture = mixture.replace("\r","");
                        }
                        this.composition = mixture.toUpperCase();
                    }
                   
                    if(this.vwmedicinedetails) this.vwmedicinedetails = this.vwmedicinedetails.medicine;

                    if(this.vwmedicinedetails) 
                    {

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


            });    
            loading.dismiss();
            //this.searching=false;
        
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

   
}
