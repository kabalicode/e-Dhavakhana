import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class SupplierAPIService {
 
  data: any;
  supplierdetailsdata: any;

 
  constructor(private http: Http) {
    this.data = null;
    this.supplierdetailsdata = null;
    console.log("inside supplier API service");
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

/*
  // retrieve drug details from store inventory based on the supplied drug id
// the api that's invoked is store drug inventory (get by drugid)
  getSupplierDetails(supplierid: string){

    if (this.supplierdetailsdata) {
      //console.log("inside if");
      return Promise.resolve(this.supplierdetailsdata);
    }
    
   // this.modeldrug = null;
    // Stub data during unit testing
//****************************************** stub data **************************************************************    
    this.supplierdetailsdata = {
  "constituents": "Doxylamine (NA) Pyridoxine (NA)",
  "minqty": 275,
  "scheduledrug": "H",
  "availabledrugqty": 5720,
  "drugname": "NORFLOX (400 MG)",
  "drugtype": "TABLET",
  "availableqty": 3040,
  "mfgcode": "CIPLA LIMITED",
  "rackposition": "R2",
  "drugid": 1466443590698,
  "suppliers": [
    {
      "name": "RAMA MEDICALS",
      "batches": [
        {
          "expirydate": "2016-12-28T01:59:24.678Z",
          "total_price": 840,
          "suppliername": "RAMA MEDICALS",
          "mrp": 10,
          "invoiceno": "1465038167678,1465038167691",
          "availablebatchqty": 4080,
          "discount": 0,
          "vat": 1,
          "drugname": "NORFLOX (400 MG)",
          "drugtype": "TABLET",
          "supplierid": "SUP1234",
          "batchno": "ABC1234",
          "unitprice": 7,
          "drugid": 1466443590698
        }
      ]
    },
    {
      "name": "SURYA MEDICALS",
      "batches": [
        {
          "total_price": 50,
          "mrp": 8,
          "discount": 1,
          "vat": 1,
          "supplierid": "SUP1234",
          "batchno": "BATCH102",
          "drugid": 1466443590698,
          "expirydate": "2017-09-18",
          "invoiceno": 1466542448031,
          "suppliername": "SURYA MEDICALS",
          "availablebatchqty": 480,
          "drugname": "NORFLOX (400 MG)",
          "drugtype": "TABLET",
          "unitprice": 50
        }
      ]
    },
    {
      "name": "VAIBHAV MEDICALS",
      "batches": [
        {
          "expirydate": "2016-05-15T01:59:24.678Z",
          "total_price": 50,
          "suppliername": "VAIBHAV MEDICALS",
          "mrp": 8,
          "invoiceno": "1465038167654:1465038167678",
          "availablebatchqty": 1000,
          "discount": 1,
          "vat": 1,
          "drugname": "NORFLOX (400 MG)",
          "drugtype": "TABLET",
          "supplierid": "SUP1234",
          "batchno": "BATCH20062016",
          "unitprice": 5,
          "drugid": 1466443590698
        },
        {
          "expirydate": "2017-09-18",
          "total_price": 50,
          "suppliername": "VAIBHAV MEDICALS",
          "mrp": 8,
          "invoiceno": 1466542448031,
          "availablebatchqty": 160,
          "discount": 1,
          "vat": 1,
          "drugname": "NORFLOX (400 MG)",
          "drugtype": "TABLET",
          "supplierid": "SUP1234",
          "batchno": "BATCHTXT_JULY012016",
          "unitprice": 50,
          "drugid": 1466443590698
        }
      ]
    }
  ]
};
 return Promise.resolve(this.supplierdetailsdata); 
   // console.log(this.drugdetailsdata);
//***************************************** stub data *************************************************   
 
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START
/*
this.drugdetailsdata = null;
 return new Promise(resolve => {
    var url = "";
    url = `https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs/${drugid}`;
    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(drugdetailsdata => {
          this.drugdetailsdata = drugdetailsdata;
          console.log("inside provider data...s");
          console.log(this.drugdetailsdata);
          resolve(this.drugdetailsdata);
        });
    });    //  API CALL END 
 
  }*/

 
  // function to post a drug item to AWS
  manageSupplier(supplieritem){
  
      return new Promise(resolve => {
  
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(supplieritem));
        this.http.post('https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/storemaster/supplier', supplieritem, {headers: headers})
          .subscribe((data) => {
            resolve(data);
            console.log(data);
          });
  
      });

    }

}
