import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fileprefix-group-set-dialog',
  templateUrl: './fileprefix-group-set-dialog.component.html',
  styleUrls: ['./fileprefix-group-set-dialog.component.css']
})
export class FileprefixGroupSetDialogComponent {

  formGroup = new FormGroup({fileNames: new FormControl()});

  constructor(public dialogRef: MatDialogRef<FileprefixGroupSetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {expectedCount: number}) { }


  public submitDisabled(): boolean {

    let numRows: number;

    if (this.formGroup.controls.fileNames.value) {
      const lines = this.formGroup.controls.fileNames.value.split(/\r*\n/);
      if (lines[lines.length - 1].trim().length === 0) {
        lines.pop();
      }
      numRows = lines.length;
    } else {
      numRows = 0;
    }

    return numRows !== this.data.expectedCount;
  };
}
