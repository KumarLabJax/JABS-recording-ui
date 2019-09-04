import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Device } from '../shared/device';
import { DeviceService } from '../services/device.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';

interface DeviceCount {
  name: string;
  value: number;
}

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit, OnDestroy {

  private readonly refreshRate = 5000;
  private killTrigger: Subject<void> = new Subject();

  // list of devices to be displayed
  public devices: Device[] = [];

  // map for quick access to devices by name
  private deviceMap = new Map();

  @Output() deviceSummary = new EventEmitter<DeviceCount[]>();

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    timer(0, this.refreshRate)
      .pipe(
        takeUntil(this.killTrigger),
        switchMap(() => this.deviceService.getDevices())
      ).subscribe((data) => {

        let idle = 0;
        let busy = 0;
        let down = 0;

        // rather than just assigning data (updated list of devices from server) to this.devices,
        // we go through this process of updating the existing Device objects (if a device already exists
        // with that name).
        for (const d of data) {

          switch (d.state) {
            case 'BUSY':
              busy++;
              break;
            case 'IDLE':
              idle++;
              break;
            case 'DOWN':
              down++;
              break;
          }

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

        // the list must be emitted in this order otherwise the
        // chart color scheme will not map properly
        this.deviceSummary.emit(
          [
            {name: 'down', value: down},
            {name: 'busy', value: busy},
            {name: 'idle', value: idle}
          ]
        );
    });
  }

  ngOnDestroy() {
    this.killTrigger.next();
  }
}
