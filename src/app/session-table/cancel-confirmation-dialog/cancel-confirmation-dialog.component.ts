import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-cancel-confirmation-dialog',
  templateUrl: './cancel-confirmation-dialog.component.html',
  styleUrls: ['./cancel-confirmation-dialog.component.css']
})
export class CancelConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<CancelConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

}
