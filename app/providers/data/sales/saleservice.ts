import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {SafeHttp} from '../utilities/safehttp';

@Injectable()
export class SaleService {

  data: any;
constructor(private http: SafeHttp) {
    this.data = null;
    
  }

   // function to record sale to AWS
  manageSale(saleitem){
      console.log(saleitem);
      return new Promise(resolve => {
  
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(JSON.stringify(review));
        this.http.post('https://du9ihgsfl7.execute-api.us-west-2.amazonaws.com/storesale/sale', saleitem, {headers: headers})
          .subscribe((data) => {
            console.log(data);
            resolve(data);
            //console.log(data);
          },
           err=>{   
            console.log("Error occurred while recording sale:" + err);
            resolve(new Error(err || " - Service Error"));  
          });
      });

    }


}