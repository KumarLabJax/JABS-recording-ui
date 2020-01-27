import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, finalize, take } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpUserEvent
} from '@angular/common/http';

import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  authUrls: string[] = ['auth/login', 'auth/refresh'].map(s => environment.api + s);
  homeUrls: string[] = ['/', '/login', '/dashboard'];

  constructor(public tokenService: TokenService,
              private injector: Injector,
              private router: Router,
              private location: Location) {}

  addToken(req: HttpRequest<any>, token: string = null): HttpRequest<any> {
    if (!this.tokenService.tokensNotExpired()) {
      this.logoutUser(new HttpErrorResponse({
        error: null,
        headers: req.headers,
        status: 401,
        statusText: 'Token expired',
        url: req.url
      }));
      return req;
    } else {
      const authToken = (token != null) ? token : this.tokenService.getAccessToken();
      return req.clone({ setHeaders: { Authorization: 'Bearer ' + authToken }});
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>>  {

    if (request.url.includes('/reset_password/')) {
      console.log('don\'t add token to reset_password url');
      return next.handle(request);
    }

    if (!this.authUrls.includes(request.url)) {
      // try to add the auth token to every request except auth requests
      const req = this.addToken(request);
      return next.handle(req)
        .pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse) {
              switch ((error as HttpErrorResponse).status) {
                case 400:
                  return this.handle400Error(error);
                case 401:
                  return this.handle401Error(request, next, error);
                default:
                  return throwError(error as HttpErrorResponse);
              }
            } else {
              return throwError(error);
            }
          })
        );
    } else {
      return next.handle(request);
    }
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler,  error: HttpErrorResponse) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      const authService = this.injector.get(LoginService);

      return authService.refreshToken()
        .pipe(
          switchMap((newToken: string) => {
            if (newToken) {
              this.tokenSubject.next(newToken);
              return next.handle(this.addToken(req, newToken));
            }
            // If we don't get a new token, we are in trouble so logout.
            return this.logoutUser(error);
          }),
          catchError(err => {
            // If there is an exception calling 'refreshToken', bad news so logout.
            return this.logoutUser(err);
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      return this.tokenSubject
        .pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addToken(req, token));
          })
        );
    }
  }



  private handle400Error(err: HttpErrorResponse) {
    if (err && err.status === 400 && err.error && err.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.logoutUser(err);
    }
    return throwError(err);
  }

  logoutUser(err: HttpErrorResponse) {
    this.tokenService.deleteTokens();
    const entryUrl = this.location.path();
    if (this.homeUrls.includes(entryUrl.split('?')[0])) {
      this.router.navigate(['/login'], {queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['/login'],
        {queryParams: {next: entryUrl}, queryParamsHandling: 'merge' });
    }
    return throwError(err);
  }
}
