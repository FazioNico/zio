/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   11-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-01-2018
 */

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
//# BOF_i18n
import { StarterI18nModule } from "./i18n/starter-i18n.module";
//# EOF_i18n
//# BOF_ngrx
YYYYYYY
//# EOF_ngrx

/**
* Generated class for the Starter page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/
@IonicPage({
  name: 'StarterPage',
  segment: 'starter'
})
@Component({
  selector: 'page-starter',
  templateUrl: 'starter.html',
})
export class Starter implements OnInit{

  constructor(
    public navCtrl: NavController
  ) {}

}
