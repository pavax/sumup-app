import {Injectable} from "@angular/core";
import {createEffect} from "@ngrx/effects";
import {BehaviorSubject, fromEvent, merge} from "rxjs";
import {map} from "rxjs/operators";
import * as CoreActions from "./core.actions";

@Injectable()
export class CoreEffects {

  checkConnectivity$ = createEffect(() => {
    return merge(
      new BehaviorSubject(navigator.onLine),
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
    ).pipe(map((state) => state ? CoreActions.appOnline() : CoreActions.appOffline()));
  });

}
