
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import { HttpService } from "../../providers/http-service/http.service";
import { EnvVariables } from '../../app/environment/environment.token';
import { IEnvironment } from "../../app/environment/env-model";
import { IStarterState } from "./store/starter.reducer";

/*
Generated class for the AuthService provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/

export interface HttpServerResponse extends Response {
  message?:string,
  code?:number,
  starter:IStarterState
}

@Injectable()
export class StarterService extends HttpService {

  private readonly _starter:string = "/starter"

  constructor(
    public http: HttpClient,
    @Inject(EnvVariables) public readonly envVariables:IEnvironment
  ) {
    super(http,envVariables);
  }


  doCreate(_payload:any):Observable<HttpServerResponse> {
    this.path = this._starter
    return this.post(_payload)
    .catch(err => Observable.of({
      error:err.error.error || err.error || err.error.message || err,
      message:err.message||'error...'
    }))
  }

}
