import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device } from '../shared/device';
import { DeviceService } from '../services/device.service';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit, OnDestroy {

  private readonly refreshRate = 5000;
  private killTrigger: Subject<void> = new Subject();

  // list of devices to be displayed
  devices: Device[] = [];

  // map for quick access to devices by name
  deviceMap = new Map();

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    timer(0, this.refreshRate)
      .pipe(
        takeUntil(this.killTrigger),
        switchMap(() => this.deviceService.getDevices())
      ).subscribe((data) => {
        // rather than just assigning data (updated list of devices from server) to this.devices,
        // we go through this process of updating the existing Device objects (if a device already exists
        // with that name).
        for (const d of data) {
          if (!this.deviceMap.has(d.name)) {
            this.devices.push(d);
            this.deviceMap.set(d.name, this.devices[this.devices.length - 1]);
          } else {
            const device = this.deviceMap.get(d.name);
            for (const key of Object.keys(d)) {
              device[key] = d[key];
            }
          }
        }
    });
  }

  ngOnDestroy(){
    this.killTrigger.next();
  }
}
