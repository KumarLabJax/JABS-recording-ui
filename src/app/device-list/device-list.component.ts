import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
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
export class DeviceListComponent implements OnInit, OnDestroy, OnChanges {

  // time in milliseconds between API calls to get updated device information
  // TODO make this configurable
  private readonly refreshRate = 5000;

  // used to stop the timer when the component is destroyed
  private killTrigger: Subject<void> = new Subject();

  // list of devices to be displayed
  public devices: Device[] = [];
  public filteredDevices: Device[] = [];

  // map for quick access to devices by name
  private deviceMap = new Map();

  // output to a summary for use by the dashboard
  @Output() deviceSummary = new EventEmitter<DeviceCount[]>();

  // filter string input from the dashboard
  @Input() filter: string;

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

          // get counts of the number of devices in each state
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
            // this is a device we don't know about yet, add it to the list
            this.devices.push(d);
            this.deviceMap.set(d.name, this.devices[this.devices.length - 1]);
          } else {
            // we've seen this one before, look it up by name and update the existing object
            const device = this.deviceMap.get(d.name);
            for (const key of Object.keys(d)) {
              device[key] = d[key];
            }
          }
        }

        this.filterDevices();

        // the summary must be emitted in this order (down, busy, idle) otherwise the
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

  ngOnChanges() {
    this.filterDevices();
  }

  ngOnDestroy() {
    this.killTrigger.next();
  }

  /*
  this function is called any time the filter input changes or we get updated
  information about the devices from the server
  */
  public filterDevices() {
    if (this.filter !== undefined && this.filter.length > 0) {
      this.filteredDevices = this.devices.filter(this.filterCallback, this);
    } else {
      this.filteredDevices = this.devices;
    }
  }

  /*
  this is a callback function to pass the array.filter() method to filter
  our list of devices
   */
  public filterCallback(element, index, array) {
    return element.name.toLowerCase().indexOf(this.filter) !== -1 ||
      element.state.toLowerCase().indexOf(this.filter) !== -1;

  }
}
