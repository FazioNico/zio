
import { Action } from "@ngrx/store";

import { ILoadingState } from '../store/reducers/loadingReducer';
import { ILoadedState } from '../store/reducers/loadedReducer';
import { IErrorState } from '../store/reducers/errorReducer';

export interface AppStateI {
  loading: ILoadingState,
  loaded: ILoadedState,
  error: IErrorState | null
};

export interface RecucerStateI {
  loading: (state: ILoadingState, action: Action) => ILoadingState,
  loaded: (state: ILoadedState, action: Action) => ILoadedState,
  error: (state: IErrorState, action: Action) => IErrorState|null,
};
