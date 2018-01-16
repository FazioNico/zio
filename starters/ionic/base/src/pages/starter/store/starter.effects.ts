/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   27-09-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 04-01-2018
 */

 import { Injectable } from "@angular/core";
 import { Observable } from 'rxjs/Observable';

 import { Action } from '@ngrx/store';
 import { Effect, Actions, toPayload } from "@ngrx/effects";

 import * as Starter from './starter.actions';
 import { StarterService } from "../starter.service";

 @Injectable()
 export class StarterEffects {

   constructor(
     private action$: Actions,
     private _auth: StarterService
   ) {
   }

 }
