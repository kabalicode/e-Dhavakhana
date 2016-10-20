import {Component} from "@angular/core";
import {NavController, ViewController, NavParams, AlertController,ModalController,LoadingController} from 'ionic-angular';
import {InvoiceService} from '../../providers/data/invoice/invoiceservice';
import {SQLite, Toast} from "ionic-native";

@Component({
  templateUrl: 'build/pages/invoice/invoicedetails.html',
  providers: [InvoiceService]
})
export class InvoiceDetailsPage {

    invoicedata:any;
    public vwsupplierid:string;
    public vwsuppliername:string;
    public period:any;
    public hidefilter:boolean;

    constructor(private nav: NavController, 
                public modalCtrl: ModalController,
                public navParams: NavParams, 
                private invoiceService:InvoiceService,
                public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
            var supplierId = navParams.data.id;
            this.vwsuppliername = navParams.data.name
            console.log("supplierid selected: " + supplierId);
            console.log("supplier name:" + this.vwsuppliername);
            this.vwsupplierid = supplierId;

            this.hidefilter = true;

            //retrieve the invoices for a suppliers if any
              this.invoiceService.getSupplierInvoices(supplierId).then((data) => {
                  this.invoicedata = data;
                  console.log("invoice data:" + JSON.stringify(data));
                  this.period = 6;
              });
    }

    togglefilter(){
        if(this.hidefilter)
            this.hidefilter = false;
        else
            this.hidefilter = true;
    }

    openInvoiceDetailsModal(invoiceId){
        let invoicedetailsModal = this.modalCtrl.create(InvoiceDetailsModal, {invoiceno:invoiceId});
        invoicedetailsModal.present();
    }

}

@Component({
  templateUrl: 'build/pages/invoice/invoicedetailsmodal.html',
  providers: [InvoiceService]
})

export class InvoiceDetailsModal {

    invoicedtldata:any;

    constructor(private nav: NavController, 
                public navParams: NavParams, 
                private invoiceService:InvoiceService,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
            var invoiceid = navParams.data.invoiceno;
            console.log("invoice id:" + invoiceid);

            this.invoiceService.getInvoiceDetails(invoiceid).then((data) => {
                  this.invoicedtldata = data;
                  console.log("invoice details:" + JSON.stringify(data));
              });
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

}