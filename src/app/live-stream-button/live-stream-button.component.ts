import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LiveStreamDialogComponent } from '../live-stream-dialog/live-stream-dialog.component';
import { Device } from '../shared/device';

@Component({
  selector: 'app-live-stream-button',
  templateUrl: './live-stream-button.component.html',
  styleUrls: ['./live-stream-button.component.css']
})
export class LiveStreamButtonComponent {

  @Input() device: Device;

  constructor(private dialog: MatDialog) { }

  /**
   * open a viewer dialog to display the live stream for this device
   */
  public openViewerDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
        device: this.device
    };
    this.dialog.open(LiveStreamDialogComponent, dialogConfig);
  }

}
