import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromCore from "./core.reducer";
import {CoreState} from "./core.reducer";

export const selectCoreState = createFeatureSelector<CoreState>(fromCore.FEATURE_NAME);

export const selectHasNetworkConnectivity = createSelector(
  selectCoreState,
  (state) => state.hasNetworkConnectivity
);
