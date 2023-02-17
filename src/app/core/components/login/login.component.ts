import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  constructor(private oAuthService: OAuthService) {}

  public login($event: MouseEvent) {
    $event.preventDefault();
    //this.oAuthService.initLoginFlow();
    this.oAuthService.initCodeFlow();
  }
}
