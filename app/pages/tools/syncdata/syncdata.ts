import {Component} from "@angular/core";
import {Page,LoadingController,ToastController , AlertController} from 'ionic-angular';
//import {ViewController} from 'ionic-angular';

// providers
import {SynchAWSDataToLocal} from '../../../providers/data/tools/syncawsdata';

@Component({
  templateUrl: 'build/pages/tools/syncdata/syncdata.html',
  providers: [SynchAWSDataToLocal]
})
export class SyncDataPage {
 
  


  constructor(public loadingCtrl:LoadingController,
              private toastCtrl: ToastController,
              private alertCtrl : AlertController,
              private syncaws_local:SynchAWSDataToLocal)  {

        console.log("Constructor Method !!");
    }    


syncAWSData(){

  let alert = this.alertCtrl.create({
    title: 'Confirm Download',
    message: 'Depending upon your store data, this may take some time to synchronize with your local device storage. We recommend to perform this operation over Wifi, instead of cellular (3G/4G) Network',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Download',
        handler: () => {
          //console.log('Buy clicked');
            console.log("synchronize AWS data to local store.");
                let loading = this.loadingCtrl.create({
                    content: 'Downloading data from internet please wait... : ' 
            });

            loading.present().then((result) => {
              console.log("result"+ result);

              this.syncaws_local.download_drugmaster().then((data) => {
                  console.log(data)    
                  
                  loading.onDidDismiss(() => {
                    if (data == false) 
                      this.showToast("Error occurred while downloading the data, please contact e-dhavakaana support team:" , "middle");
                    

                  });

                  if (data== true)
                  {
                    // now lets sync supplier master
                    this.syncaws_local.download_supplierdata().then((res) => {
                      console.log("inside supplier");
                      console.log(res);
                      loading.onDidDismiss(() => {
                        if (res == false) 
                          this.showToast("Error occurred while downloading the data, please contact e-dhavakaana support team:" , "middle");
                        else{
                              {
                                  let alert = this.alertCtrl.create({
                                      title: 'Download internet data',
                                      subTitle: 'All data associated with your store has been sucessfully synnchronized to your device !',
                                      buttons: ['OK']
                                      });
                                      alert.present();
                              }
                          }
                      });

                     loading.dismiss();

                    });

                  }else{
                    console.log("else" + data);
                    loading.dismiss();
                  }                
                });
            });

        }
      }
    ]
  });
  alert.present();






}

    showToast(message, position) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
    } 

presentConfirm() {
  let alert = this.alertCtrl.create({
    title: 'Confirm purchase',
    message: 'Do you want to buy this book?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Buy',
        handler: () => {
          console.log('Buy clicked');
        }
      }
    ]
  });
  alert.present();
}

}