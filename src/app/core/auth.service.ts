import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map(values => values.every(b => b)));

  private navigateToLoginPage() {
    // TODO: Remember current URL
    this.router.navigateByUrl('/login');
  }

  constructor(private oauthService: OAuthService, private router: Router) {
    // Useful for debugging:
    this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        console.warn('OAuthEvent Object:', event);
      }
    });

    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener('storage', event => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );

      if (!this.oauthService.hasValidAccessToken()) {
        this.navigateToLoginPage();
      }
    });

    this.oauthService.events.subscribe(() => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

    // this.oauthService.events
    //   .pipe(filter(e => ['token_received'].includes(e.type)))
    //   .subscribe(e => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(
        filter(e => ['session_terminated', 'session_error'].includes(e.type))
      )
      .subscribe(() => this.navigateToLoginPage());

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public runInitialLoginSequence() {
    if (location.hash) {
      console.log('Encountered hash fragment, plotting as table...');
      console.table(
        location.hash
          .substr(1)
          .split('&')
          .map(kvp => kvp.split('='))
      );
    }
    // 0. LOAD CONFIG:
    // First we have to check to see how the IdServer is
    // currently configured:
    return this.oauthService
      .tryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }

        // 2. SILENT LOGIN:
        // Try to log in via a refresh because then we can prevent
        // needing to redirect the user:
        return this.oauthService
          .refreshToken()
          .then(() => Promise.resolve())
          .catch(result => {
            return Promise.reject(result);
          });
      })
      .then(() => {
        this.isDoneLoadingSubject$.next(true);

        // Check for the strings 'undefined' and 'null' just to be sure. Our current
        // login(...) should never have this, but in case someone ever calls
        // initImplicitFlow(undefined | null) this could happen.
        if (
          this.oauthService.state &&
          this.oauthService.state !== 'undefined' &&
          this.oauthService.state !== 'null'
        ) {
          let stateUrl = this.oauthService.state;
          if (!stateUrl.startsWith('/')) {
            stateUrl = decodeURIComponent(stateUrl);
          }
          console.log(
            `There was state of ${this.oauthService.state}, so we are sending you to: ${stateUrl}`
          );
          this.router.navigateByUrl(stateUrl);
        }
      })
      .catch(() => this.isDoneLoadingSubject$.next(true));
  }

  public login(targetUrl?: string): void {
    this.oauthService.initLoginFlow(targetUrl || this.router.url);
  }

  public logout() {
    this.oauthService.logOut();
  }

  public refresh() {
    return from(
      this.oauthService
        .refreshToken()
        .then(response => Promise.resolve(response.access_token))
        .catch(result => {
          return Promise.reject(result);
        })
    );
  }

  public hasValidToken() {
    return this.oauthService.hasValidAccessToken();
  }

  // These normally won't be exposed from a service like this, but
  // for debugging it makes sense.
  private get accessToken() {
    return this.oauthService.getAccessToken();
  }

  private get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  private get idToken() {
    return this.oauthService.getIdToken();
  }

  private get logoutUrl() {
    return this.oauthService.logoutUrl;
  }
}
