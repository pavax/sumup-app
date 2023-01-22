import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {BehaviorSubject, fromEvent, merge} from "rxjs";
import {map} from "rxjs/operators";
import * as CoreActions from "./core.actions";
import {MatDialog} from "@angular/material/dialog";
import {OfflineDialogComponent} from "../components/dialog/offline.dialog.component";

@Injectable()
export class CoreEffects {

  checkConnectivity$ = createEffect(() => {
    return merge(
      new BehaviorSubject(navigator.onLine),
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
    ).pipe(map((state) => state ? CoreActions.appOnline() : CoreActions.appOffline()));
  });


  allTransactionsLoaded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoreActions.appOffline),
      map((isOffline) => {
        if (isOffline) {
          this.dialog.open(OfflineDialogComponent)
        }
      })
    );
  }, {dispatch: false});

  constructor(private actions$: Actions, private readonly dialog: MatDialog) {
  }

}
