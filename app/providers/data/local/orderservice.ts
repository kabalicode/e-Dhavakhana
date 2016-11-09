import {Injectable,Component} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-angular';
import {SafeHttp} from '../utilities/safehttp';

@Injectable()
export class LocalOrderBookService {
 
  data: any;
  //drugdetails:any;
  storage: Storage;
  public globalorderbooklist: Array<Object>;

 
  constructor(private http: SafeHttp) {
    this.data = null;
    this.storage = new Storage(SqlStorage);
    
    this.storage.query("CREATE TABLE IF NOT EXISTS store_orderbook(drugname TEXT, drugtype TEXT, mfgcode TEXT,qty INTEGER, status TEXT )");
  
    console.log("store_orderbook table created");

    //this.storage.query("DROP TABLE IF EXISTS store_suppliermaster");

    //console.log("store_suppliermaster table deleted");

    //console.log("getalldrugs");
    this.getlocalorderbookitems();

 }

   removeOrder(item:any){
    this.storage.query("DELETE FROM store_orderbook WHERE drugname = ? AND drugtype=?", [item.drugname, item.drugtype]).then((data) => {
        this.getlocalorderbookitems();
          console.log("Deleted drug fom the orderbook: " + JSON.stringify(data));
      }, (error) => {
          console.log("ERROR: during deleting drug from orderbook table" + JSON.stringify(error.err));
          return -1;
      });
      return 1;
  }

  
  // add drug to local store
    addOrder(item:any){
        this.storage.query("INSERT INTO store_orderbook(drugname, drugtype,mfgcode,qty,status) VALUES (?,?,?,?,?)", [item.drugname, item.drugtype,item.mfgcode,item.qty,item.status]).then((data) => 
        {
            this.globalorderbooklist.push({drugname: item.drugname, drugtype: item.drugtype, mfgcode: item.mfgcode, qty: item.qty, status: item.status });
            return Promise.resolve(true);
        }, (error) => {
            return Promise.resolve(false);
        });
        return Promise.resolve(true);
    }


  // get all orders from local store
  getAllOrders(){
      
      return  this.storage.query("SELECT drugname, drugtype,mfgcode,qty,status FROM store_orderbook");
      //console.log("getalldrugs" + this.alldrugdataobject);
      //return this.alldrugdataobject;

  }

   getlocalorderbookitems() 
    {
      
        this.getAllOrders().then((res) => {
            this.globalorderbooklist = [];
        
            let responseobject : any;
            responseobject = res;

            if (typeof responseobject!== 'undefined' && responseobject!== null)
            {
                responseobject = responseobject.res;
                console.log(responseobject.rows.length);
                if (responseobject.rows.length >0)
                {
                        for(var i = 0; i < responseobject.rows.length; i++) {
                            this.globalorderbooklist.push({drugname: responseobject.rows[i].drugname, 
                                drugtype: responseobject.rows[i].drugtype,
                                mfgcode: responseobject.rows[i].mfgcode,
                                qty: responseobject.rows[i].qty,
                                status: responseobject.rows[i].status});
                    }

                }
                console.log("globalorderbooklist");
                console.log(this.globalorderbooklist);
            }

            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
            
            });

    }


}
