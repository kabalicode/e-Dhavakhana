import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {SafeHttp} from '../utilities/safehttp';
 
@Injectable()
export class InvoiceService {
 
  data: any;
  supplierList = [];
  searchkey: string;
  storage: Storage;
  favlist: any;
 
  constructor(private http: SafeHttp) {
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

  getInvoiceDetails(invoiceId: string){
    /*var invoicedata = {
      "invoiceno":1466533427424,
      "suppliername":"BHAVANI MEDICALS",
      "invoicedate":"22/06/2016",
      "total_invoice_value":2775,
      "supplierid":"SUP1467344348974",
      "taxinvoiceno":"T123-98",
      "transaction_type":"CASH",
      "invoiceitems":
          [
            {"expirydate":"2019-05-28T01:59:24.678Z","total_price":1500,"mrp":10,"invoiceno":1466533427424,"discount":0,"vat":0,"drugname":"CROCIN(100MG)","drugtype":"TABLET","purchase_qty":908,"batchno":"BATCHF_JUNE212016","unitprice":5,"mfg":"REDDY LABS","drugid":1465038162203},{"expirydate":"2020-09-28T01:59:24.678Z","total_price":1275,"mrp":50,"invoiceno":1466533427424,"discount":0,"vat":2,"drugname":"GIRI (400 MG)","drugtype":"DROPS","purchase_qty":127,"batchno":"BATCHX_JUNE212016","unitprice":46,"mfg":"PFIZER","drugid":1465443397713}
          ]
    };
  
    return Promise.resolve(invoicedata); */

    // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START

 return new Promise(resolve => {
    var url = "";
    url = 'https://qshc2lp143.execute-api.us-west-2.amazonaws.com/invoice/invoice/' + invoiceId;
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

  getSupplierInvoices(supplierId: string) {


    // var invoicedata = [{"supplierid":"SUP1467344348974","invoiceno":1466533427424, "taxinvoiceno":"T123-98","suppliername":"BHAVANI MEDICALS","invoicedate":"22/06/2016","total_invoice_value":2775,"batchno":"MASTER"},{"supplierid":"SUP1467344348974","invoiceno":1466533315601, "taxinvoiceno":"T123-98","suppliername":"BHAVANI MEDICALS","invoicedate":"21/06/2016","total_invoice_value":2775,"batchno":"MASTER"},{"supplierid":"SUP1467344348974","invoiceno":1467521532053, "taxinvoiceno":"T123-98","suppliername":"BHAVANI MEDICALS","invoicedate":"25/06/2016","total_invoice_value":2775,"batchno":"MASTER"},{"supplierid":"SUP1467344348974","invoiceno":1467520691012, "taxinvoiceno":"T123-98","suppliername":"BHAVANI MEDICALS","invoicedate":"25/06/2016","total_invoice_value":2775,"batchno":"MASTER"}];
  
    // return Promise.resolve(invoicedata); 

    // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START

 return new Promise(resolve => {
    var url = "";
    url = 'https://qshc2lp143.execute-api.us-west-2.amazonaws.com/invoice/invoice/?supplierid=' + supplierId;
    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          if (this.data == "") this.data = null;
          resolve(this.data);
        });
    });    //  API CALL END 
    

}

  addInvoice(invoice: any){
    if (invoice) {
      console.log("new invoice obj:" + JSON.stringify(invoice));
      //return Promise.resolve("");
      return new Promise(resolve => {
          var url = "";
          url = 'https://qshc2lp143.execute-api.us-west-2.amazonaws.com/invoice/invoice';
          //console.log(url);
          this.http.post(url, invoice)
              .map(res => res.json())
              .subscribe(data => {
                this.data = data;
                console.log(this.data);
                resolve(this.data);
              });
          }); 
    }
  }

  checkmatches(obj){
    console.log("search key in checkmatches:" + this.searchkey);
    if (obj.suppliername.toUpperCase().indexOf(this.searchkey.toUpperCase()) > -1) {
      return true;
    } else {
      return false;
    }
  }

  getSuppliers(searchParam: string){
    var params = {searchkey: searchParam};
    console.log("search key:" + this.searchkey);
    if (this.supplierList && this.supplierList.length > 0) {
      var filteredList = this.supplierList.filter(this.checkmatches, params);
      console.log("length of filtered list:" + filteredList.length);
      if(filteredList.length > 0) {
        return Promise.resolve(filteredList);
      }
    }
 
    // Stub data during unit testing

   this.data = [{"taxdetails":{"TIN#":"KHCR","GST#":"20150625"},"supplierid":"SUP1467344348974","suppliername":"BHAVANI MEDICALS","address":{"pin":"560037","state":"Karnataka","town":"Bangalore","streetname":"MG Road","city":"Bangalore"}},{"taxdetails":{"TIN#":"KHCR","GST#":"20150625"},"supplierid":"SUP1467344014894","suppliername":"VAISHNAVI MEDICALS","address":{"pin":"560037","state":"Karnataka","town":"Bangalore","streetname":"MG Road","city":"Bangalore"}},{"taxdetails":{"TIN#":"KHCR","GST#":"20150625"},"supplierid":"SUP1467344436960","suppliername":"SRI BALAJI MEDICALS","address":{"pin":"560037","state":"Karnataka","town":"Bangalore","streetname":"MG Road","city":"Bangalore"}}];
    return Promise.resolve(this.data); 

     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START
/*
 return new Promise(resolve => {
    var url = "";
    url = 'https://bouqovu4i9.execute-api.us-west-2.amazonaws.com/storemaster/supplier?suppliername='+searchParam;
    //console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(data => {
          this.supplierList = data;
         // console.log(this.data);
          resolve(this.supplierList);
        });
    });    //  API CALL END 
    */
  }
}
