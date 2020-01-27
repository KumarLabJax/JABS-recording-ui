import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nextUrl: string;
  loginError = false;

  loginForm = new FormGroup({
    email_address: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.nextUrl = this.route.snapshot.queryParams.next || '/';
    if (this.loginService.checkToken()) {
      this.router.navigateByUrl(this.nextUrl);
    } else {
      this.loginService.tearDown();
    }
  }

  submit(): void {
    this.loginService.login(JSON.stringify(this.loginForm.value)).subscribe(resp => {
      this.loginError = null;
      this.loginService.setLoginValues(resp.access, resp.refresh);
      this.snackbar.open('You\'ve successfully logged in!', 'DONE', {
        duration: 3000
      });
      this.router.navigateByUrl(this.nextUrl);
    }, err => {
      if (err.status === 401) {
        this.loginError = err.error.message;
      } else {
        console.error(err);
      }
    });
  }
}
