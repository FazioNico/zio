/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   27-09-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 05-01-2018
*/

import { NgRxAction } from '../../../store/ngrx.actions';
import { IAuthCheckedState } from "./authChecked.reducer";
import { ICurrentUserState } from "./currentUser.reducer";

import { HttpServerResponse } from "../starter.service";

/**
 * PATTERN DESIGN:
 * Simply add special word to your action definition.
 * Exemple:
 * - Using "Requested" to OPEN global application loader (modal spinner)
 * - Using "Success" to CLOSE global application loader (modal spinner)
 */
export const StarterActions = {
  START: '[Starter] Start Requested',
  START_SUCCESS: '[Starter] Start with Success',
  ERROR: '[Auth] Error'
}

export class StartAction extends NgRxAction<any> { type = StarterActions.START; }
export class StartSuccessAction extends NgRxAction<any> { type = StarterActions.START_SUCCESS; }

export class ErrorAction extends NgRxAction<any> { type = StarterActions.ERROR; }

export type TStarterActions =
StartAction | StartSuccessAction |
ErrorAction;
