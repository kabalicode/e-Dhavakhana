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

 // API CALL START

 return new Promise(resolve => {
    var url = "";
    //url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs/suggestion?id=${searchParam}`
    url = `http://oaayush-aayush.rhcloud.com/api/medicine_suggestions?key=57029cfb1f59ea00d8294c7367a0d5&limit=150&id=${searchParam}`;
   

    console.log(url);

    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.suggesteddrugdata = data;
          resolve(this.suggesteddrugdata);
        });
    });    //  API CALL END 


}

// api that retrieve altertative list of drugs for a given drugname
// this method connects to trueMD API
getAlternativeDrugs(searchParam: string){

  this.alternativedrugs = null;
    if (this.alternativedrugs) {
      return Promise.resolve(this.alternativedrugs);
    }

 // API CALL START

 return new Promise(resolve => {
    var url = "";
  
    url = `http://oaayush-aayush.rhcloud.com/api/medicine_alternatives?limit=20&key=57029cfb1f59ea00d8294c7367a0d5&id=${searchParam}`;
    //url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs/alternative?id=${searchParam}`
    //console.log(url);
    this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          this.alternativedrugs = data;
          //console.log(this.alternativedrugs);
          resolve(this.alternativedrugs);
        });
    });    //  API CALL END 

}

// api that retrieve detailed drug information for a given drun name
// this method connects to trueMD API
getDrugDetails(drugname: string){
 
   this.drugdetails = null;
    if (this.drugdetails) {
      return Promise.resolve(this.drugdetails);
    }

 return new Promise(resolve => {
    var url = "";
    
    //url=`https://nnuggsvyzb.execute-api.us-west-2.amazonaws.com/Utilities/drugs?id=${drugname}`
    url = `http://oaayush-aayush.rhcloud.com/api/medicine_details?key=57029cfb1f59ea00d8294c7367a0d5&id=${drugname}`;
   

    //console.log(url);

    //console.log(url);
    this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          this.drugdetails = data;
          
          //console.log(this.drugdetails);
          
          resolve(this.drugdetails);
        });
    });    //  API CALL END 
    
  }


findAddress(pinno: string){
 
   this.addressdetails = null;
    if (this.addressdetails) {
      return Promise.resolve(this.addressdetails);
    }

 return new Promise(resolve => {
    var url = "";
    url=`https://www.whizapi.com/api/v2/util/ui/in/indian-city-by-postal-code?project-app-key=jtw4hxuywp9kl64yultf8ejj&pin=${pinno}`

    this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          this.addressdetails = data;
          resolve(this.addressdetails);
        });
    });    //  API CALL END 
   
  }


}

