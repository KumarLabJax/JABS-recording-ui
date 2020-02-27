import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // we might have a url to redirect to after a successful login
  nextUrl: string;

  // if there is an error logging in we can set this to an error message to display in the login component
  loginError;

  loginForm = new FormGroup({
    email_address: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    // grab "next" query parameter if present, otherwise we'll redirect to the app root after logging in
    this.nextUrl = this.route.snapshot.queryParams.next || '/';

    // check to see if we already have valid tokens, if so we can redirect to nextUrl
    if (this.loginService.checkToken()) {
      this.router.navigateByUrl(this.nextUrl);
    } else {
      this.loginService.tearDown();
    }
  }

  /**
   * form submit action -- attempt to log in
   */
  submit(): void {
    // call the loginService.login method. this will get JWT tokens if successful
    this.loginService.login(JSON.stringify(this.loginForm.value)).subscribe(resp => {
      // clear any error message
      this.loginError = null;
      // success, save the tokens contained in the response
      this.loginService.setLoginValues(resp.access, resp.refresh);
      // and navigate away from the login page
      this.router.navigateByUrl(this.nextUrl);
    }, err => {
      if (err.status === 401) {
        // save the error message for a 401 "not authorized" error
        this.loginError = err.error.message;
      } else {
        // some other expected error. log it to the console and set a generic "server error" message
        console.error(err);
        this.loginError = 'server error';
      }
    });
  }
}
