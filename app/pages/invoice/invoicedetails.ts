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
            let loadctrl = loadingCtrl.create(
                {
                    content: "Please wait",
                });
            loadctrl.present();
            //retrieve the invoices for a suppliers if any
            this.invoiceService.getSupplierInvoices(supplierId).then((data) => {
                this.invoicedata = data;
                console.log("invoice data:" + JSON.stringify(data));
                this.period = 6;
                loadctrl.dismiss();
            });
    }

    togglefilter(){
        if(this.hidefilter)
            this.hidefilter = false;
        else
            this.hidefilter = true;
    }

    openInvoiceDetailsModal(invoiceId){
        let loadctrl = this.loadingCtrl.create(
                {
                    content: "Loading ....",
                });
        loadctrl.present();
        
        this.invoiceService.getInvoiceDetails(invoiceId).then((data) => {
                console.log("invoice detailsresult:" + data);
                

                loadctrl.onDidDismiss(() => {
                    let invoicedetailsModal = this.modalCtrl.create(InvoiceDetailsModal, {invoicedtlsdata:data});
                    invoicedetailsModal.present();
                });

                loadctrl.dismiss();
                
              }); 
    }

}

@Component({
  templateUrl: 'build/pages/invoice/invoicedetailsmodal.html'
})

export class InvoiceDetailsModal {

    invoicedtldata:any;

    constructor(
                public navParams: NavParams, 
                public viewCtrl: ViewController) {
            this.invoicedtldata = navParams.data.invoicedtlsdata;
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

}