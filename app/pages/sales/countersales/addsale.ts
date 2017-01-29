import { Component, Pipe } from '@angular/core';
import { DateFormat } from '../../../filters/dateformatter';
import { ViewController, ToastController, ModalController, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {InvoiceService} from '../../../providers/data/invoice/invoiceservice';

import {InventoryService} from '../../../providers/data/inventory/inventoryservice';
import {SaleService} from '../../../providers/data/sales/saleservice';


import {LocalDrugInventory} from '../../../providers/data/local/inventoryservice';
import {LocalSupplierMaster} from '../../../providers/data/local/supplierservice';
import {DatePicker} from 'ionic-native';
import {DrugsFilterPipe} from '../../../filters/drugs-filter';
//import {Invoice} from '../../../models/invoice';
import {Sale} from '../../../models/sale';

/*
  Generated class for the InvoiceAddPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/sales/countersales/addsale.html',
  providers: [InvoiceService,SaleService]
})
export class CounterSaleAddPage {

  invoice:any; 
  sale:any;
  suppliers:any;
  suggestions:any;
  showlist:boolean = false;
  searching:boolean = false;
  queryText:string = "";
  selectedsupplierid:any;
  selectedsuppliername:any;
  //invoiceItems: any;
  saleItems: any;
  //invoiceObj = new Invoice();
  saleObj = new Sale();
  datePipe = new DateFormat();
  searchkey:string;

  constructor(private viewCtrl: ViewController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private loadCtrl: LoadingController,
              private navCtrl: NavController,
              private toastCtrl: ToastController,
              private localSupplierMaster: LocalSupplierMaster,
              private saleService: SaleService, private formBuilder: FormBuilder) {
    this.selectedsupplierid = undefined;
    this.selectedsuppliername = "";

    this.saleItems = [];
  }

  ionViewLoaded() {
    this.sale = this.formBuilder.group({
      date: ['', Validators.compose([Validators.required])],
      //taxinvoiceno: ['', Validators.compose([Validators.required,
      //Validators.maxLength(10)])],
      //transactionType: ['CREDIT', Validators.required]
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
        date => {console.log("Got date: ", date); this.sale.controls["date"].updateValue(this.datePipe.transform(date,["dd/MM/yyyy"]))},
        err => console.log("Error occurred while getting date:", err)
      );
   }

   createSaleItem(){
        let saleItemModal = this.modalCtrl.create(SaleItemModal);
        saleItemModal.present();
        saleItemModal.onDidDismiss((data: any) => {
          if (data) {
            console.log("expirydate:" + data.expirydate);
            //let splitArr = data.expirydate.split("/");
            //var dt = new Date(splitArr[1], splitArr[0]-1,1);
            //console.log("date object:" + dt);
            //data.expirydate = this.datePipe.transform(dt, ['yyyy-MM-dd']);
            //console.log("transformed expirydate:" + data.expirydate);
            //console.log("data from popup:" + JSON.stringify(data));
            var noofitems = this.saleItems.length;
            console.log("noofitems:" + noofitems);
            data.sno = noofitems + 1;
            
            data.saleqty = parseInt(data.saleqty);
            data.saleprice = parseFloat(data.saleprice);
            //data.vat = parseFloat(data.vat);
            //data.discount = parseFloat(data.discount);
            data.salevalue = parseFloat(data.salevalue);

            this.saleItems.push(data);
            console.log("this sale items.");
            console.log(this.saleItems);
          }
        });
    }

    editSaleItem(i){
        let saleModal = this.modalCtrl.create(SaleItemModal, {saleItem: this.saleItems[i]});
        console.log("edit sale item");
        saleModal.present();
        saleModal.onDidDismiss((data: any) => {
          if (data) {
            console.log("expirydate:" + data.expirydate);
            let splitArr = data.expirydate.split("/");
            var dt = new Date(splitArr[1], splitArr[0]-1,1);
            console.log("date object:" + dt);
            data.expirydate = this.datePipe.transform(dt, ['yyyy-MM-dd']);
            console.log("transformed expirydate:" + data.expirydate);
            console.log("data from popup:" + JSON.stringify(data));
            console.log("index:" + data.sno);

            data.saleqty = parseInt(data.saleqty);
            data.saleprice = parseFloat(data.saleprice);
            data.vat = parseFloat(data.vat);
            data.discount = parseFloat(data.discount);
            data.total_price = parseFloat(data.total_price);
            
            this.saleItems[data.sno-1] = data;
          }
        });
    }

    deleteInvoiceItem(invoiceitem:any){
      let index:number;
      this.saleItems.filter(function(item, i) {
        if (item['id'] === invoiceitem.id) {
                console.log("name:" + item['drugname'] + i);
                index = i;
                return;
            };
      });
      console.log("index to be deleted:" + index);
      this.saleItems.splice(index,1);
    }

    addSales(){
       if(this.saleItems.length == 0){
            let alert = this.alertCtrl.create({
              title: "Error",
              message: "Please add atleast one sale item, before posting." ,
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

      this.prepareSaleObj();

      let loading = this.loadCtrl.create({
            content: 'Please Wait while your sales are being posted to cloud...'
       });
       loading.present();
       this.saleService.manageSale(this.saleObj).then((data:any) => {
         console.log("result:" +  JSON.stringify(data));

          let responseobject : any;
          responseobject = data;

         if(responseobject!=null && responseobject.name == "Error"){
            console.log("Error:" + data.message);

            loading.onDidDismiss(() => {
                this.showToast("Error occurred while synchronzing the sale transaction to cloud:" + data.message, "middle");
            });

            loading.dismiss();
            return;
          } 

           loading.onDidDismiss(() => 
          {
               if (typeof responseobject!== 'undefined' && responseobject!== null)
              {
                 if (responseobject.status==200)
                  {
                    let sjsonresponse = responseobject._body;
                    responseobject = JSON.parse(sjsonresponse);

                    if (responseobject.response == "SUCESS")
                    {
                      let alert = this.alertCtrl.create({
                      title: "Success",
                      message: "Sale created successfully." ,
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
                    this.saleItems = [];
                    this.sale.controls['date'].updateValue(" ");
                    this.sale.controls['date'].setErrors(null);
                    }

                  }
              }
           });

          loading.dismiss();
/*
         loading.dismiss();
         if(data.response == "SUCESS"){
           let alert = this.alertCtrl.create({
              title: "Success",
              message: "Sale created successfully." ,
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
            this.saleItems = [];
            this.sale.controls['date'].updateValue(" ");
            //this.sale.controls['taxinvoiceno'].updateValue(" ");
            this.sale.controls['date'].setErrors(null);
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
         }*/
       });


     
    }

    showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    }

    prepareSaleObj(){
      var totalsalevalue = 0.0;
      for(var i = 0; i < this.saleItems.length; i++) {
          totalsalevalue = totalsalevalue + parseFloat(this.saleItems[i].salevalue);
          delete this.saleItems[i]['sno']; // remove sno attribute before submitting
      }
      let dateSplitArr = this.sale.controls['date'].value.split("/");
      let saledt = new Date(dateSplitArr[2], dateSplitArr[1] - 1, dateSplitArr[0]);
      this.saleObj.saledate = this.datePipe.transform(saledt,['yyyy-MM-dd']);
      this.saleObj.total_sale_value = totalsalevalue;
      this.saleObj.saleitems = this.saleItems;

      this.saleObj.customername = "COUNTER SALE";
      this.saleObj.customerid = "CS01";
      this.saleObj.billrefno = "NAN";
      this.saleObj.doctorname = "NAN";
      this.saleObj.transactiontype = "CASH"
      console.log(JSON.stringify(this.saleObj));
      //console.log(this.saleObj);
    }


  /*  prepareInvoiceObj(){
      var invoicevalue = 0.0;
      for(var i = 0; i < this.saleItems.length; i++) {
          invoicevalue = invoicevalue + parseFloat(this.saleItems[i].total_price);
          delete this.saleItems[i]['sno']; // remove sno attribute before submitting
      }
      let dateSplitArr = this.sale.controls['date'].value.split("/");
      let invoicedt = new Date(dateSplitArr[2], dateSplitArr[1] - 1, dateSplitArr[0]);
      this.invoiceObj.invoicedate = this.datePipe.transform(invoicedt,['yyyy-MM-dd']);
      this.invoiceObj.taxinvoiceno = this.sale.controls['taxinvoiceno'].value;
      this.invoiceObj.transaction_type = this.sale.controls['transactionType'].value;
      this.invoiceObj.supplierid = this.selectedsupplierid;
      this.invoiceObj.suppliername = this.selectedsuppliername;
      this.invoiceObj.total_invoice_value = invoicevalue;
      this.invoiceObj.invoiceitems = this.saleItems;
      
    }*/
}

@Component({
  templateUrl: 'build/pages/sales/countersales/saleitemmodal.html',
  pipes: [DrugsFilterPipe],
  providers: [InvoiceService,InventoryService]
})

export class SaleItemModal {

    saleItem:any;
    
    queryText:any;
    queryBatchNo: any;

    drugs:any;
    batches: any;

    vwbatches =[];
    lbatchcount: number;
    lsuppliercount : number;

    showlist:boolean;
    showbatchlist: boolean;
    
    qtysold: number;
    soldprice:number;
    salecost: number;
    
    selectedbatchno = undefined;
    selectedbatchqty=0;
    selectedexpirydate = undefined;
    selectedunitprice = undefined;
    //selectedavailqty = undefined;

    selecteddrugid = undefined;
    selecteddrugname = undefined;
    selecteddrugtype = undefined;
    selecteddrugmfgcode = undefined;
    numberonlypattern = '[0-9]*';
    textonlypattern = '[a-zA-z ]*';
    edit:boolean = false;
    saleItemParam:any;
    year:number;
    datePipe = new DateFormat();
    zerovalue = 0;

    searchkey:string;
    searchbatchkey: string;
    
    constructor(private nav: NavController, 
                private formBuilder: FormBuilder,
                public navParams: NavParams, 
                //private invoiceService:InvoiceService,
                private invtService: InventoryService,
                private localDrugInventory: LocalDrugInventory,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController) {
            var d = new Date();
            this.year = d.getFullYear();

            console.log("salemodal");
            console.log(navParams.data);
            console.log(navParams.data.saleItem);
                  
            this.showlist = false;
            if(navParams && navParams.data && navParams.data.saleItem){
              this.edit = true;
           
              console.log("saleitem:" + JSON.stringify(navParams.data.saleItem));
              this.saleItemParam = navParams.data.saleItem;
              this.selecteddrugid = navParams.data.saleItem.drugid;
              this.selecteddrugname = navParams.data.saleItem.drugname;
              this.selecteddrugtype = navParams.data.saleItem.drugtype;
              this.selecteddrugmfgcode = navParams.data.saleItem.drugmfgcode;
              this.saleItemParam.expirydate = this.datePipe.transform(navParams.data.saleItem.expirydate, ['MM/yyyy']);
              this.selectedexpirydate = this.saleItemParam.expirydate;
              this.selectedbatchno=navParams.data.saleItem.batchno;
              this.selectedbatchqty = navParams.data.saleItem.availableqty;
              this.selectedunitprice = navParams.data.saleItem.mrp;
              this.qtysold = this.saleItemParam.saleqty;
              this.soldprice = this.saleItemParam.saleprice;
          } 
    }

    ionViewLoaded() {
    if(this.edit && this.saleItemParam){
      this.saleItem = this.formBuilder.group({
        sno: [this.saleItemParam.sno],
        saleqty: [this.saleItemParam.saleqty, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
        saleprice: [this.saleItemParam.saleprice, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
      });
    }else{
      this.saleItem = this.formBuilder.group({
         saleqty: [ '', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
          saleprice: ['', Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
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
      if (obj.drugname.toUpperCase().indexOf(this.searchkey.toUpperCase()) > -1) {
        return true;
      } else {
        return false;
      }
    }

    checkbatches(obj){
    console.log("search key in checkmatches:" + this.searchbatchkey);
    console.log(obj);
    console.log(obj.batchno.toUpperCase());
    console.log(this.searchbatchkey.toUpperCase());
    console.log(obj.batchno.toUpperCase().indexOf(this.searchbatchkey.toUpperCase()));
      if (obj.batchno.toUpperCase().indexOf(this.searchbatchkey.toUpperCase()) > -1) {
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

   lookupBatch(){
     console.log("into lookup batch method");
    if(this.queryBatchNo.trim().length >0){
      var params = {searchbatchkey:this.queryBatchNo.trim()}; 
      this.batches = this.vwbatches.filter(this.checkbatches, params);
      console.log(this.batches);
      console.log(this.batches.length);
      this.showbatchlist = (this.batches.length >0);
      console.log(this.showbatchlist);
     }else{ // clear the suggestions
       this.showbatchlist = false;
       this.batches = undefined;
       this.selectedbatchno = undefined;
     }


   }

   selectbatch(batch){
     console.log("selected bacth method!!")
     this.selectedbatchno = batch.batchno;
     this.selectedexpirydate = batch.expirydate;
     this.selectedunitprice=batch.unitprice;
     this.selectedbatchqty = batch.availablebatchqty;
     console.log("selected batch qty" + this.selectedbatchqty);
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

     // let's get the batch details
      this.invtService.getDrugDetails(this.selecteddrugid).then((data) => {
            
            console.log("data..");
            console.log(data);

             
                this.batches = data;
        
                if ((typeof this.batches !== 'undefined') || (this.batches !== null))
                  {
                      this.lsuppliercount = this.batches.suppliers.length;

                      for (var index=0; index<this.lsuppliercount; index++)
                      {
                        
                        for (var iloop=0; iloop<this.batches.suppliers[index].batches.length;iloop++)
                          this.vwbatches.push(this.batches.suppliers[index].batches[iloop]);
                      }
                  }
                  console.log(this.vwbatches);  
                this.batches = null;  
                this.invtService.drugdetailsdata=null;

        console.log("new inventory details page");
      }); //get drug details loop

   }

   clearDrug(){
     this.selecteddrugid = undefined;
     this.selecteddrugname = "";
     this.queryText = "";
     this.selecteddrugmfgcode = "";
     this.clearBatch();
     this.vwbatches = [];
   }

  clearBatch(){
     this.selectedbatchno = undefined;
     this.selectedexpirydate = "";
     this.queryBatchNo = "";
     this.selectedunitprice = "";
     this.batches = undefined;
     this.showbatchlist = false;
     this.qtysold=null;
     this.soldprice=null;
   }

   addSaleItem(){
     //this.calculateUnitPrice();
    this.saveSaleItem();

    /* if(this.edit){
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
        data.unitprice = this.invoiceItem.controls['total_price'].value/this.invoiceItem.controls['saleqty'].value;
        console.log("before submitting the item:" + JSON.stringify(data));
        this.viewCtrl.dismiss(data);
     }*/
   }

   saveSaleItem(){
     
    console.log("invoice item:" + JSON.stringify(this.saleItem.value));
    var data = this.saleItem.value;
    console.log(data);
    data.drugname = this.selecteddrugname;
    data.mfg=  this.selecteddrugmfgcode
    data.drugid = this.selecteddrugid;
    data.drugtype = this.selecteddrugtype;
    data.batchno = this.selectedbatchno;
    data.expirydate = this.selectedexpirydate
    data.salevalue = data.saleqty *  data.saleprice ;
    data.availableqty = this.selectedbatchqty
    data.mrp = this.selectedunitprice;
     console.log("before submitting the item:" + JSON.stringify(data));
     this.viewCtrl.dismiss(data);
   }

}