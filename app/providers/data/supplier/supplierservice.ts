import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {SafeHttp} from '../utilities/safehttp';
 
@Injectable()
export class SupplierAPIService {
 
  data: any;
  supplierdetailsdata: any;

 
  constructor(private http: SafeHttp) {
    this.data = null;
    this.supplierdetailsdata = null;
    //console.log("inside supplier API service");
  }

 
searchSupplier(suppliername: string){
// console.log("Drugs here..")
    if (this.data) {
      //console.log("inside if");
      return Promise.resolve(this.data);
    }

 // API CALL START

 return new Promise(resolve => {
    var url = "";
    url = `https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/storemaster/supplier?drugname=${suppliername}`;
    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
         // console.log(this.data);
          resolve(this.data);
        },
        err=>{
          console.log("Error occurred while searching supplier:" + err);
          resolve(new Error(err || " - Service Error"));
        });
    });    //  API CALL END 
   
  }

  // function to post a drug item to AWS
  manageSupplier(supplieritem){

      return new Promise(resolve => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/MasterData/supplier', supplieritem, {headers: headers})
            .subscribe((data) => {
            resolve(data);
          },
         err=>{
          console.log("Error occurred while updating supplier:" + err);
          resolve(new Error(err || " - Service Error"));
        });
  
      });

    }

 
 
 
getSupplierDetails(supplierid: string){

    if (this.data) {
      return Promise.resolve(this.data);
    }
    
 // API CALL START

this.data = null;
 return new Promise(resolve => {
    var url = "";
   
    url = `https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/MasterData/supplier/${supplierid}`;
    
    
  // console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          
          this.data =data;
          resolve(this.data);
        },
         err=>{
          console.log("Error occurred while retrieving supplier details:" + err);
          resolve(new Error(err || " - Service Error"));
        });
    });    //  API CALL END 
   
 }

 getAllSuppliers(){

    if (this.data) {
      return Promise.resolve(this.data);
    }
    
 // API CALL START

this.data = null;
 return new Promise(resolve => {
    var url = "";
   
    url = `https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/MasterData/supplier`;
    
    
  // console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          
          this.data =data;
          resolve(this.data);
        },
         err=>{
          console.log("Error occurred while retrieving suppliers:" + err);
          resolve(new Error(err || " - Service Error"));
        });
    });    //  API CALL END 
   
 }


}
