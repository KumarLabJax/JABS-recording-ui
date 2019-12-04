import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cancel-confirmation-dialog',
  templateUrl: './cancel-confirmation-dialog.component.html',
  styleUrls: ['./cancel-confirmation-dialog.component.css']
})
export class CancelConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<CancelConfirmationDialogComponent>) { }

}
