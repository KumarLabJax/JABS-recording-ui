import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatDialogRef, MatSnackBar } from '@angular/material';
import { LoginService } from '../../../services/login.service';

/**
 * used to validate a form containing two password inputs (newPassword and confirmPassword)
 * form will be considered invalid if these do not match
 * @param control
 */
const passwordErrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('newPassword');
  const repeatPassword = control.get('confirmPassword');
  return password.value !== repeatPassword.value ? { passwordError: true } : null;
};

/**
 * used to determine if a password field should have an error state
 */
export class PasswordsMatchErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.parent.invalid && control.touched;
  }
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: passwordErrorValidator });

  passwordMatchErrorMatcher = new PasswordsMatchErrorMatcher();

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private loginService: LoginService,
    private snackbar: MatSnackBar
  ) { }

  /**
   * close dialog if user clicks cancel button
   */
  cancel() {
    this.dialogRef.close();
  }

  /**
   * form submit action -- send password change request to server
   */
  savePassword() {
    this.loginService.changePassword(this.passwordForm.value.currentPassword, this.passwordForm.value.newPassword).subscribe(() => {
      // success, open a snackbar and close the dialog
      this.openSnackbar('Password Changed');
      this.dialogRef.close();
    }, err => {
      // error, open snackbar with error message
      const message = ('message' in err.error) ? ': ' + err.error.message : '';
      this.openSnackbar(`Error changing password${message}`);
      console.error(err);
    });
  }

  /**
   * should a password field in the error state show its "passwords don't match" error
   */
  showMatchError() {
    return this.passwordForm.errors !== null && 'passwordError' in this.passwordForm.errors;
  }

  /**
   * open a snackbar with a default configuration
   * @param message string message to display in the snackbar
   * @param duration time to show the message in milliseconds
   */
  private openSnackbar(message: string, duration: number = 6000) {
    this.snackbar.open(message, 'CLOSE', {duration});
  }

}
