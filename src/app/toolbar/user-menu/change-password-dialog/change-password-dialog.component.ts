import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatDialogRef, MatSnackBar } from '@angular/material';
import { LoginService } from '../../../services/login.service';

const passwordErrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('newPassword');
  const repeatPassword = control.get('confirmPassword');
  return password.value !== repeatPassword.value ? { passwordError: true } : null;
};

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
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private loginService: LoginService,
    private snackbar: MatSnackBar
  ) { }

  cancel() {
    this.dialogRef.close();
  }

  savePassword() {
    this.loginService.changePassword(this.passwordForm.value.currentPassword, this.passwordForm.value.newPassword).subscribe(() => {
      this.openSnackbar('Password Changed');
      this.dialogRef.close();
    }, err => {
      const message = ('message' in err.error) ? ': ' + err.error.message : '';
      this.openSnackbar(`Error changing password${message}`);
      console.error(err);
    });
  }

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
