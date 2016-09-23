// drug model based on the structure of aws api at
// https://63hc0yw0n6.execute-api.us-west-2.amazonaws.com/Inventory/drugs/${drugid}
// Import the drug model

export class Drug {
    minqty:number;
    scheduledrug:string;
    availabledrugqty:number;
    drugname:string;
    drugtype:string;
    availableqty:number;
    mfgcode:string;
    rackposition:string;
    drugid:number;
    suppliers:any;
}