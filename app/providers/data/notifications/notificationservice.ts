import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {SafeHttp} from '../utilities/safehttp';
 
@Injectable()
export class NotificationService {
 
  data: any;
 
  constructor(private http: SafeHttp) {
    this.data = null;
    
  }

   getStoreNotifications() {


    var notificationdata = "{\"notifications\":[{\"messagetype\":\"warning\",\"drugname\":\"NORFLOX (400 MG)\",\"drugtype\":\"TABLET\",\"subject\":\"expiry\",\"rundate\":\"28-9-2016\",\"message\":\"Batch no: ABC1234 is expiring within 30 days and the expiry date is : 2016-10-18T01:59:24.678Z..For more information, please refer to invoiceno : 1465038167678,1465038167691, supplier : RAMA MEDICALS\"},{\"messagetype\":\"information\",\"drugname\":\"COREX(10ML)\",\"drugtype\":\"SYRUP\",\"subject\":\"inventory\",\"rundate\":\"28-9-2016\",\"message\":\"Inventory levels are too low.Please reorder with preferred supplier.\"},{\"messagetype\":\"warning\",\"drugname\":\"NORFLOX (400 MG)\",\"drugtype\":\"TABLET\",\"subject\":\"expiry\",\"rundate\":\"28-9-2016\",\"message\":\"Batch no: BATCH20062016 has expired and the expiry date is : 2016-05-15T01:59:24.678Z. .For more information, please refer to invoiceno : 1465038167654:1465038167678, supplier name : VAIBHAV MEDICALS\"},{\"messagetype\":\"warning\",\"drugname\":\"CROCIN(100MG)\",\"drugtype\":\"TABLET\",\"subject\":\"expiry\",\"rundate\":\"28-9-2016\",\"message\":\"Batch no: BATCHX111 has expired and the expiry date is : 2016-09-28T01:59:24.678Z. .For more information, please refer to invoiceno : 1465038167654, supplier name : VAIBHAV MEDICALS\"}]}";

    return Promise.resolve(notificationdata); 


    // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START
/*
 return new Promise(resolve => {
    var url = "";
    url = 'https://l575uc2sbl.execute-api.us-west-2.amazonaws.com/storenotifications/';
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