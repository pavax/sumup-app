import { Injectable, Optional } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { OAuthModuleConfig } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';

@Injectable()
export class RefreshTokenAuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    @Optional() private readonly moduleConfig: OAuthModuleConfig
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const url = req.url.toLowerCase();
    if (
      !this.moduleConfig ||
      !this.moduleConfig.resourceServer ||
      !this.checkUrl(url) ||
      url === authConfig.tokenEndpoint
    ) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status !== 401) {
          return throwError(error);
        }
        return this.reAuthenticate().pipe(
          switchMap(token => {
            const header = 'Bearer ' + token;
            const headers = req.headers.set('Authorization', header);
            return next.handle(req.clone({ headers }));
          })
        );
      })
    );
  }

  private reAuthenticate(): Observable<string> {
    return this.authService.refresh().pipe(
      catchError(error => {
        this.authService.login();
        return throwError(error);
      })
    );
  }

  private checkUrl(url: string): boolean {
    if (this.moduleConfig.resourceServer.customUrlValidation) {
      return this.moduleConfig.resourceServer.customUrlValidation(url);
    }

    if (this.moduleConfig.resourceServer.allowedUrls) {
      return !!this.moduleConfig.resourceServer.allowedUrls.find(u =>
        url.toLowerCase().startsWith(u.toLowerCase())
      );
    }

    return true;
  }
}
