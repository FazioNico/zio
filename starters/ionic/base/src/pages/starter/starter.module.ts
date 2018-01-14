/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   11-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 11-01-2018
 */

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Starter } from './starter';

//# BOF_i18n
XXXXXXX
//# EOF_i18n
@NgModule({
  declarations: [
    Starter,
  ],
  imports: [
    IonicPageModule.forChild(Starter),
  ],
  exports: [Starter]
})
export class StarterModule {}
