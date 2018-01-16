

 import { MetaReducer, ActionReducerMap } from '@ngrx/store';
 import { storeFreeze } from 'ngrx-store-freeze';

 import * as fromLoading from './loadingReducer';
 import * as fromLoaded from './loadedReducer';
 import * as fromError from './errorReducer';

 import { AppStateI, RecucerStateI } from '../app-stats';

 // Only root reducer state without lazy module state.
 const reducers:RecucerStateI = {
   loading: fromLoading.reducer,
   loaded: fromLoaded.reducer,
   error: fromError.reducer
 };

 export const reducer:ActionReducerMap<AppStateI> = reducers;
 //export const metaReducers: MetaReducer<AppStateI>[] = (__DEV__) ? [storeFreeze]: [];
 export const metaReducers: MetaReducer<AppStateI>[] = [storeFreeze];
