import { Component, Input, OnInit } from '@angular/core';
import { Device } from '../shared/device';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {


  @Input() device: Device;


  ngOnInit() {
  }

  public showDetails() {
    console.log(this.device);
  }



}
