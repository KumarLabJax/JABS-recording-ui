import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LiveStreamDialogComponent } from '../live-stream-dialog/live-stream-dialog.component';
import { Device } from '../shared/device';

@Component({
  selector: 'app-live-stream-button',
  templateUrl: './live-stream-button.component.html',
  styleUrls: ['./live-stream-button.component.css']
})
export class LiveStreamButtonComponent implements OnInit {

  @Input() device: Device;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  public openViewerDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
        device: this.device
    };
    dialogConfig.height = '450px';
    dialogConfig.width = '350px';
    this.dialog.open(LiveStreamDialogComponent, dialogConfig);
  }

}
