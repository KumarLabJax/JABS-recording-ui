import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '../shared/device';
import { DeviceService } from '../services/device.service';
import { first } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSliderChange, MatSnackBar } from '@angular/material';
import { RecordingSessionService } from '../services/recording-session.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RecordingSession } from '../shared/recording-session';

@Component({
  selector: 'app-new-recording-session',
  templateUrl: './new-recording-session.component.html',
  styleUrls: ['./new-recording-session.component.css']
})
export class NewRecordingSessionComponent implements OnInit {

  public idleDevices: Device[];
  public filteredDevices: Device[] = [];
  public selectedDevices: Device[] = [];
  public fpsLabel = 30;

  private filter = '';

  // the new recording session form consists of a stepper with three sections
  // each section has it's own form group (continuing to the next section depends on the previous
  // section's form group being valid)

  // form group for collecting metadata about recording session
  metadataForm = new FormGroup({
    name: new FormControl('', Validators.required),
    notes: new FormControl()
  });

  // form group for collecing basic information about the recording session
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

  // form group for advanced settings (typically left as defaults)
  advancedSettingsForm = new FormGroup({
    targetFps: new FormControl(this.fpsLabel),
    applyFilter: new FormControl(true)
  });

  constructor(private deviceService: DeviceService,
              private recordingSessionService: RecordingSessionService,
              private snackbar: MatSnackBar,
              private router: Router,
              private location: Location) { }

  /**
   * custom validator for duration (days, hours, minutes, seconds) fields:
   * makes sure that the duration is not zero (at least one field is non-zero).
   * @param group FormGroup containing the duration form fields
   */
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
        this.filteredDevices = this.idleDevices.filter(this.filterCallback, this);
      }, err => {
        console.error('error getting idle devices: ', err);
      }
    );
  }

  /**
   * action to perform upon "Submit" button click: sends request to create new
   * recording session to backend, opens snackbar to display results. Will navigate to
   * dashboard if submission was successful.
   */
  submit() {

    this.recordingSessionService.createNewSession(this.session()).subscribe(result => {
      this.openSnackbar('Recording Session Created');
      this.router.navigateByUrl('/dashboard');
    }, err => {
      this.openSnackbar('Error creating recording session');
      console.error(err);
    });

  }

  /**
   * action performed when user clicks "Cancel" button
   */
  cancel() {
    this.location.back();
  }

  /**
   * used by the device selection drag/drop to implement the drop behavior
   * @param event DragDrop event
   */
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

  /**
   * update the displayed frames per second label as the user changes the slider value
   * @param event MatSliderChange event containing new value to display
   */
  onFpsChange(event: MatSliderChange) {
    this.fpsLabel = event.value;
  }

  /**
   * when the hours changes check if value becomes 24 roll over to zero and increment days
   * @param value current value after change
   */
  onHourChange(value) {
    if (value === 24) {
      this.newSessionForm.controls[`hours`].setValue(0);
      this.newSessionForm.controls[`days`].setValue(this.newSessionForm.value.days + 1);
    }
  }

  /**
   * when minutes changes if value becomes 60 roll over to zero and increment hours
   * @param value current value after change
   */
  onMinuteChange(value) {
    if (value === 60) {
      this.newSessionForm.controls[`minutes`].setValue(0);
      this.newSessionForm.controls[`hours`].setValue(this.newSessionForm.value.hours + 1);
    }
  }

  /**
   * when seconds changes if value becomes 60 roll over to zero and increment minutes
   * @param value current value after change
   */
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

  /**
   * return a RecordingSession object using the current form value
   */
  private session(): RecordingSession {
    const duration = (
      this.newSessionForm.value.days * 86400 +
      this.newSessionForm.value.hours * 3600 +
      this.newSessionForm.value.minutes * 60 +
      this.newSessionForm.value.seconds
    );

    return {
      devices: this.selectedDevices,
      name: this.metadataForm.value.name,
      notes: this.metadataForm.value.notes,
      duration,
      filePrefix: this.newSessionForm.value.filePrefix,
      fragmentHourly: this.newSessionForm.value.fragmentHourly,
      targetFps: this.advancedSettingsForm.value.targetFps,
      applyFilter: this.advancedSettingsForm.value.applyFilter
    };
  }

  /**
   * this is a callback function to pass the array.filter() method to filter
   * our list of devices
   */
  public filterCallback(element) {
    console.log(this.filter);
    return !this.filter || this.filter && element.name.toLowerCase().indexOf(this.filter) >= 0;
  }

  public updateFilter(event) {
    this.filter = event.target.value.trim().toLowerCase();

    if (this.idleDevices.length) {
      this.filteredDevices = this.idleDevices.filter(this.filterCallback, this);
    }
  }
}
