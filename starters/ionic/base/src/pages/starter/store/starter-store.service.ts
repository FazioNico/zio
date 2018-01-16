/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   30-09-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 13-11-2017
*/

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { StoreService } from '../../../store/store.service';
import { AppStateI } from '../../../store/app-stats';
import * as starter from './starter.actions';
import { IStarterState } from "./starter.reducer";

@Injectable()
export class StarterStoreService extends StoreService {

  protected STATE = 'starter';

  constructor(
    protected store: Store<AppStateI>
  ) { super() }


  dispatchLoadAction(params:{path:string}):void{
    this.dispatchAction(new starter.StartAction());
  }

  // prevent error implementation of unused methodes
  dispatchCreateAction(record: any):void{}
  dispatchUpdateAction(record:any):void{}
  dispatchRemoveAction(id:string|number):void{}

  // Accessor sample of how to select piece of the state
  getCurrentState():Observable<IStarterState> {
    this.STATE = 'starter'
    return this.storeSelectFeatureState()
    .map((state: IStarterState) => state);
  }
}
