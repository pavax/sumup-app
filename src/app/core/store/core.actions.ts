import {createAction} from '@ngrx/store';


export const appInit = createAction(
  '[Core] App init'
);


export const appOnline = createAction(
  '[Core] App online'
);

export const appOffline = createAction(
  '[Core] App offline'
);

export const updateSWVersion = createAction(
  '[Core] Update SW Version'
);
