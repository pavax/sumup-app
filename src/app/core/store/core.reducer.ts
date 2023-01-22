import {createReducer, on} from "@ngrx/store";
import * as CoreActions from "./core.actions";

export interface CoreState {
  hasNetworkConnectivity: boolean;
}

export const initialState: CoreState = {
  hasNetworkConnectivity: true
};
export const reducer = createReducer(initialState,
  on(CoreActions.appOffline, (state) => ({
    ...state,
    hasNetworkConnectivity: false
  })),
  on(CoreActions.appOnline, (state) => ({
    ...state,
    hasNetworkConnectivity: true
  })),
);
