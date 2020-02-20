import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  submitted = false;

  form = new FormGroup({
    email_address: new FormControl('', Validators.required)
  });

  constructor(
    private loginService: LoginService,
    public location: Location
  ) { }

  submit() {
    this.loginService.forgotPassword(this.form.value.email_address).subscribe(() => {
      this.submitted = true;
    }, err => {
      console.error(err);
    });
  }
}
