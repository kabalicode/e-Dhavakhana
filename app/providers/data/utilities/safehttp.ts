import {Http, Request, Response, RequestOptionsArgs} from '@angular/http'; 
import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

@Injectable()
export class SafeHttp {

  public connection: boolean = true;
  public connectionType: string;

  constructor(private http: Http, private alertCtrl:AlertController) {
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
    } else { return this.http.get(url, options) }
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