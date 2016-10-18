import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-angular';
 
@Injectable()
export class LocalSupplierMaster {
 
  data: any;
  //drugdetails:any;
  storage: Storage;
  public globalsupplierlist: Array<Object>;

 
  constructor(private http: Http) {
    this.data = null;
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS store_suppliermaster (supplierid TEXT, suppliername TEXT, suppliertown TEXT)");
  
    console.log("store_suppliermaster table created");
    //console.log("getalldrugs");
    this.getlocalsupplieritems();

 }
  

  // search a supplier in the local store by supplier id
  searchSupplier(item: any){
     return this.storage.query("SELECT COUNT(*) AS TOTALRECORDS FROM store_suppliermaster WHERE supplierid = ?",[item.supplierid]);
  }

  // add drug to local store
    addSupplier(item:any){
        this.storage.query("INSERT INTO store_suppliermaster(supplierid, suppliername,suppliertown) VALUES (?,?,?)", [item.supplierid, item.suppliername,item.suppliertown]).then((data) => 
        {
            this.globalsupplierlist.push({supplierid: item.supplierid, suppliername: item.supplierid, suppliertown: item.suppliertown });
            return Promise.resolve(true);
        }, (error) => {
            return Promise.resolve(false);
        });
        return Promise.resolve(true);
    }

    // update a drug in local store
    updateSupplier(item:any){
      this.storage.query("UPDATE store_suppliermaster SET suppliername =?, suppliertown=? WHERE supplierid = ?", [item.suppliername,item.suppliertown,item.supplierid]).then((data) => {
          return Promise.resolve(true);
      }, (error) => {
           return Promise.resolve(false);
      });
      return Promise.resolve(true);
  }

  // search drugs in local store
  getAllSuppliers(){
      
      return  this.storage.query("SELECT supplierid, suppliername,suppliertown FROM store_suppliermaster");
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
                            this.globalsupplierlist.push({supplierid: responseobject.rows[i].supplierid, suppliername: responseobject.rows[i].suppliername,suppliertown: responseobject.rows[i].suppliertown});
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
