import {Component} from "@angular/core";
import {NavController,ToastController, ViewController, NavParams, AlertController,ModalController,LoadingController} from 'ionic-angular';
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
    public invoicesexists : boolean;

    constructor(private nav: NavController, 
                public modalCtrl: ModalController,
                public navParams: NavParams, 
                private invoiceService:InvoiceService,
                private toastCtrl: ToastController,
                public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
            var supplierId = navParams.data.id;
            this.vwsuppliername = navParams.data.name
            console.log("supplierid selected: " + supplierId);
            console.log("supplier name:" + this.vwsuppliername);
            this.vwsupplierid = supplierId;

            this.hidefilter = true;
            this.invoicesexists = true;
            let loadctrl = loadingCtrl.create(
                {
                    content: "Please wait",
                });
            loadctrl.present();
            //retrieve the invoices for a suppliers if any
            this.invoiceService.getSupplierInvoices(supplierId).then((data) => {
                this.invoicedata = data;
                this.period = 6;
                if (typeof this.invoicedata!== 'undefined' && this.invoicedata!== null)
                   {
                       this.invoicesexists = (this.invoicedata.length > 0);
                   }else{
                       this.invoicesexists = false;
                   } 
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
        
        this.invoiceService.getInvoiceDetails(invoiceId).then((data:any) => {

                if(data.name == "Error"){
                    console.log("Error:" + data.message);

                    loadctrl.onDidDismiss(() => {
                        this.showToast("Error occurred while retrieving invoice details:" + data.message, "middle");
                    });

                    loadctrl.dismiss();
                    return;
                }                

                loadctrl.onDidDismiss(() => {
                    let invoicedetailsModal = this.modalCtrl.create(InvoiceDetailsModal, {invoicedtlsdata:data});
                    invoicedetailsModal.present();
                });

                loadctrl.dismiss();
                
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