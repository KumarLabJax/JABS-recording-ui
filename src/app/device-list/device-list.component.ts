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

  private readonly refreshRate = 10000;
  private killTrigger: Subject<void> = new Subject();

  devices: Device[] = [];

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    timer(0, this.refreshRate)
      .pipe(
        takeUntil(this.killTrigger),
        switchMap(() => this.deviceService.getDevices())
      ).subscribe((data) => {
        this.devices = data;
    });
  }

  ngOnDestroy(){
    this.killTrigger.next();
  }
}
