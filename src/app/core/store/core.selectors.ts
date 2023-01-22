import {createSelector} from '@ngrx/store';
import {AppState} from "../core.module";

export const selectCoreState = (appState: AppState) => {
  return appState.core;
};

export const selectHasNetworkConnectivity = createSelector(
  selectCoreState,
  (state) => state.hasNetworkConnectivity
);

