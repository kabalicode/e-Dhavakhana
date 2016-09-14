import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class DrugsService {
 
  data: any;
 
  constructor(private http: Http) {
    this.data = null;
  }
 
  getDrugs(searchParam: string){
// console.log("Drugs here..")
    if (this.data) {
      //console.log("inside if");
      return Promise.resolve(this.data);
    }
 
    // Stub data during unit testing

   this.data = [{"drugtype":"TABLET","drugname":"LOCAL NORFLOX (400 MG)","drugid":1466443590698},{"drugtype":"DROPS","drugname":"TEST drug (10 ml)","drugid":1465352989818},{"drugtype":"TABLET","drugname":"ANACIN (400 MG)","drugid":1465038162264},{"drugtype":"SYRUP","drugname":"COREX(100 ML)","drugid":1465038161607},{"drugtype":"DROPS","drugname":"TEST drug (10 ml)","drugid":1465352921358},{"drugtype":"DROPS","drugname":"GIRI (400 MG)","drugid":1465443397713},{"drugtype":"DROPS","drugname":"PRANU (400 MG)","drugid":1465443925976},{"drugtype":"TABLET","drugname":"CITRIZINE (10 MG)","drugid":1465038427520},{"drugtype":"SUSPENSION","drugname":"CALPOL PLUS (60 ML)","drugid":1465038427492},{"drugtype":"TABLET","drugname":"CROCIN(100 MG)","drugid":1465038162203},{"drugtype":"DROPS","drugname":"TEST drug (10 ml)","drugid":1465351589490},{"drugtype":"DROPS","drugname":"GIRI POST (400 MG)","drugid":1465443517896},{"drugtype":"SYRUP","drugname":"COREX (100 ML)","drugid":1465038427495}];
    return Promise.resolve(this.data); 

     
 // Actual API CALL to AWS.....UNCOMMENT ONCE THE FUNCTIONALITY IS WORKING
 // API CALL START
/*
 return new Promise(resolve => {
    var url = "";
    url = `https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs?drugname=${searchParam}`;
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
