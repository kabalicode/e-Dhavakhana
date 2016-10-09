import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {InvoiceService} from '../../providers/data/invoice/invoiceservice';

/*
  Generated class for the InvoiceAddPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/invoice-add/invoice-add.html',
  providers: [InvoiceService]
})
export class InvoiceAddPage {

  invoice:any; 
  suppliers:any;
  suggestions:any;
  showlist:boolean = false;
  queryText:string = "";
  selectedsupplierid:any;
  selectedsuppliername:any;

  constructor(private viewCtrl: ViewController,private invoiceService:InvoiceService, private formBuilder: FormBuilder) {
    this.selectedsupplierid = undefined;
    this.selectedsuppliername = "";
  }

  ionViewLoaded() {
    this.invoice = this.formBuilder.group({
      supplierid: ['', Validators.required],
      suppliername: ['test'],
      date: ['', Validators.required],
      taxinvoiceno: ['', Validators.required],
      transactionType: ['credit', Validators.required]
    });
  }

  dismiss(){
        this.viewCtrl.dismiss();
    }

   lookupSupplier(){
     console.log("into method");
     if(this.queryText.length >0){
      this.invoiceService.getSuppliers(this.queryText).then((data) => {
          this.suggestions = data;
          console.log("results: " + this.suggestions);
          this.showlist = true;
          console.log("showlist flag:" + this.showlist);
      });
     }else{ // clear the suggestions
       this.showlist = false;
       this.suggestions = undefined;
       this.selectedsupplierid = undefined;
     }
   } 

   select(supplier){
     console.log("selected supplier id:" + supplier.supplierid);
     this.selectedsupplierid = supplier.supplierid;
     this.queryText = supplier.suppliername;
     this.selectedsuppliername = supplier.suppliername;
     this.showlist = false;
     this.suggestions = undefined;
   }

   clearSupplierName(){
     this.selectedsupplierid = undefined;
     this.selectedsuppliername = "";
     this.queryText = "";
   }
}
