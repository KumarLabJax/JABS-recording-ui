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
  // these URLs don't get the jwt token added to the header
  authUrls: string[] = ['auth/login', 'auth/refresh', 'user/send_pw_reset'].map(s => environment.api + s);
  homeUrls: string[] = ['/', '/login', '/dashboard'];

  constructor(private tokenService: TokenService,
              private injector: Injector,
              private router: Router,
              private location: Location) {}

  /**
   * if tokens are expired, logout the user otherwise add them to the request
   * @param req http request
   * @param token JWT token to add to request
   */
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

  /**
   * intercept http requests
   * @param request HttpRequest being intercepted
   * @param next HttpHandler to handle the requests
   */
  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>>  {

    // don't do anything to non-API urls, auth URLs, or user password reset URL
    if (!request.url.startsWith(environment.api) || this.authUrls.includes(request.url) || request.url.includes('/reset_password/')) {
      return next.handle(request);
    }

    // try to add the auth token
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
  }

  /**
   * handle 401 error -- for URLs that required authorization this often means the auth token has expired.
   * If we have a valid refresh token we will try to get a new auth token and try the request again.
   * @param req HttpRequest that caused the error
   * @param next HttpHandler that will be used to handle response after we obtain a new token
   * @param error HttpErrorResponse from previous request
   */
  handle401Error(req: HttpRequest<any>, next: HttpHandler,  error: HttpErrorResponse) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      const authService = this.injector.get(LoginService);

      // try to use the refresh token to get a new auth token
      return authService.refreshToken()
        .pipe(
          switchMap((newToken: string) => {
            if (newToken) {
              // got a token, add the new token to the request and try again
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
            // done trying to refresh token
            this.isRefreshingToken = false;
          })
        );
    } else {
      // already refreshing, wait
      return this.tokenSubject
        .pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => {
            // try again with new token
            return next.handle(this.addToken(req, token));
          })
        );
    }
  }


  /**
   * handle 400 error
   * @param err HttpErrorResponse
   */
  private handle400Error(err: HttpErrorResponse) {
    if (err && err.status === 400 && err.error && err.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.logoutUser(err);
    }
    return throwError(err);
  }

  /**
   * log the user out in response to an error we can't recover from
   * @param err HttpErrorResonse will be thrown so the original http request that lead us here can complete
   */
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
