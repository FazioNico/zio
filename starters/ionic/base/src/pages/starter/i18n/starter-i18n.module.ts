/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   21-10-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 22-10-2017
*/

import { NgModule } from '@angular/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { StarterI18nService } from "./starter-i18n.service";
import { locale as english } from './langues/starter.en';
import { locale as french } from './langues/starter.fr';

@NgModule({
  imports: [
    TranslateModule.forChild()
  ],
  providers: [StarterI18nService],
  exports: [TranslateModule] // do not forguet to export TranslateModule !!
})
export class StarterI18nModule {
  constructor(
    private translationLoader: StarterI18nService
  ){
      this.translationLoader.loadTranslations(english, french);
  }
}
