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
  // the following two parameters are obtained from URL followed from password reset email
  uid: number;  // id of user attempting to reset password
  token: string; // password reset token

  // this will be added as a form validator to make sure the user enters the same password twice
  passwordMatchErrorMatcher = new PasswordsMatchErrorMatcher();

  // any error message recieved from server after attempting to reset password
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

    // get the uid and token from the URL
    this.uid = +this.route.snapshot.paramMap.get('uid');
    this.token = this.route.snapshot.paramMap.get('token');
  }

  ngOnInit() {
    // this page forces the user to be logged out
    this.tokenService.deleteTokens();
  }

  cancel() {
    // if they don't want to reset, redirect them to the login page
    this.router.navigate(['/login']);
  }

  /**
   * attempt to save their new password
   */
  savePassword() {
    this.loginService.resetPassword(this.uid, this.token, this.passwordForm.value.newPassword).subscribe(() => {
      // success -- open a snackbar message and redirect them to the login page
      this.snackbar.open('Password Changed', 'CLOSE', {duration: 6000});
      this.router.navigate(['/login']);
    }, err => {
      // if there was an error display any message it may contain and log the error to the console.
      const message = ('message' in err.error) ? ': ' + err.error.message : '';
      this.resetError = message;
      console.error(err);
    });
  }

  /**
   * returns true if the form should display the "passwords don't match" error message
   */
  showMatchError() {
    return this.passwordForm.errors !== null && 'passwordError' in this.passwordForm.errors;
  }

}
