
 import { NgModule } from '@angular/core';
 import { EffectsModule } from '@ngrx/effects';
 import { StoreModule } from '@ngrx/store';
 import { StoreDevtoolsModule } from '@ngrx/store-devtools';

 import { StarterEffects } from './starter.effects';
 import * as fromStarter from './starter.reducer';
 import { StarterStoreService } from "./starter-store.service";

 // import TaskStoreModule in the TaskModule
 @NgModule({
   imports: [
     StoreModule.forFeature('starter', fromStarter.reducer),
     StoreDevtoolsModule.instrument(),
     EffectsModule.forFeature([StarterEffects])
   ],
   exports: [StoreModule, EffectsModule],
   providers: [StarterStoreService]
 })
 export class StarterStoreModule {}
