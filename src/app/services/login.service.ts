import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private api: string = environment.api + 'auth/';
  private identity: {uid: number, email_address: string, admin: boolean};
  private userEmail: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userEmail$ = this.userEmail.asObservable();

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private router: Router) {
    this.tokenService.hasValidToken.subscribe(status => {
      this.isAuthenticated.next(status);
      if (status) {
        this.identity = this.tokenService.getIdenityFromToken();
        this.userEmail.next(this.identity.email_address);
        this.isAdmin.next(this.identity.admin);
      } else {
        this.isAdmin.next(false);
      }
    });
  }

  login(payload: string): Observable<any> {
    return this.http.post(this.api + 'login', payload, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  logout(next: string | null = null) {
    this.tearDown();
    if (next) {
      this.router.navigate(['/login'], {queryParams: {next}});
    } else {
      this.router.navigate(['/login']);
    }

  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.put(
      `${environment.api}user/${this.identity.uid}/change_password`,
      {old_password: oldPassword, new_password: newPassword}
    );
  }

  resetPassword(uid: number, token: string, newPassword: string) {
    return this.http.post(`${environment.api}user/${uid}/reset_password/${token}`, {password: newPassword});
  }

  forgotPassword(emailAddress: string) {
    const url = window.location.origin + this.router.createUrlTree(['/password-reset']);
    return this.http.post(
      `${environment.api}user/send_pw_reset`,
      {email: emailAddress, url},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  inviteUser(emailAddress: string, isAdmin: boolean): Observable<any> {
    const url = window.location.origin + this.router.createUrlTree(['/password-reset']);
    return this.http.post(
      `${environment.api}user/invite`,
      {email: emailAddress, admin: isAdmin, url},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  setLoginValues(accessToken: string, refreshToken: string) {
    const tokensAreValid = (!this.tokenService.isTokenExpired(accessToken) && !this.tokenService.isTokenExpired(refreshToken));
    if (tokensAreValid) {
      this.tokenService.setAuthTokens(accessToken, refreshToken);
      this.identity = this.tokenService.getIdenityFromToken();
      this.userEmail.next(this.identity.email_address);
      this.isAuthenticated.next(true);
    } else {
      console.log('Tokens aren\'t valid');
    }
  }

  refreshToken(): Observable<string> {

    const token = this.tokenService.getRefreshToken();
    if (token) {
      // if we have a refresh token, try to get a new access token
      return this.http.post(this.api + 'refresh', null, {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
      }).pipe(
        map((resp: {access: string}) => {
          const newToken = resp.access;
          this.tokenService.setAccessToken(newToken);
          return newToken;
        })
      );
    } else {
      // if we don't have a refresh token, return null
      return of(null);
    }
  }

  checkToken() {
    return this.tokenService.tokensNotExpired();
  }

  tearDown() {
    // Teardown Other Services
    this.tokenService.tearDown();

    // Teardown this service
    this.isAuthenticated.next(false);
    this.userEmail.next(null);
    this.isAdmin.next(false);
  }
}
