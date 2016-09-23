import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
 
@Injectable()
export class DrugsService {
 
  data: any;
  storage: Storage;
  favlist: any;
  drugdetailsdata: any;

 
  constructor(private http: Http) {
    this.data = null;
    this.favlist = [];
    this.drugdetailsdata = null;
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS DRUG_FAVORITES (id INTEGER, name TEXT, type TEXT )");
    console.log("Table DRUG_FAVORITES Created");
  }

  getFavDrugs(){
        return this.storage.query("SELECT * FROM DRUG_FAVORITES");
  }

  addFavDrug(item:any){
        this.storage.query("INSERT INTO DRUG_FAVORITES (id, name, type) VALUES (?,?,?)", [item.drugid, item.drugname, item.drugtype]).then((data) => {
            console.log("INSERTED fav drug into fav table: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: during inserting drug into fav table" + JSON.stringify(error.err));
        });
        return 1;
  }

  removeFavDrug(item:any){
    this.storage.query("DELETE FROM DRUG_FAVORITES WHERE ID = ?", [item.id]).then((data) => {
          console.log("Deleted fav drug from fav table: " + JSON.stringify(data));
      }, (error) => {
          console.log("ERROR: during deleting drug from fav table" + JSON.stringify(error.err));
          return -1;
      });
      return 1;
  }

  getDrugs(searchParam: string){
// console.log("Drugs here..")
    if (this.data) {
      //console.log("inside if");
      return Promise.resolve(this.data);
    }
 
    // Stub data during unit testing

   this.data = [{"drugtype":"TABLET","drugname":"LOCAL NORFLOX (400 MG)","drugid":1466443590698},{"drugtype":"DROPS","drugname":"TEST drug (10 ml)","drugid":1465352989818},{"drugtype":"TABLET","drugname":"ANACIN (400 MG)","drugid":1465038162264},{"drugtype":"SYRUP","drugname":"COREX(100 ML)","drugid":1465038161607},{"drugtype":"DROPS","drugname":"TEST drug (10 ml)","drugid":1465352921358},{"drugtype":"DROPS","drugname":"GIRI (400 MG)","drugid":1465443397713},{"drugtype":"DROPS","drugname":"PRANU (400 MG)","drugid":1465443925976},{"drugtype":"TABLET","drugname":"CITRIZINE (10 MG)","drugid":1465038427520},{"drugtype":"SUSPENSION","drugname":"CALPOL PLUS (60 ML)","drugid":1465038427492},{"drugtype":"TABLET","drugname":"CROCIN(100 MG)","drugid":1465038162203},{"drugtype":"DROPS","drugname":"TEST drug (10 ml)","drugid":1465351589490},{"drugtype":"DROPS","drugname":"GIRI POST (400 MG)","drugid":1465443517896},{"drugtype":"SYRUP","drugname":"COREX (100 ML)","drugid":1465038427495}];
    return Promise.resolve(this.data); 

     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START
/*
 return new Promise(resolve => {
    var url = "";
    url = `https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs?drugname=${searchParam}`;
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

  // retrieve drug details from store inventory based on the supplied drug id
// the api that's invoked is store drug inventory (get by drugid)
  getDrugDetails(drugid: number){

    if (this.drugdetailsdata) {
      //console.log("inside if");
      return Promise.resolve(this.drugdetailsdata);
    }
    
   // this.modeldrug = null;
    // Stub data during unit testing
//****************************************** stub data **************************************************************    
    this.drugdetailsdata = {
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
 return Promise.resolve(this.drugdetailsdata); 
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
 */
  }
}
