import { Component, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Device } from '../../shared/device';

@Pipe({name: 'formatSeconds'})
export class FormatSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - (hours * 3600)) / 60);
    const seconds = value - (hours * 3600) - (minutes * 60);
    return hours.toString() + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
  }
}

@Component({
  selector: 'app-device-info-dialog',
  templateUrl: './device-info-dialog.component.html',
  styleUrls: ['./device-info-dialog.component.css']
})
export class DeviceInfoDialogComponent implements OnInit {

  public device: Device;
  public warnings: {};

  constructor(public dialogRef: MatDialogRef<DeviceInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    this.device = this.data.device;
    this.warnings = this.data.warnings;
  }

  /**
   * handle click for dialog close button
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * handle user click on button to open live stream for a device
   * @param deviceId ID of device user wants to view
   */
  onClickOpenStream(deviceId: number) {
    // TODO: not yet implemented
  }
}
