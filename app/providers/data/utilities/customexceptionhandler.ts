import {ExceptionHandler, provide} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

export interface IExceptionHandler {
    call(exception: any, stackTrace?: any, reason?: string): void;
}

export class MyCustomExceptionHandler implements IExceptionHandler {

    storage: Storage; 
    public globalerrors : Array<Object>;
    constructor() {
        this.storage = new Storage(SqlStorage);
        this.storage.query("CREATE TABLE IF NOT EXISTS EXCEPTION_LOG (message TEXT, stacktrace TEXT, reason TEXT, loggedtime DATETIME DEFAULT CURRENT_TIMESTAMP )")
        .then(res => 
        console.log("Table EXCEPTION_LOG Created")
        //this.clearAllErrors()
        )
        .catch(error=> 
        console.log("Error occurred during EXCEPTION_LOG table creation in local storage:" + error.err.message)
        );
    }

    clearAllErrors(){

      this.storage.query("DELETE  FROM  EXCEPTION_LOG")
        .then(res => {
          console.log("exception log cleared.")
        })
        .catch(error=> {
          console.log("Error occurred while deleting errors:" + error);
          console.log("error:" + error.err.message);
          error = new Error(error.err.message || 'Server error');
          return error;
        });

    }

    call(exception: any, stackTrace: any, reason: string): void {
        let msg = ExceptionHandler.exceptionToString(exception);
        console.log(msg);
        console.log('Message:---->N ' + exception.message);
        console.log('Stack trace:----->N ' + stackTrace);
        this.storage.query("INSERT INTO EXCEPTION_LOG (message, stacktrace, reason) VALUES (?,?,?)", [msg, exception.message, stackTrace]);
    }

getErrors(){
    return  this.storage.query("SELECT message, stacktrace, reason,loggedtime FROM EXCEPTION_LOG")
        .then(res => {
          //console.log("get all errors:" + res);
          return res;
        })
        .catch(error=> {
          console.log("Error occurred while retrieving errors:" + error);
          console.log("error:" + error.err.message);
          error = new Error(error.err.message || 'Server error');
          return error;
        });
    }


    public getLocalErrors() 
    {
      
        this.getErrors().then((res) => {
            this.globalerrors = [];
        
            let responseobject : any;
            responseobject = res;
            
            if (typeof responseobject!== 'undefined' && responseobject!== null)
            {
                responseobject = responseobject.res;
                //console.log(responseobject.rows.length);
                if (responseobject.rows.length >0)
                {
                        for(var i = 0; i < responseobject.rows.length; i++) {
                            this.globalerrors.push({message: responseobject.rows.item(i).message, 
                                stacktrace: responseobject.rows.item(i).stacktrace,
                                reason: responseobject.rows.item(i).reason,
                                loggedtime: responseobject.rows.item(i).loggedtime});
                    }

                }
                //console.log("globalerrors");
                //console.log(this.globalerrors);
                return (this.globalerrors);
            }

            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
                error = new Error(error.err.message || 'Server error');
                return error;
            
            });

            return this.globalerrors;

    }
}