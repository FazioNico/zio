
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { StarterStoreModule } from "./store/starter-store.module";
import { StarterI18nModule } from "./i18n/starter-i18n.module";
import { StarterService } from "./starter.service";

import { Starter } from './starter';

@NgModule({
  declarations: [
    Starter,
  ],
  imports: [
    StarterI18nModule,
    StarterStoreModule,
    IonicPageModule.forChild(Starter),
  ],
  providers: [StarterService],
  exports: [Starter]
})
export class StarterModule {}
