
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Import ngrx Tools
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Import ngRx Store
import { reducer, metaReducers } from '../store/reducers';
import { ErrorEffects } from '../store/effects/errorEffects';

// Import Providers Service
import { AlertService } from "../providers/alert-service/alert-service";

const providers:Array<any> =  [
    AlertService
];
const effects:Array<any> = [
    ErrorEffects
];

/*
  Bootstrap NgRxStoreModule
  with default root store state & reducer & effects
  => rest of store will be loaded with lazy loading ;-)
*/
@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forRoot(reducer, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([...effects]),
  ],
  providers: [...providers, ...effects]
})
export class NgRxStoreModule {
  // guarantee that only one instance of Services is added to the root module
  // see => https://angular-2-training-book.rangle.io/handout/modules/feature-modules.html
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgRxStoreModule,
      providers: [...providers, ...effects]
    }
  }
}
