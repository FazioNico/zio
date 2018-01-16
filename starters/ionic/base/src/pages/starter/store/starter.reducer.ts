

import { StarterActions, TStarterActions } from './starter.actions';

export interface IStarterState extends Boolean{};

export const intitialState:IStarterState = false

export function reducer (
  state:IStarterState | null = intitialState,
  action:TStarterActions
):IStarterState | null {
  switch (action.type) {
    case StarterActions.START:{
      return false
    }
    case StarterActions.START_SUCCESS:{
      return true
    }
    case StarterActions.ERROR:{
      return intitialState
    }

    default: {
      return <IStarterState>state;
    }
  }
};
