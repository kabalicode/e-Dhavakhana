import {Injectable,Component} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-angular';
import {SafeHttp} from '../utilities/safehttp';

@Injectable()
export class LocalSupplierMaster {
 
  data: any;
  //drugdetails:any;
  storage: Storage;
  public globalsupplierlist: Array<Object>;

 
  constructor(private http: SafeHttp) {
    this.data = null;
    this.storage = new Storage(SqlStorage);
    
    this.storage.query("CREATE TABLE IF NOT EXISTS store_suppliermaster(supplierid TEXT, suppliername TEXT, suppliercity TEXT)");
  
    console.log("store_suppliermaster table created");

    //this.storage.query("DROP TABLE IF EXISTS store_suppliermaster");

    //console.log("store_suppliermaster table deleted");

    //console.log("getalldrugs");
    this.getlocalsupplieritems();

 }
  

  // search a supplier in the local store by supplier id
 // searchSupplier(item: any){
   //  return this.storage.query("SELECT COUNT(*) AS TOTALRECORDS FROM store_suppliermaster WHERE supplierid = ?",[item.supplierid]);
 // }

    // search a supplier in the local store by supplier id
  getSupplierId(item: any){
     return this.storage.query("SELECT supplierid FROM store_suppliermaster WHERE suppliername = ? AND suppliercity=?",[item.suppliername,item.suppliercity]);
  }

  // search a supplier in the local store by supplier id
  searchSupplierByName(item: any){
     return this.storage.query("SELECT COUNT(*) AS TOTALRECORDS FROM store_suppliermaster WHERE suppliername = ? AND suppliercity=?",[item.suppliername,item.suppliercity]);
  }

  // add drug to local store
    addSupplier(item:any){
        this.storage.query("INSERT INTO store_suppliermaster(supplierid, suppliername,suppliercity) VALUES (?,?,?)", [item.supplierid, item.suppliername,item.suppliercity]).then((data) => 
        {
            this.globalsupplierlist.push({supplierid: item.supplierid, suppliername: item.suppliername, suppliercity: item.suppliercity });
            return Promise.resolve(true);
        }, (error) => {
            return Promise.resolve(false);
        });
        return Promise.resolve(true);
    }

    // update a drug in local store
    updateSupplier(item:any){
      this.storage.query("UPDATE store_suppliermaster SET suppliername =?, suppliercity=? WHERE supplierid = ?", [item.suppliername,item.suppliercity,item.supplierid]).then((data) => {
          return Promise.resolve(true);
      }, (error) => {
           return Promise.resolve(false);
      });
      return Promise.resolve(true);
  }

  // search drugs in local store
  getAllSuppliers(){
      
      return  this.storage.query("SELECT supplierid, suppliername,suppliercity FROM store_suppliermaster");
      //console.log("getalldrugs" + this.alldrugdataobject);
      //return this.alldrugdataobject;

  }

   getlocalsupplieritems() 
    {
      
        this.getAllSuppliers().then((res) => {
            this.globalsupplierlist = [];
        
            let responseobject : any;
            responseobject = res;

            if (typeof responseobject!== 'undefined' && responseobject!== null)
            {
                responseobject = responseobject.res;
                console.log(responseobject.rows.length);
                if (responseobject.rows.length >0)
                {
                        for(var i = 0; i < responseobject.rows.length; i++) {
                            this.globalsupplierlist.push({supplierid: responseobject.rows[i].supplierid, suppliername: responseobject.rows[i].suppliername,suppliercity: responseobject.rows[i].suppliercity});
                    }

                }
                console.log("globalsupplierlist");
                console.log(this.globalsupplierlist);
            }

            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
            
            });

    }


}
