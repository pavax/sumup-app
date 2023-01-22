import {createSelector} from '@ngrx/store';
import {CoreState} from './core.reducer';

export const selectCoreState = (state: { core: CoreState }) => {
  return state.core;
};

export const selectHasNetworkConnectivity = createSelector(
  selectCoreState,
  (state) => state.hasNetworkConnectivity
);

