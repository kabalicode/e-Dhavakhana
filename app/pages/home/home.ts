import {Component} from '@angular/core';
import {NavController, MenuController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private navCtrl: NavController, private menuCtrl: MenuController) {
    //Enable menu on successful login
    this.menuCtrl.enable(true);
  }
}
