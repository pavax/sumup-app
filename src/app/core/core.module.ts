import {APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {AuthService} from "./auth.service";
import {AuthGuardWithForcedLogin} from "./auth-guard-with-forced-login.service";


import * as fromCore from './store/core.reducer';
import {CoreState} from './store/core.reducer';

import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthConfig, OAuthModule, OAuthModuleConfig, OAuthStorage} from "angular-oauth2-oidc";
import {authConfig} from "./auth-config";
import {authModuleConfig} from "./auth-module-config";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDateFnsModule} from "@angular/material-date-fns-adapter";
import {de} from 'date-fns/locale';
import localeDECH from "@angular/common/locales/de-CH";
import {RefreshTokenAuthInterceptor} from "./refresh-token-auth-interceptor.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {CoreEffects} from "./store/core.effects";
import {OfflineDialogComponent} from "./components/dialog/offline.dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {UpdateDialogComponent} from "./components/update/update.dialog.component";

// We need a factory since localStorage is not available at AOT build time
function storageFactory(): OAuthStorage {
  return localStorage;
}

function authAppInitializerFactory(authService: AuthService): () => Promise<any> {
  return () => authService.runInitialLoginSequence();
}

registerLocaleData(localeDECH);

export interface AppState {
  core: CoreState
}

@NgModule({
  declarations: [
    LoginComponent,
    OfflineDialogComponent,
    UpdateDialogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    StoreModule.forRoot<AppState>({core: fromCore.reducer}),
    EffectsModule.forRoot([CoreEffects]),
    MatDatepickerModule,
    MatDateFnsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    AuthService,
    AuthGuardWithForcedLogin,
    MatDateFnsModule
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {provide: APP_INITIALIZER, useFactory: authAppInitializerFactory, deps: [AuthService], multi: true},
        {provide: AuthConfig, useValue: authConfig},
        {provide: OAuthModuleConfig, useValue: authModuleConfig},
        {provide: OAuthStorage, useFactory: storageFactory},
        {provide: MAT_DATE_LOCALE, useValue: de},
        {provide: LOCALE_ID, useValue: 'de-CH'},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RefreshTokenAuthInterceptor,
          deps: [AuthService, OAuthModuleConfig,],
          multi: true
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

