import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
 
@Injectable()
export class InvoiceService {
 
  data: any;
  storage: Storage;
  favlist: any;
 
  constructor(private http: Http) {
    this.data = null;
    this.favlist = [];
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS SUPPLIER_FAVORITES (id INTEGER, name TEXT, streetname TEXT, city TEXT )");
    console.log("Table SUPPLIER_FAVORITES Created");
  }
 

  getFavSuppliers(){
        return this.storage.query("SELECT * FROM SUPPLIER_FAVORITES");
  }

  addFavSupplier(item:any){
        this.storage.query("INSERT INTO SUPPLIER_FAVORITES (id, name, streetname, city) VALUES (?,?,?,?)", [item.supplierid, item.suppliername, item.address.streetname, item.address.city]).then((data) => {
            console.log("INSERTED fav supplier into fav table: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: during inserting supplier into fav table" + JSON.stringify(error.err));
        });
        return 1;
  }

  removeFavSupplier(item:any){
    this.storage.query("DELETE FROM SUPPLIER_FAVORITES WHERE ID = ?", [item.id]).then((data) => {
          console.log("Deleted fav supplier from fav table: " + JSON.stringify(data));
      }, (error) => {
          console.log("ERROR: during deleting supplier from fav table" + JSON.stringify(error.err));
          return -1;
      });
      return 1;
  }

  getSuppliers(searchParam: string){
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    // Stub data during unit testing

   this.data = [{"taxdetails":{"TIN#":"KHCR","GST#":"20150625"},"supplierid":"SUP1467344348974","suppliername":"BHAVANI MEDICALS","address":{"pin":"560037","state":"Karnataka","town":"Bangalore","streetname":"MG Road","city":"Bangalore"}},{"taxdetails":{"TIN#":"KHCR","GST#":"20150625"},"supplierid":"SUP1467344014894","suppliername":"VAISHNAVI MEDICALS","address":{"pin":"560037","state":"Karnataka","town":"Bangalore","streetname":"MG Road","city":"Bangalore"}},{"taxdetails":{"TIN#":"KHCR","GST#":"20150625"},"supplierid":"SUP1467344436960","suppliername":"SRI BALAJI MEDICALS","address":{"pin":"560037","state":"Karnataka","town":"Bangalore","streetname":"MG Road","city":"Bangalore"}}];
    return Promise.resolve(this.data); 

     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START
/*
 return new Promise(resolve => {
    var url = "";
    url = `https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/storemaster/supplier?suppliername=${searchParam}`;
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
}
