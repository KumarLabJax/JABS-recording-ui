import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '../shared/device';
import { DeviceService } from '../services/device.service';
import { first } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSliderChange, MatSnackBar } from '@angular/material';
import { RecordingSessionService } from '../services/recording-session.service';

@Component({
  selector: 'app-new-recording-session',
  templateUrl: './new-recording-session.component.html',
  styleUrls: ['./new-recording-session.component.css']
})
export class NewRecordingSessionComponent implements OnInit {

  public disableSubmit = true;
  public idleDevices: Device[];
  public selectedDevices: Device[] = [];
  public fpsLabel = 30;

  metadataForm = new FormGroup({
    name: new FormControl('', Validators.required),
    notes: new FormControl()
  });

  newSessionForm = new FormGroup({
    days: new FormControl(0, [Validators.min(0), Validators.max(14)]),
    hours: new FormControl(0, [Validators.min(0), Validators.max(23)]),
    minutes: new FormControl(0, [Validators.min(0), Validators.max(59)]),
    seconds: new FormControl(0, [Validators.min(0), Validators.max(59)]),
    filePrefix: new FormControl(),
    fragmentHourly: new FormControl(true)
  }, (formGroup: FormGroup) => {
    return NewRecordingSessionComponent.validateSettings(formGroup);
  });

  advancedSettingsForm = new FormGroup({
    targetFps: new FormControl(this.fpsLabel),
    applyFilter: new FormControl(true)
  });

  constructor(private deviceService: DeviceService,
              private recordingSessionService: RecordingSessionService,
              private snackbar: MatSnackBar) { }

  static validateSettings(group: FormGroup) {

    const days = group.controls[`days`].value;
    const hours = group.controls[`hours`].value;
    const minutes = group.controls[`minutes`].value;
    const seconds = group.controls[`seconds`].value;

    if ((days + hours + minutes + seconds) === 0) {
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
      }, err => {
        console.error('error getting idle devices: ', err);
      }
    );
  }

  submit() {

    const duration = (
      this.newSessionForm.value.days * 86400 +
      this.newSessionForm.value.hours * 3600 +
      this.newSessionForm.value.minutes * 60 +
      this.newSessionForm.value.seconds
    );

    this.recordingSessionService.createNewSession(
      this.selectedDevices,
      this.metadataForm.value.name,
      this.metadataForm.value.notes,
      duration,
      this.newSessionForm.value.filePrefix,
      this.newSessionForm.value.fragmentHourly,
      this.advancedSettingsForm.value.targetFps,
      this.advancedSettingsForm.value.applyFilter
    ).subscribe(result => {
      this.openSnackbar('Recording Session Created');
    }, err => {
      this.openSnackbar('Error creating recording session');
      console.error(err);
    });

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

  onFpsChange(event: MatSliderChange) {
    this.fpsLabel = event.value;
  }

  onHourChange(value) {
    if (value === 24) {
      this.newSessionForm.controls[`hours`].setValue(0);
      this.newSessionForm.controls[`days`].setValue(this.newSessionForm.value.days + 1);
    }
  }

  onMinuteChange(value) {
    if (value === 60) {
      this.newSessionForm.controls[`minutes`].setValue(0);
      this.newSessionForm.controls[`hours`].setValue(this.newSessionForm.value.hours + 1);
    }
  }

  onSecondChange(value) {
    if (value === 60) {
      this.newSessionForm.controls[`seconds`].setValue(0);
      this.newSessionForm.controls[`minutes`].setValue(this.newSessionForm.value.minutes + 1);
    }
  }

  /**
   * open a snackbar with a default configuration
   * @param message string message to display in the snackbar
   * @param duration time to show the message in milliseconds
   */
  private openSnackbar(message: string, duration: number = 6000) {
    this.snackbar.open(message, 'CLOSE', {duration});
  }


}
