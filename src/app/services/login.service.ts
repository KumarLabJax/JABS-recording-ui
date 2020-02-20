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
  // root API url
  private api: string = environment.api + 'auth/';
  // user's identity contained in JWT token
  private identity: {uid: number, email_address: string, admin: boolean};

  // behavior subject and observable that will emit the user's email address
  private userEmail: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  userEmail$ = this.userEmail.asObservable();

  // indicate if the user is an admin or not
  isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // indicate if user is authenticated
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);




  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private router: Router) {

    // see if we already have valid tokens when setting up the login service
    this.tokenService.hasValidToken.subscribe(status => {
      this.isAuthenticated.next(status);
      if (status) {
        // we have a valid token, set our values
        this.identity = this.tokenService.getIdenityFromToken();
        this.userEmail.next(this.identity.email_address);
        this.isAdmin.next(this.identity.admin);
      } else {
        // token is not valid, in addition to setting the next value of isAuthenticated (done above)
        // also set next value of isAdmin to false.
        this.isAdmin.next(false);
      }
    });
  }

  /**
   * login method, will send login information to login endpoint
   * @param payload login data, from login form
   */
  login(payload: string): Observable<any> {
    return this.http.post(this.api + 'login', payload, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  /**
   * log out the user
   * @param next optional url that will be passed to the login route, user will be redirected here after logging in
   */
  logout(next: string | null = null) {
    this.tearDown();
    if (next) {
      // navigate to login page after adding "next" query parameter
      this.router.navigate(['/login'], {queryParams: {next}});
    } else {
      // no next url, just navigate to login page
      this.router.navigate(['/login']);
    }

  }

  /**
   * request a password change for the logged in user
   * @param oldPassword user's old password
   * @param newPassword user's new password
   */
  changePassword(oldPassword: string, newPassword: string) {
    return this.http.put(
      `${environment.api}user/${this.identity.uid}/change_password`,
      {old_password: oldPassword, new_password: newPassword}
    );
  }

  /**
   * reset a user password
   * @param uid user id
   * @param token password reset token
   * @param newPassword
   */
  resetPassword(uid: number, token: string, newPassword: string) {
    return this.http.post(`${environment.api}user/${uid}/reset_password/${token}`, {password: newPassword});
  }

  /**
   * request a password reset email
   * @param emailAddress email address identifying user requesting a password reset email
   */
  forgotPassword(emailAddress: string) {
    // need to send a 'callback' URL to the server so it knows where to send the user to reset the password
    const url = window.location.origin + this.router.createUrlTree(['/password-reset']);
    return this.http.post(
      `${environment.api}user/send_pw_reset`,
      {email: emailAddress, url},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  /**
   * invite a user to use the app
   * @param emailAddress new user email address
   * @param isAdmin should the user be an admin?
   */
  inviteUser(emailAddress: string, isAdmin: boolean): Observable<any> {
    const url = window.location.origin + this.router.createUrlTree(['/password-reset']);
    return this.http.post(
      `${environment.api}user/invite`,
      {email: emailAddress, admin: isAdmin, url},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  /**
   * save tokens
   * @param accessToken
   * @param refreshToken
   */
  setLoginValues(accessToken: string, refreshToken: string) {
    // check that the tokens are valid
    const tokensAreValid = (!this.tokenService.isTokenExpired(accessToken) && !this.tokenService.isTokenExpired(refreshToken));
    if (tokensAreValid) {
      // tokens are valid, save them and get the identity
      this.tokenService.setAuthTokens(accessToken, refreshToken);
      this.identity = this.tokenService.getIdenityFromToken();
      this.userEmail.next(this.identity.email_address);
      this.isAuthenticated.next(true);
      this.isAdmin.next(this.identity.admin);
    } else {
      console.log('Tokens aren\'t valid');
      this.isAuthenticated.next(false);
      this.isAdmin.next(false);
    }
  }

  /**
   * get a new access token using a refresh token
   */
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

  /**
   * do we have a valid token?
   */
  checkToken() {
    return this.tokenService.tokensNotExpired();
  }

  /**
   * tear down this service
   */
  tearDown() {
    // Teardown Other Services
    this.tokenService.tearDown();

    // Teardown this service
    this.isAuthenticated.next(false);
    this.userEmail.next(null);
    this.isAdmin.next(false);
  }
}
