import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the Toolservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilitiesService {

  suggesteddrugdata: any;
  drugdetails:any;
  alternativedrugs: any;
  addressdetails:any;


  constructor(private http: Http) {
    this.suggesteddrugdata = null;
    this.drugdetails = null;
    this.alternativedrugs=null;
  }
  


// api that provides list of suggested drugs
// this method connects to trueMD API

getSuggestedDrugs(searchParam: string){
// console.log("Drugs here..")
  this.suggesteddrugdata=null;
    if (this.suggesteddrugdata) {
    
      return Promise.resolve(this.suggesteddrugdata);
    }

    // Stub data during unit testing

  this.suggesteddrugdata = [
  {
    "DrugName": "Broncorex (100 ml)" 
  },
  {
    "DrugName": "Broncorex (50 ml)" 
  },
  {
    "DrugName": "Cocorex (100 ml)" 
  },
  {
    "DrugName": "Cocorex (50 ml)" 
  },
  {
    "DrugName": "Corex (100 ml)" 
  },
  {
    "DrugName": "Corex (50 ml)" 
  },
  {
    "DrugName": "Corex DX (100 ml)" 
  },
  {
    "DrugName": "Corex DX (50 ml)" 
  }
];
    return Promise.resolve(this.suggesteddrugdata); 


/*     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START



 return new Promise(resolve => {
    var url = "";
    //url = `https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs?drugname=${searchParam}`;
    url = `http://oaayush-aayush.rhcloud.com/api/medicine_suggestions?key=57029cfb1f59ea00d8294c7367a0d5&id=${searchParam}`;
    url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs/suggestion?id=${searchParam}`

    console.log(url);

    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.suggesteddrugdata = data;
          resolve(this.suggesteddrugdata);
        });
    });    //  API CALL END 
*/

}

// api that retrieve altertative list of drugs for a given drugname
// this method connects to trueMD API
getAlternativeDrugs(searchParam: string){

  this.alternativedrugs = null;
    if (this.alternativedrugs) {
      return Promise.resolve(this.alternativedrugs);
    }

    // Stub data during unit testing
    //console.log("utilities service here")
  this.alternativedrugs = [
  {
    "DrugName": "Terkof B (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Redson Pharmaceuticals"
  },
  {
    "DrugName": "Cofq X (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Cipla Limited"
  },
  {
    "DrugName": "Exark (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Emson Medichem Pvt. Ltd."
  },
  {
    "DrugName": "Libitus Plus (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Leben Laboratories Pvt. Ltd."
  },
  {
    "DrugName": "Sorcure (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Scala Pharmaceuticals"
  },
  {
    "DrugName": "Scorkof X (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Scortis Labs (P) Ltd"
  },
  {
    "DrugName": "Amdex (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Ampus Life Sciences Ltd"
  },
  {
    "DrugName": "Turbocure (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Balsons Pharmaceuticals (Best Cure Pharma)"
  },
  {
    "DrugName": "Cincof-TR (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Biocin Healthcare"
  },
  {
    "DrugName": "Kuff X (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Intas Laboratories Pvt Ltd"
  },
  {
    "DrugName": "Soothex (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Affy Pharma Pvt. Ltd."
  },
  {
    "DrugName": "Sarbcof (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Sarb Pharmaceuticals"
  },
  {
    "DrugName": "Winnow X (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Tyrant Pharma Pvt. Ltd."
  },
  {
    "DrugName": "Salmodil Plus (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Lumina (FDC Limited)"
  },
  {
    "DrugName": "Kuff X (50 ml)",
    "DrugType": "Syrup",
    "MFGName": "Intas Laboratories Pvt Ltd"
  },
  {
    "DrugName": "Oripect (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Stanford Biotech Pvt. Ltd"
  },
  {
    "DrugName": "Koril X (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Sehat Pharma Pvt.Ltd"
  },
  {
    "DrugName": "Oripect SF (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Stanford Biotech Pvt. Ltd"
  },
  {
    "DrugName": "Broncorex (100 ml)",
    "DrugType": "Syrup",
    "MFGName": "Pfizer Limited (Pharmacia India Pvt Ltd)"
  },
  {
    "DrugName": "Broncorex (50 ml)",
    "DrugType": "Syrup",
    "MFGName": "Pfizer Limited (Pharmacia India Pvt Ltd)"
  }
];
    return Promise.resolve(this.alternativedrugs); 



/*     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START

 return new Promise(resolve => {
    var url = "";
  
   // url = `http://oaayush-aayush.rhcloud.com/api/medicine_suggestions?key=57029cfb1f59ea00d8294c7367a0d5&id=${searchParam}`;
    url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs/alternative?id=${searchParam}`

    console.log(url);

    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.alternativedrugs = data;
          resolve(this.alternativedrugs);
        });
    });    //  API CALL END 
  
 */


}

// api that retrieve detailed drug information for a given drun name
// this method connects to trueMD API
getDrugDetails(drugname: string){
 
   this.drugdetails = null;
    if (this.drugdetails) {
      return Promise.resolve(this.drugdetails);
    }

    // Stub data during unit testing

    this.drugdetails = {"status":"ok","response":{"medicine":{"brand":"Corex (50 ml)","category":"Syrup","d_class":"Cough Syrups (Decongestants, Bronchodialator etc.)","generic_id":1610,"id":22549,"manufacturer":"Pfizer Limited (Pharmacia India Pvt Ltd)","package_price":42.5,"package_qty":50.0,"package_type":"ml","unit_price":4.25,"unit_qty":5.0,"unit_type":"ml"},"constituents":[{"generic_id":"1610","id":126504,"name":"Codeine Phosphate","qty":2,"strength":"10 mg\r"},{"generic_id":"1610","id":126505,"name":"Chlorpheniramine Maleate","qty":2,"strength":"4 mg\r"}]}}
    return Promise.resolve(this.drugdetails); 


/*
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START



 return new Promise(resolve => {
    var url = "";
  
    url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs?id=${drugname}`

    console.log(url);

    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.drugdetails = data;
          resolve(this.drugdetails);
        });
    });    //  API CALL END 

    */
  }


findAddress(pinno: string){
 
   this.addressdetails = null;
    if (this.addressdetails) {
      return Promise.resolve(this.addressdetails);
    }


 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START



 return new Promise(resolve => {
    var url = "";
  
    url=`https://www.whizapi.com/api/v2/util/ui/in/indian-city-by-postal-code?project-app-key=jtw4hxuywp9kl64yultf8ejj&pin=${pinno}`

    console.log(url);

    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.addressdetails = data;
          resolve(this.addressdetails);
        });
    });    //  API CALL END 

   
  }


}

