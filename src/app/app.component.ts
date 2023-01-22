import {Component, OnInit} from '@angular/core';
import {AuthConfig} from "angular-oauth2-oidc";
import {Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {AuthService} from "./core/auth.service";
import {Title} from "@angular/platform-browser";
import {environment} from "../environments/environment";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isLoggedIn$ = this.authService.isAuthenticated$;

  constructor(private readonly breakpointObserver: BreakpointObserver,
              private readonly authService: AuthService,
              private readonly titleService: Title,) {
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.titleService.setTitle(environment.title)
  }
}
