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

export const appUpdateVersion = createAction(
  '[Core] App Update Version'
);
