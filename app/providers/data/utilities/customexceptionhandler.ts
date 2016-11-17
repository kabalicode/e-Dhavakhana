import {ExceptionHandler, provide} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

export interface IExceptionHandler {
    call(exception: any, stackTrace?: any, reason?: string): void;
}

export class MyCustomExceptionHandler implements IExceptionHandler {

    storage: Storage; 
    constructor() {
        this.storage = new Storage(SqlStorage);
        this.storage.query("CREATE TABLE IF NOT EXISTS EXCEPTION_LOG (message TEXT, stacktrace TEXT, reason TEXT, loggedtime DATETIME DEFAULT CURRENT_TIMESTAMP )")
        .then(res => 
        console.log("Table EXCEPTION_LOG Created")
        )
        .catch(error=> 
        console.log("Error occurred during EXCEPTION_LOG table creation in local storage:" + error.err.message)
        );
    }

    call(exception: any, stackTrace: any, reason: string): void {
        let msg = ExceptionHandler.exceptionToString(exception);
        console.log(msg);
        console.log('Message:---->N ' + exception.message);
        console.log('Stack trace:----->N ' + stackTrace);
        this.storage.query("INSERT INTO EXCEPTION_LOG (message, stacktrace, reason) VALUES (?,?,?)", [msg, exception.message, stackTrace]);
    }
}