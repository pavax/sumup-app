import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BehaviorSubject, fromEvent, merge, timer } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as CoreActions from './core.actions';
import { MatDialog } from '@angular/material/dialog';
import { OfflineDialogComponent } from '../components/dialog/offline.dialog.component';
import { SwUpdate } from '@angular/service-worker';
import { UpdateDialogComponent } from '../components/dialog/update.dialog.component';
import { environment } from '../../../environments/environment';

@Injectable()
export class CoreEffects {
  checkConnectivity$ = createEffect(() => {
    return merge(
      new BehaviorSubject(navigator.onLine),
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true))
    ).pipe(
      map(state => (state ? CoreActions.appOnline() : CoreActions.appOffline()))
    );
  });

  allTransactionsLoaded$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CoreActions.appOffline),
        map(isOffline => {
          if (isOffline) {
            this.dialog.open(OfflineDialogComponent);
          }
        })
      );
    },
    { dispatch: false }
  );

  checkForSWUpdates$ = createEffect(
    () => {
      return timer(1000, 1000 * 60 * 60).pipe(
        filter(() => environment.production),
        map(() =>
          this.updates
            .checkForUpdate()
            .then(() => console.log('checking for updates'))
        )
      );
    },
    { dispatch: false }
  );

  updateSWVersion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CoreActions.updateSWVersion),
        map(() =>
          this.updates
            .activateUpdate()
            .then(() => console.log('install update'))
            .then(() => document.location.reload())
        )
      );
    },
    { dispatch: false }
  );

  listenForSWUpdates$ = createEffect(
    () => {
      return this.updates.versionUpdates.pipe(
        filter(state => state.type === 'VERSION_DETECTED'),
        map(() => this.dialog.open(UpdateDialogComponent))
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly updates: SwUpdate
  ) {}
}
