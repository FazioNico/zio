

import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';

import { Effect, Actions, toPayload } from "@ngrx/effects";

import * as Err from '../actions/err.actions';
import { AlertService } from "../../providers/alert-service/alert-service";

@Injectable()
export class ErrorEffects {

  constructor(
    private action$: Actions,
    private _alert: AlertService
  ) {
  }

  @Effect() handleErrorAction$ = this.action$
    .ofType(
      Err.ErrorActions.ERROR_SHARED
    )
    .map(toPayload)
    .switchMap(err => Observable.of(new Err.ErrorDisplayAction(err)))


  @Effect() displayErrorAction$ = this.action$
      .ofType(Err.ErrorActions.ERROR_DISPLAY)
      .map(toPayload)
      .switchMap((payload) => this._alert.doDisplayAlert(payload))
      .switchMap((payload)=>
        (payload)
          ? Observable.of(new Err.ErrorDisplaySuccessAction())
          : Observable.of(new Err.ErrorAction())
      )
      .catch(err=> Observable.of(Err.ErrorActions.ERROR_DISPLAY_FAILED))
}
