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
        });
    });    //  API CALL END 
   
  }

  // function to post a drug item to AWS
  manageSupplier(supplieritem){
  
      return new Promise(resolve => {
  
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(JSON.stringify(supplieritem));
        this.http.post('https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/MasterData/supplier', supplieritem, {headers: headers})
            .subscribe((data) => {
            //console.log(data);  
            resolve(data);
            
          });
  
      });

    }

 
 
 
getSupplierDetails(supplierid: string){

    if (this.data) {
      return Promise.resolve(this.data);
    }
    
  
   // console.log(this.drugdetailsdata);
//***************************************** stub data *************************************************  
/* 
this.data = {
  "taxdetails": {
    "TIN": "100",
    "GST": "121"
  },
  "supplierid": "SUP1477191943297",
  "suppliername": "RAMA",
  "address": {
    "areaname": "MARUPROLUVARIPALEM ",
    "suppliercity": "GUNTUR",
    "pin": "522101",
    "state": "ANDHRA PRADESH",
    "country" : "INDIA"
  },
  "contactdetails": {
    "contactname": "MAHA",
    "landlineno": 987654321,
    "mobileno": 1098282
  },
  "suppliertown": "GUNTUR"
}
 return Promise.resolve(this.data);
*/
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
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
         //console.log("inside getsupplierdetails api");
        
          resolve(this.data);
        });
    });    //  API CALL END 
   
 }


}
