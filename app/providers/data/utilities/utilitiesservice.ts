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

  data: any;


  constructor(private http: Http) {
    this.data = null;
  }
  
  getSuggestedDrugs(searchParam: string){
// console.log("Drugs here..")
    if (this.data) {
      //console.log("inside if");
      return Promise.resolve(this.data);
    }

    // Stub data during unit testing
    console.log("utilities service here")

  this.data = [
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
    return Promise.resolve(this.data); 


     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START


/*
 return new Promise(resolve => {
    var url = "";
    //url = `https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs?drugname=${searchParam}`;
    url = `http://oaayush-aayush.rhcloud.com/api/medicine_suggestions?key=57029cfb1f59ea00d8294c7367a0d5&id=${searchParam}`;
    url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs/suggestion?id=${searchParam}`

    console.log(url);

    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
         // console.log(this.data);
          resolve(this.data);
        });
    });    //  API CALL END 
*/

}

getAlternativeDrugs(searchParam: string){
// console.log("Drugs here..")
    if (this.data) {
      //console.log("inside if");
      return Promise.resolve(this.data);
    }

    // Stub data during unit testing
    console.log("utilities service here")

   this.data = [
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
    return Promise.resolve(this.data); 
     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START


/*
 return new Promise(resolve => {
    var url = "";
  
    url = `http://oaayush-aayush.rhcloud.com/api/medicine_suggestions?key=57029cfb1f59ea00d8294c7367a0d5&id=${searchParam}`;
    url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs/alternative?id=${searchParam}`

    console.log(url);

    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
         // console.log(this.data);
          resolve(this.data);
        });
    });    //  API CALL END 
  
  }
*/

}

