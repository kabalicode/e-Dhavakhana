import { Component, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ViewController, ModalController, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {InvoiceService} from '../../providers/data/invoice/invoiceservice';
import {InventoryService} from '../../providers/data/inventory/inventoryservice';
import {LocalDrugInventory} from '../../providers/data/local/inventoryservice';
import {LocalSupplierMaster} from '../../providers/data/local/supplierservice';
import {DatePicker} from 'ionic-native';
import {DrugsFilterPipe} from '../../filters/drugs-filter';
import {Invoice} from '../../models/invoice';

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
  searching:boolean = false;
  queryText:string = "";
  selectedsupplierid:any;
  selectedsuppliername:any;
  invoiceItems: any;
  invoiceObj = new Invoice();
  datePipe = new DatePipe();
  searchkey:string;

  constructor(private viewCtrl: ViewController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private loadCtrl: LoadingController,
              private navCtrl: NavController,
              private localSupplierMaster: LocalSupplierMaster,
              private invoiceService:InvoiceService, private formBuilder: FormBuilder) {
    this.selectedsupplierid = undefined;
    this.selectedsuppliername = "";

    this.invoiceItems = [];
  }

  ionViewLoaded() {
    this.invoice = this.formBuilder.group({
      date: ['', Validators.compose([Validators.required])],
      taxinvoiceno: ['', Validators.compose([Validators.required,
      Validators.maxLength(10)])],
      transactionType: ['CREDIT', Validators.required]
    });
  }

  checkmatches(obj){
    console.log(obj);
    console.log("search key in checkmatches:" + this.searchkey);
      if (obj.suppliername.toUpperCase().indexOf(this.searchkey.toUpperCase()) > -1) {
        return true;
      } else {
        return false;
      }
    }

   lookupSupplier(){
     console.log("into method");
     if(this.queryText.trim().length >0){
      this.searching = true;
      var params = {searchkey:this.queryText.trim()};
      this.suggestions = this.localSupplierMaster.globalsupplierlist.filter(this.checkmatches,params);
      console.log("results: " + this.suggestions);
      this.searching = false;
      this.showlist = true;
      // this.invoiceService.getSuppliers(this.queryText).then((data) => {
      //     this.suggestions = data;
      //     console.log("results: " + this.suggestions);
      //     this.searching = false;
      //     this.showlist = true;
      //     console.log("showlist flag:" + this.showlist);
      // });
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

   openDatePicker(){
    DatePicker.show({
        date: new Date(),
        mode: 'date'
      }).then(
        date => {console.log("Got date: ", date); this.invoice.controls["date"].updateValue(this.datePipe.transform(date,"dd/MM/yyyy"))},
        err => console.log("Error occurred while getting date:", err)
      );
   }

   createInvoiceItem(){
        let invoiceItemModal = this.modalCtrl.create(InvoiceItemModal);
        invoiceItemModal.present();
        invoiceItemModal.onDidDismiss((data: any) => {
          if (data) {
            console.log("expirydate:" + data.expirydate);
            data.expirydate = "01/" + data.expirydate;
            var dt = new Date(data.expirydate);
            console.log("date object:" + dt);
            data.expirydate = this.datePipe.transform(dt, 'yyyy-MM-dd');
            console.log("transformed expirydate:" + data.expirydate);
            console.log("data from popup:" + JSON.stringify(data));
            var noofitems = this.invoiceItems.length;
            console.log("noofitems:" + noofitems);
            data.sno = noofitems + 1;
            
            data.purchaseqty = parseInt(data.purchaseqty);
            data.mrp = parseFloat(data.mrp);
            data.vat = parseFloat(data.vat);
            data.discount = parseFloat(data.discount);
            data.total_price = parseFloat(data.total_price);

            this.invoiceItems.push(data);
          }
        });
    }

    editInvoiceItem(i){
        let invoiceItemModal = this.modalCtrl.create(InvoiceItemModal, {invoiceItem: this.invoiceItems[i]});
        invoiceItemModal.present();
        invoiceItemModal.onDidDismiss((data: any) => {
          if (data) {
            console.log("expirydate:" + data.expirydate);
            data.expirydate = "01/" + data.expirydate;
            var dt = new Date(data.expirydate);
            console.log("date object:" + dt);
            data.expirydate = this.datePipe.transform(dt, 'yyyy-MM-dd');
            console.log("transformed expirydate:" + data.expirydate);
            console.log("data from popup:" + JSON.stringify(data));
            console.log("index:" + data.sno);

            data.purchaseqty = parseInt(data.purchaseqty);
            data.mrp = parseFloat(data.mrp);
            data.vat = parseFloat(data.vat);
            data.discount = parseFloat(data.discount);
            data.total_price = parseFloat(data.total_price);
            
            this.invoiceItems[data.sno-1] = data;
          }
        });
    }

    deleteInvoiceItem(invoiceitem:any){
      let index:number;
      this.invoiceItems.filter(function(item, i) {
        if (item['id'] === invoiceitem.id) {
                console.log("name:" + item['drugname'] + i);
                index = i;
                return;
            };
      });
      console.log("index to be deleted:" + index);
      this.invoiceItems.splice(index,1);
    }

    addInvoice(){
      if(typeof this.selectedsupplierid == 'undefined'){
            let alert = this.alertCtrl.create({
              title: "Error",
              message: "Please select a Supplier" ,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    return;
                  }
                }
              ]
            });
            alert.present();
            return;
       }

       if(this.invoiceItems.length == 0){
            let alert = this.alertCtrl.create({
              title: "Error",
              message: "Please add atleast one invoice items" ,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    return;
                  }
                }
              ]
            });
            alert.present();
            return;
       }

       this.prepareInvoiceObj();
       let loading = this.loadCtrl.create({
            content: 'Please Wait...'
       });
       loading.present();
       this.invoiceService.addInvoice(this.invoiceObj).then((data:any) => {
         console.log("result:" +  JSON.stringify(data));
         loading.dismiss();
         if(data.response == "SUCESS"){
           let alert = this.alertCtrl.create({
              title: "Success",
              message: "Invoice created successfully." ,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    alert.dismiss();
                  }
                }
              ]
            });
            alert.present();
            this.invoiceItems = [];
            this.clearSupplierName();
            this.invoice.controls['date'].updateValue(" ");
            this.invoice.controls['taxinvoiceno'].updateValue(" ");
            this.invoice.controls['date'].setErrors(null);
            this.invoice.controls['taxinvoiceno'].setErrors(null);
         }else{
           let alert = this.alertCtrl.create({
              title: "Error",
              message: "Error occured while creating Invoice.\n Error:" + data.response ,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    alert.dismiss();
                  }
                }
              ]
            });
            alert.present();
         }
       });

    }

    prepareInvoiceObj(){
      var invoicevalue = 0.0;
      for(var i = 0; i < this.invoiceItems.length; i++) {
          invoicevalue = invoicevalue + parseFloat(this.invoiceItems[i].total_price);
          delete this.invoiceItems[i]['sno']; // remove sno attribute before submitting
      }
      let dateSplitArr = this.invoice.controls['date'].value.split("/");
      let invoicedt = new Date(dateSplitArr[2], dateSplitArr[1] - 1, dateSplitArr[0]);
      this.invoiceObj.invoicedate = this.datePipe.transform(invoicedt,'yyyy-MM-dd');
      this.invoiceObj.taxinvoiceno = this.invoice.controls['taxinvoiceno'].value;
      this.invoiceObj.transaction_type = this.invoice.controls['transactionType'].value;
      this.invoiceObj.supplierid = this.selectedsupplierid;
      this.invoiceObj.suppliername = this.selectedsuppliername;
      this.invoiceObj.total_invoice_value = invoicevalue;
      this.invoiceObj.invoiceitems = this.invoiceItems;
      
    }
}

@Component({
  templateUrl: 'build/pages/invoice-add/invoiceitemmodal.html',
  pipes: [DrugsFilterPipe],
  providers: [InvoiceService,InventoryService]
})

export class InvoiceItemModal {

    invoiceItem:any;
    queryText:any;
    drugs:any;
    showlist:boolean;
    selecteddrugid = undefined;
    selecteddrugname = undefined;
    selecteddrugtype = undefined;
    selecteddrugmfgcode = undefined;
    numberonlypattern = '[0-9]*';
    textonlypattern = '[a-zA-z ]*';
    edit:boolean = false;
    invoiceItemParam:any;
    year:number;
    datePipe = new DatePipe();
    zerovalue = 0;
    searchkey:string;
    
    constructor(private nav: NavController, 
                private formBuilder: FormBuilder,
                public navParams: NavParams, 
                private invoiceService:InvoiceService,
                private invtService: InventoryService,
                private localDrugInventory: LocalDrugInventory,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController) {
            var d = new Date();
            this.year = d.getFullYear();
                  
            this.showlist = false;
            if(navParams && navParams.data && navParams.data.invoiceItem){
              this.edit = true;
              console.log("invoiceitem:" + JSON.stringify(navParams.data.invoiceItem));
              this.invoiceItemParam = navParams.data.invoiceItem;
              this.selecteddrugid = navParams.data.invoiceItem.drugid;
              this.selecteddrugname = navParams.data.invoiceItem.drugname;
              this.selecteddrugtype = navParams.data.invoiceItem.drugtype;
              this.selecteddrugmfgcode = navParams.data.invoiceItem.mfgcode;
              this.invoiceItemParam.expirydate = this.datePipe.transform(navParams.data.invoiceItem.expirydate, 'MM/yyyy');
          }
    }

    ionViewLoaded() {
    if(this.edit && this.invoiceItemParam){
      this.invoiceItem = this.formBuilder.group({
        sno: [this.invoiceItemParam.sno],
        batchno: [this.invoiceItemParam.batchno, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')])],
        expirydate: [this.invoiceItemParam.expirydate, Validators.compose([Validators.required, Validators.pattern('(0[1-9]|1[0-2])\/?([0-9]{4})')])],
        purchaseqty: [this.invoiceItemParam.purchaseqty, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
        //packsize: [this.invoiceItemParam.packsize, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
        total_price: [this.invoiceItemParam.total_price, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
        //unitprice: [this.invoiceItemParam.unitprice],
        discount: [this.invoiceItemParam.discount, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
        vat: [this.invoiceItemParam.vat, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
        mrp: [this.invoiceItemParam.mrp, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
        //mfg: [this.invoiceItemParam.mfg, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])]
      });
    }else{
      this.invoiceItem = this.formBuilder.group({
          batchno: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')])],
          expirydate: ['', Validators.compose([Validators.required, Validators.pattern('(0[1-9]|1[0-2])\/?([0-9]{4})')])],
          purchaseqty: [ '', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
          //packsize: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
          total_price: ['',Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
          //unitprice: ['0.0'],
          discount: ['', Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
          vat: ['', Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
          mrp: ['', Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
          //mfg: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])]
        });
    }
    }

    calculateUnitPrice(){
      return;
     }

    calculateTotalPrice(){
      return;
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    checkmatches(obj){
    console.log("search key in checkmatches:" + this.searchkey);
      if (obj.drugname.toUpperCase().indexOf(this.searchkey.toUpperCase()) > -1) {
        return true;
      } else {
        return false;
      }
    }

    lookupDrug(){
     console.log("into lookup drug method");
     if(this.queryText.trim().length >0){
      var params = {searchkey:this.queryText.trim()}; 
      this.drugs = this.localDrugInventory.globaldrugslist.filter(this.checkmatches, params);
      this.showlist = true;
     }else{ // clear the suggestions
       this.showlist = false;
       this.drugs = undefined;
       this.selecteddrugid = undefined;
     }
   } 

   select(drug){
     console.log("selected drug id:" + drug.drugid);
     this.selecteddrugid = drug.drugid;
     this.queryText = drug.drugname;
     this.selecteddrugname = drug.drugname;
     this.selecteddrugtype = drug.drugtype;
     this.selecteddrugmfgcode = drug.mfgcode;
     this.showlist = false;
     this.drugs = undefined;
   }

   clearDrug(){
     this.selecteddrugid = undefined;
     this.selecteddrugname = "";
     this.queryText = "";
     this.selecteddrugmfgcode = "";
   }

   addInvoiceItem(){
     this.calculateUnitPrice();
     if(this.edit){
        this.saveInvoiceItem();
     }else {

       console.log("selected drug:" + this.selecteddrugid);

       if(typeof this.selecteddrugid == 'undefined'){
            let alert = this.alertCtrl.create({
              title: "Error",
              message: "Please select a Drug" ,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    return;
                  }
                }
              ]
            });
            alert.present();
            return;
       }

        console.log("invoice item:" + JSON.stringify(this.invoiceItem.value));
        var data = this.invoiceItem.value;
        data.drugname = this.selecteddrugname;
        data.drugid = this.selecteddrugid;
        data.drugtype = this.selecteddrugtype;
        data.mfgcode = this.selecteddrugmfgcode;
        data.unitprice = this.invoiceItem.controls['total_price'].value/this.invoiceItem.controls['purchaseqty'].value;
        console.log("before submitting the item:" + JSON.stringify(data));
        this.viewCtrl.dismiss(data);
     }
   }

   saveInvoiceItem(){
     console.log("invoice item:" + JSON.stringify(this.invoiceItem.value));
     var data = this.invoiceItem.value;
     data.drugname = this.selecteddrugname;
     data.drugid = this.selecteddrugid;
     data.drugtype = this.selecteddrugtype;
     data.unitprice = this.invoiceItem.controls['total_price'].value/this.invoiceItem.controls['purchaseqty'].value;
     console.log("before submitting the item:" + JSON.stringify(data));
     this.viewCtrl.dismiss(data);
   }

}