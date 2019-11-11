import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '../shared/device';
import { DeviceService } from '../services/device.service';
import { first } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-new-recording-session',
  templateUrl: './new-recording-session.component.html',
  styleUrls: ['./new-recording-session.component.css']
})
export class NewRecordingSessionComponent implements OnInit {

  public disableSubmit = true;
  public idleDevices: Device[];
  public selectedDevices: Device[] = [];

  metadataForm = new FormGroup({
    name: new FormControl('', Validators.required),
    notes: new FormControl()
  });

  newSessionForm = new FormGroup({
    hours: new FormControl(0, [Validators.min(0)]),
    minutes: new FormControl(0, [Validators.min(0)]),
    seconds: new FormControl(0, [Validators.min(0)]),
    filePrefix: new FormControl(),
    fragmentHourly: new FormControl(true)
  }, (formGroup: FormGroup) => {
    return NewRecordingSessionComponent.validateSettings(formGroup);
  });

  constructor(private deviceService: DeviceService) { }

  static validateSettings(group: FormGroup) {

    const hours = group.controls[`hours`].value;
    const minutes = group.controls[`minutes`].value;
    const seconds = group.controls[`seconds`].value;

    if ((hours + minutes + seconds) === 0) {
      return {
        validateDuration: {
          valid: false
        }
      };
    }

    return null;
  }

  ngOnInit() {
    this.deviceService.getIdleDevices().pipe(first()).subscribe(
      (data) => {
        this.idleDevices = data;
        console.log(this.idleDevices);
      }, err => {
        console.error('error getting idle devices: ', err);
      }
    );
  }

  submit() {

  }

  cancel() {
  }

  drop(event: CdkDragDrop<Device[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
