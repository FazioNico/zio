
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
//# BOF_ngrx
import { StarterStoreModule } from "./store/starter-store.module";
//# EOF_ngrx
//# BOF_i18n
import { StarterI18nModule } from "./i18n/starter-i18n.module";
//# EOF_i18n
//# BOF_service
import { StarterService } from "./starter.service";
//# EOF_service
import { Starter } from './starter';

@NgModule({
  declarations: [
    Starter,
  ],
  imports: [
    //# BOF_i18n
    StarterI18nModule,
    //# EOF_i18n
    //# BOF_ngrx
    StarterStoreModule,
    //# EOF_ngrx
    IonicPageModule.forChild(Starter),
  ],
  providers: [
    //# BOF_service
    StarterService
    //# EOF_service
  ],
  exports: [Starter]
})
export class StarterModule {}
