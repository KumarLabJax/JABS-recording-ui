import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import * as jwt_decode from 'jwt-decode';

export interface JwtToken {
  exp: number;
  fresh: boolean;
  iat: number;
  identity: any;
  jti: string;
  nbf: number;
  type: string;
  user_claims: object;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  hasValidToken: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const status = accessToken != null && !this.isTokenExpired(accessToken)
      || refreshToken != null && !this.isTokenExpired(refreshToken);
    this.hasValidToken.next(status);
  }

  public accessKey = 'access_token';
  public refreshKey = 'refresh_token';

  public getToken(key): string { return localStorage.getItem(key); }

  public getAccessToken(): string { return this.getToken(this.accessKey); }

  public getRefreshToken(): string { return this.getToken(this.refreshKey); }

  public setToken(key: string, token: string) { if (token != null) { localStorage.setItem(key, token); } }

  public setAccessToken(token: string) { this.setToken(this.accessKey, token); }

  public setRefreshToken(token: string) { this.setToken(this.refreshKey, token); }

  public setAuthTokens(access: string, refresh: string) { this.setAccessToken(access); this.setRefreshToken(refresh); }

  public deleteAccessToken() { localStorage.removeItem(this.accessKey); }

  public deleteRefreshToken() { localStorage.removeItem(this.refreshKey); }

  public deleteTokens() {
    this.deleteAccessToken();
    this.deleteRefreshToken();
    this.hasValidToken.next(false);
  }

  public tearDown() {
    localStorage.clear();
  }

  public tokensNotExpired(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const status = accessToken != null && !this.isTokenExpired(accessToken)
      || refreshToken != null && !this.isTokenExpired(refreshToken);
    this.hasValidToken.next(status);
    return status;
  }

  public accessTokenNotExpired(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const status = accessToken != null && !this.isTokenExpired(accessToken);

    // we want the app to show the user as logged in if they have a valid access OR refresh token
    this.hasValidToken.next(status || refreshToken != null && !this.isTokenExpired(refreshToken));
    // only return true if the access token is not expired
    return status;
  }

  public hasTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return accessToken != null && refreshToken != null;
  }

  public getIdenityFromToken() {
    const accessToken = this.getAccessToken();
    if (accessToken != null) {
      const jwt: JwtToken = jwt_decode(accessToken);
      return jwt.identity;
    }
    return null;
  }

  public isTokenExpired(token): boolean {
    const jwt: JwtToken = jwt_decode(token);
    const currentTime = new Date().getTime() / 1000;
    return currentTime > jwt.exp;
  }
}
