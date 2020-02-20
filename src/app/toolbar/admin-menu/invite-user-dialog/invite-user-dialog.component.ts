import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-invite-user-dialog',
  templateUrl: './invite-user-dialog.component.html',
  styleUrls: ['./invite-user-dialog.component.css']
})
export class InviteUserDialogComponent {

  submitting = false;

  inviteForm = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    admin: new FormControl(false),
  });

  constructor(
    private dialogRef: MatDialogRef<InviteUserDialogComponent>,
    private snackbar: MatSnackBar,
    private loginService: LoginService
  ) { }

  /**
   * handle submit button click
   */
  submit() {
    this.submitting = true;
    this.loginService.inviteUser(this.inviteForm.value.emailAddress, this.inviteForm.value.admin).subscribe(() => {
      this.snackbar.open('Invitation Sent', 'CLOSE', {duration: 6000});
      this.dialogRef.close();
    }, err => {
      const message = ('message' in err.error) ? ': ' + err.error.message : '';
      this.snackbar.open(`Error${message}`, 'CLOSE', {duration: 6000});
      this.submitting = false;
      console.error(err);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
