import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-angular';
import {SafeHttp} from '../utilities/safehttp';
 
@Injectable()
export class LocalDrugInventory {
 
  data: any;
  //drugdetails:any;
  storage: Storage;
  public globaldrugslist: Array<Object>;

 
  constructor(private http: SafeHttp) {
    this.data = null;
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS store_drugmaster (drugid INTEGER, drugname TEXT, drugtype TEXT, mfgcode TEXT ,scheduledrug TEXT )")
    .then(res => 
      console.log("store_drugmaster table created")
    )
    .catch(error=> 
      console.log("Error occurred during table creation in local storage store_drugmaster:" + error.err.message)
    );
  
    
    console.log("getalldrugs");
    this.getlocaldrugitems();

 }
  
 getDrugId(item: any){
     return this.storage.query("SELECT drugid FROM store_drugmaster WHERE drugname = ? AND drugtype=?",[item.drugname,item.drugtype])
     .then(res => {
        console.log("drugid:" + res);
        return res;
    })
    .catch(error=> {
        console.log("Error occurred while retrieving drug id from drug master:" + error);
        console.log("error:" + error.err.message);
        error = new Error(error.err.message || 'Server error');
        return error;
    });
  }

 // returns all drugs in local store 
  // search a drug in the local store by drug id
  searchDrug(item: any){
     return this.storage.query("SELECT COUNT(*) AS TOTALRECORDS FROM store_drugmaster WHERE drugid = ?",[item.drugid])
    .then(res => {
        console.log("TOTALRECORDS" + res);
        return res;
    })
    .catch(error=> {
        console.log("Error occurred while retrieving TOTAL RECORDS FROM drug master:" + error);
        console.log("error:" + error.err.message);
        error = new Error(error.err.message || 'Server error');
        return error;
    });
  }

   // search a supplier in the local store by supplier id
  searchDrugByName(item: any){
     return this.storage.query("SELECT drugid FROM store_drugmaster WHERE drugname = ? AND drugtype=?",[item.drugname,item.drugtype])
    .then(res => {
        console.log("drugid" + res);
        return res;
    })
    .catch(error=> {
        console.log("Error occurred while retrieving TOTAL RECORDS FROM drug master:" + error);
        console.log("error:" + error.err.message);
        error = new Error(error.err.message || 'Server error');
        return error;
    });
  }

  // add drug to local store
    addDrug(item:any){
        return this.storage.query("INSERT INTO store_drugmaster(drugid, drugname, drugtype,mfgcode,scheduledrug) VALUES (?,?,?,?,?)", [item.drugid, item.drugname, item.drugtype,
        item.mfgcode, item.scheduledrug])
        .then((data) => 
        {
            this.globaldrugslist.push({drugid: item.drugid, drugname: item.drugname,drugtype: item.drugtype,mfgcode:item.mfgcode});
            return true;
        }, (error) => {
            error = new Error(error.err.message || 'Server error');
            return error;
        });
       // return Promise.resolve(true);
    }

    // update a drug in local store
    updateDrug(item:any){
      return this.storage.query("UPDATE store_drugmaster SET drugname =?, drugtype=?, mfgcode=?, scheduledrug=? WHERE drugid = ?", [item.drugname, item.drugtype,item.mfgcode, 
      item.scheduledrug,item.drugid]).then((data) => {
          return true;
      }, (error) => {
        error = new Error(error.err.message || 'Server error');
        return error;
      });
      //return Promise.resolve(true);
  }

  // search drugs in local store
  getAllDrugs(){
      
      return  this.storage.query("SELECT drugid,drugname,drugtype,mfgcode FROM store_drugmaster")
       .then(res => {
          console.log("get all drugs:" + res);
          return res;
        })
        .catch(error=> {
          console.log("Error occurred while retrieving all drugs:" + error);
          console.log("error:" + error.err.message);
          error = new Error(error.err.message || 'Server error');
          return error;
        });

  }

   getlocaldrugitems() 
    {
      
        this.getAllDrugs().then((res) => {
            this.globaldrugslist = [];
        
            let responseobject : any;
            responseobject = res;

            if (typeof responseobject!== 'undefined' && responseobject!== null)
            {
                responseobject = responseobject.res;
                console.log(responseobject.rows.length);
                if (responseobject.rows.length >0)
                {
                        for(var i = 0; i < responseobject.rows.length; i++) {
                           // this.globaldrugslist.push({drugid: responseobject.rows[i].drugid, drugname: responseobject.rows[i].drugname,drugtype: responseobject.rows[i].drugtype,mfgcode: responseobject.rows[i].mfgcode});
                            this.globaldrugslist.push({drugid: responseobject.rows.item(i).drugid, drugname: responseobject.rows.item(i).drugname,drugtype: responseobject.rows.item(i).drugtype,mfgcode: responseobject.rows.item(i).mfgcode});
                    }

                }
                console.log("globaldrugslist");
                console.log(this.globaldrugslist);
            }

            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
                error = new Error(error.err.message || 'Server error');
                return error;
            
            });

    }


}
