import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {SafeHttp} from '../utilities/safehttp';
 
@Injectable()
export class OrderService {
 
  ordersdata: any;

 
  constructor(private http: SafeHttp) {
    this.ordersdata = null;
  
  }

  
  
  // retrieve drug details from store inventory based on the supplied drug id
// the api that's invoked is store drug inventory (get by drugid)
getAllOrders(){


    if (this.ordersdata) {
     console.log("inside if");
      return Promise.resolve(this.ordersdata);
    }



 // API CALL START
//console.log("drugdetails");
this.ordersdata = null;
 return new Promise(resolve => {
    var url = "";
    url = `https://xj6fryj0i3.execute-api.us-west-2.amazonaws.com/orderbook/orders`;
   // console.log(url);
    this.http.get(url)
    
        .map(res => res.json())
        .subscribe(drugdetailsdata => {
          this.ordersdata = drugdetailsdata;
       //   console.log(this.drugdetailsdata);
          resolve(this.ordersdata);
        },
          err=>{   
            console.log("Error occurred while retrieving order details:" + err);
            resolve(new Error(err || " - Service Error"));  
        });
    });    //  API CALL END 
 
  }
 

}
