import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {InvoiceService} from '../../providers/data/invoice/invoiceservice';
import {InventoryService} from '../../providers/data/inventory/inventoryservice';
import {DatePicker} from 'ionic-native';

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

  constructor(private viewCtrl: ViewController,
              private modalCtrl: ModalController,
              private invoiceService:InvoiceService, private formBuilder: FormBuilder) {
    this.selectedsupplierid = undefined;
    this.selectedsuppliername = "";

    this.invoiceItems = [];
  }

  ionViewLoaded() {
    this.invoice = this.formBuilder.group({
      date: ['', Validators.required],
      taxinvoiceno: ['', Validators.required],
      transactionType: ['credit', Validators.required]
    });
  }

   lookupSupplier(){
     console.log("into method");
     if(this.queryText.trim().length >2){
      this.searching = true;
      this.invoiceService.getSuppliers(this.queryText).then((data) => {
          this.suggestions = data;
          console.log("results: " + this.suggestions);
          this.searching = false;
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

   openDatePicker(){
    DatePicker.show({
        date: new Date(),
        mode: 'date'
      }).then(
        date => console.log("Got date: ", date),
        err => console.log("Error occurred while getting date:", err)
      );
   }

   createInvoiceItem(){
        let invoiceItemModal = this.modalCtrl.create(InvoiceItemModal);
        invoiceItemModal.present();
        invoiceItemModal.onDidDismiss((data: any) => {
          if (data) {
            console.log("data from popup:" + JSON.stringify(data));
            var noofitems = this.invoiceItems.length;
            console.log("noofitems:" + noofitems);
            data.sno = noofitems + 1;
            this.invoiceItems.push(data);
          }
        });
    }

    editInvoiceItem(i){
        let invoiceItemModal = this.modalCtrl.create(InvoiceItemModal, {invoiceItem: this.invoiceItems[i]});
        invoiceItemModal.present();
        invoiceItemModal.onDidDismiss((data: any) => {
          if (data) {
            console.log("data from popup:" + JSON.stringify(data));
            console.log("index:" + data.sno);
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

    }
}

@Component({
  templateUrl: 'build/pages/invoice-add/invoiceitemmodal.html',
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
    numberonlypattern = '[0-9]*';
    textonlypattern = '[a-zA-z ]*';
    edit:boolean = false;
    invoiceItemParam:any;
    
    constructor(private nav: NavController, 
                private formBuilder: FormBuilder,
                public navParams: NavParams, 
                private invoiceService:InvoiceService,
                private invtService: InventoryService,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController) {
            this.showlist = false;
            if(navParams && navParams.data && navParams.data.invoiceItem){
              this.edit = true;
              console.log("invoiceitem:" + JSON.stringify(navParams.data.invoiceItem));
              this.invoiceItemParam = navParams.data.invoiceItem;
              this.selecteddrugid = navParams.data.invoiceItem.drugid;
              this.selecteddrugname = navParams.data.invoiceItem.drugname;
              this.selecteddrugtype = navParams.data.invoiceItem.drugtype;
          }
    }

    ionViewLoaded() {
    if(this.edit && this.invoiceItemParam){
      this.invoiceItem = this.formBuilder.group({
        sno: [this.invoiceItemParam.sno],
        batchno: [this.invoiceItemParam.batchno, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')])],
        expirydate: [this.invoiceItemParam.expirydate, Validators.compose([Validators.required, Validators.pattern('[0-9/]*')])],
        qty: [this.invoiceItemParam.qty, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
        packsize: [this.invoiceItemParam.packsize, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
        totalprice: [this.invoiceItemParam.totalprice],
        unitprice: [this.invoiceItemParam.unitprice],
        discount: [this.invoiceItemParam.discount, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
        vat: [this.invoiceItemParam.vat, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
        mrp: [this.invoiceItemParam.mrp, Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
        mfg: [this.invoiceItemParam.mfg, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])]
      });
    }else{
      this.invoiceItem = this.formBuilder.group({
          batchno: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')])],
          expirydate: ['', Validators.compose([Validators.required, Validators.pattern('[0-9/]*')])],
          qty: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
          packsize: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
          totalprice: ['0.0'],
          unitprice: ['0.0'],
          discount: ['', Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
          vat: ['', Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
          mrp: ['', Validators.compose([Validators.required, Validators.pattern('[0-9.]*')])],
          mfg: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])]
        });
    }
    }

    calculateUnitPrice(){
      if(!this.invoiceItem.controls['packsize'].hasError() && 
          !this.invoiceItem.controls['mrp'].hasError()){
            var packsize = this.invoiceItem.controls['packsize'].value;
            var mrp = this.invoiceItem.controls['mrp'].value;
            console.log("packsize:" + packsize);
            console.log("mrp:" + mrp);
            if(packsize>0 && mrp>0){
              var unitprice = mrp/packsize;
              console.log("unitprice:"+ unitprice);
              this.invoiceItem.controls['unitprice'].updateValue(unitprice);
            }
          }
      this.calculateTotalPrice();    
    }

    calculateTotalPrice(){
      if(!this.invoiceItem.controls['mrp'].hasError() && 
          !this.invoiceItem.controls['discount'].hasError() && 
          !this.invoiceItem.controls['vat'].hasError() &&
          !this.invoiceItem.controls['qty'].hasError() ){
            var discount = this.invoiceItem.controls['discount'].value;
            var mrp = this.invoiceItem.controls['mrp'].value;
            var vat = this.invoiceItem.controls['vat'].value;
            var qty = this.invoiceItem.controls['qty'].value;
            console.log("discount:" + discount);
            console.log("mrp:" + mrp);
            console.log("vat:" + vat);
            console.log("qty:" + qty);
            if(discount>0 && mrp>0 && vat>0 && qty>0){
              var totalprice = mrp - ((mrp*discount)/100);
              totalprice = totalprice*qty;
              console.log("totalprice:"+ totalprice);
              this.invoiceItem.controls['totalprice'].updateValue(totalprice);
            }
          }
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    lookupDrug(){
     console.log("into lookup drug method");
     if(this.queryText.length >0){
      this.invtService.searchInventory(this.queryText).then((data) => {
          this.drugs = data;
          console.log("results: " + this.drugs);
          this.showlist = true;
          console.log("showlist flag:" + this.showlist);
      });
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
     this.showlist = false;
     this.drugs = undefined;
   }

   clearDrug(){
     this.selecteddrugid = undefined;
     this.selecteddrugname = "";
     this.queryText = "";
   }

   addInvoiceItem(){
     this.calculateUnitPrice();
     if(this.edit){
        this.saveInvoiceItem();
     }else {
        console.log("invoice item:" + JSON.stringify(this.invoiceItem.value));
        var data = this.invoiceItem.value;
        data.drugname = this.selecteddrugname;
        data.drugid = this.selecteddrugid;
        data.drugtype = this.selecteddrugtype;
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
     console.log("before submitting the item:" + JSON.stringify(data));
     this.viewCtrl.dismiss(data);
   }

}