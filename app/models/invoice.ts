export class Invoice {
    supplierid:number;
    suppliername:string;
    invoiceid:number;
    transaction_type:string;
    invoicedate:string;
    taxinvoiceno:string;
    total_invoice_value:number;
    invoiceitems: [{
        batchno:string,
        drugname:string,
        drugtype:string,
        drugid:number,
        mfgcode:string,
        expirydate:Date,
        purchaseqty:number,
        total_price:number,
        discount:number,
        vat:number,
        mrp:number,
        unitprice:number,   
    }];
}