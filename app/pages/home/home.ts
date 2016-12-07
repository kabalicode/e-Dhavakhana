import {Component} from '@angular/core';
import {NavController, MenuController} from 'ionic-angular';
import {UserProfile} from "../../providers/data/utilities/UserProfile";

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private navCtrl: NavController, 
              private menuCtrl: MenuController,
              private userprofile: UserProfile) {
    //Enable menu on successful login
    this.menuCtrl.enable(true);
    
  }

}
