import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {SafeHttp} from '../utilities/safehttp';

// providers
import {InventoryService} from '../../../providers/data/inventory/inventoryservice';
import {SupplierAPIService} from '../../../providers/data/supplier/supplierservice';

@Injectable()
 
export class SynchAWSDataToLocal {
  data: any;
  storage: Storage;
  str = "ABC";
 
constructor(private http: SafeHttp,private invtservice:InventoryService, private supplierservice: SupplierAPIService ) {
    this.data = null;
    this.storage = new Storage(SqlStorage);
  }

download_drugmaster(){

// first delete all records in store_drug master if any exists

return this.storage.query("DELETE  FROM store_drugmaster")
    .then(res => {
     // this.status= "Local drug master recordshave delted sucessfully !";
      console.log("all records in the local store drug master are deleted.");

      // all records have been deleted sucessfully !! let's synchronize AWS data to local store
     for (var i=0; i<this.str.length; i++)
	    {
	      var nextChar = this.str.charAt(i);
        this.invtservice.searchInventory(nextChar);
        this.invtservice.searchInventory(nextChar).then((data) => {
           console.log(data);
           if (typeof data !== 'undefined' && data !== null) this.add_drugmaster(data);
           data = null;
         })
	    } 



      console.log("store drug master has been synchrnoied sucessfully !")

      return Promise.resolve(true);
      
    })
    
    .catch(error=>{ 
      console.log("Error occurred while downloading data from AWS" + error.err.message);
      return Promise.resolve(false);
    })

}


download_supplierdata(){

  return this.storage.query("DELETE  FROM store_suppliermaster")
    .then(res => {
      console.log("supplier master in the local store has been deleted sucessfully.");


     this.supplierservice.getAllSuppliers().then((data) => {
           console.log(data);
           if (typeof data !== 'undefined' && data !== null) this.add_supplier(data);
           data = null;
      })

      console.log("store supplier data has been synchrnoied sucessfully !")

      return Promise.resolve(true);
    })

    .catch(error=>{ 
      console.log("Error occurred while downloading data from AWS" + error.err.message);
      return Promise.resolve(false);
    })

}

add_supplier(data:any){
    console.log("inside add supplier")

    if (typeof data !== 'undefined' && data !== null)
      {
          for (var i = 0; i <data.length; i++) {
          
          var nsupplierid = (data[i].supplierid);  
          var ssuppliername = (data[i].suppliername);
          var ssuppliertown = (data[i].suppliertown);

          this.storage.query("INSERT INTO store_suppliermaster(supplierid, suppliername, suppliercity) VALUES (?,?,?)", [nsupplierid, ssuppliername, ssuppliertown])
          .then(res => {
                console.log( nsupplierid + "inserted sucessfully.");
              })
          .catch(error=> 
              console.log("Error occurred while inserting record into store supplier master:" + error.err.message)
            ); 
        }
    }
}

add_drugmaster(data: any){

    console.log("inside add drug master")

    if (typeof data !== 'undefined' && data !== null)
      {
          for (var i = 0; i <data.length; i++) {
          
          var ndrugid = (data[i].drugid);  
          var sdrugname = (data[i].drugname);
          var sdrugtype = (data[i].drugtype);
          var smfgcode = data[i].mfgcode;
          var sscheduledrug = data[i].scheduledrug;

          this.storage.query("INSERT INTO store_drugmaster(drugid, drugname, drugtype,mfgcode,scheduledrug) VALUES (?,?,?,?,?)", [ndrugid, sdrugname, sdrugtype,smfgcode,sscheduledrug])
          .then(res => {
                console.log( ndrugid + "inserted sucessfully.");
              })
          .catch(error=> 
              console.log("Error occurred while inserting record into store drug master:" + error.err.message)
            ); 
        }
    }

  }

  sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

}