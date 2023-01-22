import {AuthConfig} from "angular-oauth2-oidc";
import {environment} from "../../environments/environment";

export const authConfig: AuthConfig = {

  loginUrl: 'https://api.sumup.com/authorize',

  tokenEndpoint: 'https://api.sumup.com/token',

  redirectUri: environment.sumup_redirectUri,

  logoutUrl: environment.sumup_redirectUri,

  useSilentRefresh: true,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: environment.sumup_clientId,

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  dummyClientSecret: environment.sumup_clientSecret,

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'transactions.history',

  oidc: false,

  showDebugInformation: true,
};

