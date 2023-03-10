import { Component, Input} from '@angular/core';
import { Device } from '../shared/device';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeviceInfoDialogComponent } from './device-info-dialog/device-info-dialog.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent {


  @Input() data: Device;
  @Input() clickable = true;


  constructor(private dialog: MatDialog) {}

  public openDetailsDialog() {
    // in some cases we don't want to do anything if the user clicks this component
    if (!this.clickable) {
      return;
    }

    // component is clickable -- open the dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      device: this.data,
      warnings: {
        disk_space: this.lowDiskSpaceWarning(),
        free_memory: this.lowMemoryWarning()
      }
    };
    this.dialog.open(DeviceInfoDialogComponent, dialogConfig);
  }

  public showWarningIcon() {
    return (this.lowDiskSpaceWarning() || this.lowMemoryWarning());
  }

  public lowDiskSpaceWarning() {
    // show warning if free disk space falls below 100GB
    // (backend reports disk space in megabytes)
    // TODO this should be configurable
    return this.data.system_info.free_disk < 100 * 1024;
  }

  public lowMemoryWarning() {
    // show warning if available RAM falls below 20%
    // TODO this should be configurable
    return this.data.system_info.free_ram / this.data.system_info.total_ram < 0.2;
  }
}
