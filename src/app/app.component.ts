import {Component, OnDestroy, OnInit} from '@angular/core';
import {delay, Observable, of, Subject} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {AuthService} from "./core/auth.service";
import {Title} from "@angular/platform-browser";
import {environment} from "../environments/environment";
import {Store} from "@ngrx/store";
import {appInit} from "./core/store/core.actions";
import * as CoreSelectors from "./core/store/core.selectors";
import {CoreState} from "./core/store/core.reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isLoggedIn$ = this.authService.isAuthenticated$;

  isOnline$ = this.store.select(CoreSelectors.selectHasNetworkConnectivity);

  title = environment.title;

  private destroy$ = new Subject();

  constructor(private readonly breakpointObserver: BreakpointObserver,
              private readonly authService: AuthService,
              private readonly store: Store<CoreState>,
              private readonly titleService: Title,
  ) {
  }


  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title)
    this.store.dispatch(appInit());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
