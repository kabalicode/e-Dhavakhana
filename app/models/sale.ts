export class Sale {
    customername;
    customerid;
    transactiontype;
    billrefno;
    doctorname;
    saledate:string;
    total_sale_value:number;
    saleitems: [{
        batchno:string,
        drugname:string,
        drugtype:string,
        drugid:number,
        mfg:string,
        expirydate:Date,
        saleqty:number,
        sale_price:number,
        salevalue:number,   
    }];
}