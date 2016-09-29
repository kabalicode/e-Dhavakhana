import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {NotificationService} from '../../providers/data/notifications/notificationservice';

/*
  Generated class for the MymessagesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/mymessages/mymessages.html',
  providers: [NotificationService]
})
export class MymessagesPage {

   
  searching: any = false;
  vwnotifications: any;
  lnotificationscount = -1;
  messagesdate: string;

  constructor(private navCtrl: NavController, private notifyservice:NotificationService) {

  this.searching=true;

  // get detailed drug information
  this.lnotificationscount = -1;
  this.vwnotifications = null;



  this.notifyservice.getStoreNotifications().then((data) => {

      this.vwnotifications = data;
      
      this.notifyservice.data=null;
      this.searching=false;
      
      if (typeof this.vwnotifications!== 'undefined' && this.vwnotifications!== null)
      {
          this.lnotificationscount = 1;
          this.vwnotifications = JSON.parse(this.vwnotifications);

          this.vwnotifications = this.vwnotifications.notifications;

          if (typeof this.vwnotifications[0].rundate!== 'undefined' && this.vwnotifications[0].rundate!== null)
          this.messagesdate = this.vwnotifications[0].rundate;

    
          console.log(this.messagesdate);  
      }

      
      
    });


  }


   

}
