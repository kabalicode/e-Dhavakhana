import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-angular';
 
@Injectable()
export class LocalDrugInventory {
 
  data: any;
  drugdetails:any;
  storage: Storage;
 
  constructor(private http: Http) {
    this.data = null;
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS store_drugmaster (drugid INTEGER, drugname TEXT, drugtype TEXT, mfgcode TEXT ,scheduledrug TEXT )");
    console.log("store_drugmaster tabe created");
 }
  
 // returns all drugs in local store 
  getAllDrugs(item: any){
        return Promise.resolve(this.storage.query("SELECT * FROM store_drugmaster "));
  }

  // search a drug in the local store by drug id
  searchDrug(item: any){
     return this.storage.query("SELECT COUNT(*) AS TOTALRECORDS FROM store_drugmaster WHERE drugid = ?",[item.drugid]);
  }

  // add drug to local store
    addDrug(item:any){
        this.storage.query("INSERT INTO store_drugmaster(drugid, drugname, drugtype,mfgcode,scheduledrug) VALUES (?,?,?,?,?)", [item.drugid, item.drugname, item.drugtype,
        item.mfgcode, item.scheduledrug]).then((data) => 
        {
            return Promise.resolve(true);
        }, (error) => {
            return Promise.resolve(false);
        });
        return Promise.resolve(true);
    }

    // update a drug in local store
    updateDrug(item:any){
      this.storage.query("UPDATE store_drugmaster SET drugname =?, drugtype=?, mfgcode=?, scheduledrug=? WHERE drugid = ?", [item.drugname, item.drugtype,item.mfgcode, 
      item.scheduledrug,item.drugid]).then((data) => {
          return Promise.resolve(true);
      }, (error) => {
           return Promise.resolve(false);
      });
      return Promise.resolve(true);
  }



}
