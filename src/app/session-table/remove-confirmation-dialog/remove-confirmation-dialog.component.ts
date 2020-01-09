import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-remove-confirmation-dialog',
  templateUrl: './remove-confirmation-dialog.component.html',
  styleUrls: ['./remove-confirmation-dialog.component.css']
})
export class RemoveConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<RemoveConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }
}
