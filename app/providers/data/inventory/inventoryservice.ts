import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {SafeHttp} from '../utilities/safehttp';
 
@Injectable()
export class InventoryService {
 
  data: any;
  storage: Storage;
  favlist: any;
  drugdetailsdata: any;

 
  constructor(private http: SafeHttp) {
    this.data = null;
    this.favlist = [];
    this.drugdetailsdata = null;
    this.storage = new Storage(SqlStorage);
    
    this.storage.query("CREATE TABLE IF NOT EXISTS DRUG_FAVORITES (id INTEGER, name TEXT, type TEXT )")
    .then(res => 
      console.log("DRUG_FAVORITES table created")
    )
    .catch(error=> 
      console.log("Error occurred during table creation in local storage:" + error.err.message)
    );    
    //console.log("Table DRUG_FAVORITES Created");
  }

  getFavDrugs(){
        return this.storage.query("SELECT * FROM DRUG_FAVORITES")
        .then(res => {
        console.log("drug favorites:" + res);
        return res;
    })
    .catch(error=> {
        console.log("Error occurred while retrieving favourite drugs:" + error);
        console.log("error:" + error.err.message);
        error = new Error(error.err.message || 'Server error');
        return error;
    });
  }

  addFavDrug(item:any){
        return this.storage.query("INSERT INTO DRUG_FAVORITES (id, name, type) VALUES (?,?,?)", [item.drugid, item.drugname, item.drugtype])
        .then((data) => {
            console.log("INSERTED fav drug into fav table: " + JSON.stringify(data));
            return 1;
        }, (error) => {
            console.log("ERROR: during inserting drug into fav table" + JSON.stringify(error.err));
            //error = new Error(error.err.message || 'Server error');
            return -1;
        });
        //return 1;
  }

  removeFavDrug(item:any){
    return this.storage.query("DELETE FROM DRUG_FAVORITES WHERE ID = ?", [item.id]).then((data) => {
          console.log("Deleted fav drug from fav table: " + JSON.stringify(data));
          return 1;
      }, (error) => {
          console.log("ERROR: during deleting drug from fav table" + JSON.stringify(error.err));
         // error = new Error(error.err.message || 'Server error');
          return -1;
      });
      //return 1;
  }

  searchInventory(searchParam: string){
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
 // API CALL START
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
        },
        err=>{   
          console.log("Error occurred while searching drug" + err);
          resolve(new Error(err || " - Service Error"));  
        });
    });    //  API CALL END 
    
  }

  // retrieve drug details from store inventory based on the supplied drug id
// the api that's invoked is store drug inventory (get by drugid)
getDrugDetails(drugid: number){

/*this.drugdetailsdata = {
  "packagetype": "30 CAPSULE",
  "minqty": 90,
  "scheduledrug": "NO",
  "availabledrugqty": 12,
  "drugname": "ANTOXID",
  "drugtype": "CAPSULE",
  "mfgcode": "DR REDDY LABORATORIES LTD",
  "rackposition": "A2",
  "drugid": 1482114465170,
  "composition": "ZINC SULPHATE-27.45 MG;SELENIUM-70 MCG;MANGANESE-2 MG;BETA CAROTENE-10 MG;COPPER-1 MG;",
  "suppliers": [
    {
      "name": "MEDPLUS HITECH CITY",
      "batches": [
        {
          "total_price": 96,
          "mrp": 8,
          "discount": 0,
          "vat": 1,
          "supplierid": "SUP1480999398069",
          "batchno": "B102",
          "drugid": 1482114465170,
          "expirydate": "2020-08-01",
          "invoiceno": 1482204383391,
          "suppliername": "MEDPLUS HITECH CITY",
          "availablebatchqty": 200,
          "drugname": "ANTOXID",
          "drugtype": "CAPSULE",
          "unitprice": 4
        }
      ]
    }
  ]
}*/

    if (this.drugdetailsdata) {
     console.log("inside if");
      return Promise.resolve(this.drugdetailsdata);
    }



 // API CALL START
//console.log("drugdetails");
this.drugdetailsdata = null;
 return new Promise(resolve => {
    var url = "";
    url = `https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs/${drugid}`;
   // console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(drugdetailsdata => {
          this.drugdetailsdata = drugdetailsdata;
       //   console.log(this.drugdetailsdata);
          resolve(this.drugdetailsdata);
        },
          err=>{   
            console.log("Error occurred while retrieving drug details:" + err);
            resolve(new Error(err || " - Service Error"));  
        });
    });    //  API CALL END 
 
  }

  
  // function to post a drug item to AWS
  manageDrug(drugitem){
      console.log(drugitem);
      return new Promise(resolve => {
  
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(JSON.stringify(review));
        this.http.post('https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs', drugitem, {headers: headers})
          .subscribe((data) => {
            console.log(data);
            resolve(data);
            //console.log(data);
          },
           err=>{   
            console.log("Error occurred while updating drug details:" + err);
            resolve(new Error(err || " - Service Error"));  
          });
      });

    }

}
