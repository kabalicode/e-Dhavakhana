import {Injectable} from '@angular/core';


@Injectable()
export class UserProfile {

  public loggedusername : string
  public storeaccountno : number;
  public storename : string;
  public useremail: string


  constructor() {
   console.log("inside user profile");
  // this.getUserAttributes();  
  }


  // logged user name
  setLoggedUserName(objusername: string){
    this.loggedusername = objusername;
  }

  // store account no
  setStoreAccountNo(objstoreaccountno: number){
    this.storeaccountno = objstoreaccountno;
  }
  
  // store name
  setStoreName(objstorename: string){
    this.storename = objstorename;
  }

  // user email
  setUserEmail(objuseremail: string){
    this.useremail= objuseremail;
  }

}