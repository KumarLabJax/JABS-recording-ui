import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordsMatchErrorMatcher } from '../toolbar/user-menu/change-password-dialog/change-password-dialog.component';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material';
import { TokenService } from '../services/token.service';

const passwordErrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('newPassword');
  const repeatPassword = control.get('confirmPassword');
  return password.value !== repeatPassword.value ? { passwordError: true } : null;
};

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  uid: number;
  token: string;
  passwordMatchErrorMatcher = new PasswordsMatchErrorMatcher();
  resetError: string;

  passwordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: passwordErrorValidator });

  constructor(private route: ActivatedRoute,
              private loginService: LoginService,
              private snackbar: MatSnackBar,
              private router: Router,
              private tokenService: TokenService) {

    this.uid = +this.route.snapshot.paramMap.get('uid');
    this.token = this.route.snapshot.paramMap.get('token');
  }

  ngOnInit() {
    // this page forces the user to be logged out
    this.tokenService.deleteTokens();
  }

  cancel() {
    this.router.navigate(['/login']);
  }

  savePassword() {
    this.loginService.resetPassword(this.uid, this.token, this.passwordForm.value.newPassword).subscribe(() => {
      this.snackbar.open('Password Changed', 'CLOSE', {duration: 6000});
      this.router.navigate(['/login']);
    }, err => {
      const message = ('message' in err.error) ? ': ' + err.error.message : '';
      this.resetError = message;
      console.error(err);
    });
  }

  showMatchError() {
    return this.passwordForm.errors !== null && 'passwordError' in this.passwordForm.errors;
  }

}
