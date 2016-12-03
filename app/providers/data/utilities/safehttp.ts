import {Http, Request, Response, RequestOptionsArgs} from '@angular/http'; 
import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

import {CognitoUtil, Callback} from '../../auth/cognito.service';

@Injectable()
export class SafeHttp implements Callback{

  public connection: boolean ;
  public connectionType: string;
  public awsToken: string;

  constructor(private http: Http, private alertCtrl:AlertController,
                private cognitoUtil: CognitoUtil) {
        
  }

  getIdToken(){
    if(this.cognitoUtil.getCurrentUser != null ){
          this.cognitoUtil.getIdToken(this);
        }
  }

  callback(){

  }

  callbackWithParam(result:any){
    console.log("result-------" + result);
    this.awsToken = result;
  }

  showNetworkAlert(){
      let alert = this.alertCtrl.create({
            title: "Network Error",
            message: "Internet Connection lost. Please check your connection",
            buttons: ['OK']
        });
        alert.present();
}

  public request(url: string | Request, options?: RequestOptionsArgs) {
    if (!this.connection) {
      this.showNetworkAlert();
    } else { return this.http.request(url, options) }
  }

  public get(url: string, options?: RequestOptionsArgs) {
      if (!this.connection) {
          this.showNetworkAlert();
        } else { 
          return this.http.get(url, options) 
        }
  }

  public post(url: string, body: string, options?: RequestOptionsArgs) {
    if (!this.connection) {
      this.showNetworkAlert();
    } else { return this.http.post(url, body, options) }
  }

  public put(url: string, body: string, options?: RequestOptionsArgs) {
    if (!this.connection) {
      this.showNetworkAlert();
    } else { return this.http.put(url, body, options) }
  }

  public delete(url: string, options?: RequestOptionsArgs) {
    if (!this.connection) {
      this.showNetworkAlert();
    } else { return this.http.delete(url, options) }
  }

  public patch(url: string, body: string, options?: RequestOptionsArgs) {
    if (!this.connection) {
      this.showNetworkAlert();
    } else { return this.http.patch(url, body, options) }
    
  }

  public head(url: string, options?: RequestOptionsArgs) {
    if (!this.connection) {
      this.showNetworkAlert();
    } else { return this.http.head(url, options) }
  }

}