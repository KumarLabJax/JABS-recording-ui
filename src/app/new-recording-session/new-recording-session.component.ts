import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '../shared/device';
import { DeviceService } from '../services/device.service';
import { first } from 'rxjs/operators';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatSliderChange, MatSnackBar } from '@angular/material';
import { RecordingSessionService } from '../services/recording-session.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RecordingSession } from '../shared/recording-session';
import { FileprefixGroupSetDialogComponent } from './fileprefix-group-set-dialog/fileprefix-group-set-dialog.component';

@Component({
  selector: 'app-new-recording-session',
  templateUrl: './new-recording-session.component.html',
  styleUrls: ['./new-recording-session.component.css']
})
export class NewRecordingSessionComponent implements OnInit {

  public allDevices: Device[];
  public filteredDevices: Device[] = [];
  public selectedDevices: Device[] = [];
  public fpsLabel = 30;
  public hideNonIdle = true;

  private filter = '';

  // the new recording session form consists of a stepper with three sections
  // each section has it's own form group (continuing to the next section depends on the previous
  // section's form group being valid)

  // form group for collecting metadata about recording session
  metadataForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  // form group for collecing basic information about the recording session
  newSessionForm = new FormGroup({
    days: new FormControl(0, [Validators.min(0), Validators.max(16)]),
    hours: new FormControl(0, [Validators.min(0), Validators.max(23)]),
    minutes: new FormControl(0, [Validators.min(0), Validators.max(59)]),
    seconds: new FormControl(0, [Validators.min(0), Validators.max(59)]),
    fragmentHourly: new FormControl(true)
  }, (formGroup: FormGroup) => {
    return NewRecordingSessionComponent.validateSettings(formGroup);
  });

  // form group for advanced settings (typically left as defaults)
  advancedSettingsForm = new FormGroup({
    targetFps: new FormControl(this.fpsLabel),
    applyFilter: new FormControl(true)
  });

  // form group for filename prefixes
  filenameForm = new FormGroup({});

  constructor(private deviceService: DeviceService,
              private recordingSessionService: RecordingSessionService,
              private snackbar: MatSnackBar,
              private router: Router,
              private location: Location,
              private dialog: MatDialog) { }

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
    // get list of all devices
    this.deviceService.getDevices().pipe(first()).subscribe(
      (data) => {
        this.allDevices = data;

        // make sure list of devices is sorted by name
        this.allDevices.sort((a, b) => a.name.localeCompare(b.name));

        // setup filtered list
        this.filteredDevices = this.allDevices.filter(this.filterCallback, this);
      }, err => {
        console.error('error getting devices');
      }
    );
  }

  /**
   * action to perform upon "Submit" button click: sends request to create new
   * recording session to backend, opens snackbar to display results. Will navigate to
   * dashboard if submission was successful.
   */
  submit() {
    this.recordingSessionService.createNewSession(this.session()).subscribe(() => {
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
    // only do something if the device was dropped onto a different container
    if (event.previousContainer !== event.container) {
      const device: Device = event.previousContainer.data[event.previousIndex];

      // move the device from one array to another
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      // sort the array the item is being moved into
      event.container.data.sort((a, b) => a.name.localeCompare(b.name));

      if (event.container.data === this.filteredDevices) {
        // if the destination was filteredDevices, refilter it's possible that the device should
        // be hidden with the current value in the device filter
        this.filteredDevices = this.allDevices.filter(this.filterCallback, this);
        // remove this device from the filename form
        this.filenameForm.removeControl(device.name);
      } else {
        // device is added to selected devices, add it to the form group
        this.filenameForm.addControl(device.name, new FormControl('video_recording', Validators.required));
      }
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

    const newSession = {
      name: this.metadataForm.value.name,
      duration,
      fragment_hourly: this.newSessionForm.value.fragmentHourly,
      target_fps: this.advancedSettingsForm.value.targetFps,
      apply_filter: this.advancedSettingsForm.value.applyFilter,
      device_spec: []
    };

    this.selectedDevices.forEach(d => {
      newSession.device_spec.push({device_id: d.id, filename_prefix: this.filenameForm.controls[d.name].value});
    });

    return newSession;
  }

  /**
   * this is a callback function to pass the array.filter() method to filter
   * our list of devices
   */
  public filterCallback(element) {
    if (this.hideNonIdle && element.state !== 'IDLE') {
      return false;
    }
    if (this.selectedDevices.indexOf(element) >= 0 ) {
      return false;
    }
    return (
      !this.filter ||
      element.name.toLowerCase().indexOf(this.filter) >= 0 ||
      element.location.toLowerCase().indexOf(this.filter) >= 0
    );
  }

  /**
   * update the filter value
   * @param event keyup event from filter input field
   */
  public updateFilter(event) {
    this.filter = event.target.value.trim().toLowerCase();

    if (this.allDevices.length) {
      this.filteredDevices = this.allDevices.filter(this.filterCallback, this);
    }
  }

  /**
   * handle change in the idle filter toggle switch
   * @param event - change event
   */
  toggleIdleFilter(event) {
    this.hideNonIdle = event.checked;

    // refilter list of devices based on new value of switch
    if (this.allDevices.length) {
      this.filteredDevices = this.allDevices.filter(this.filterCallback, this);
    }
  }

  /**
   * assign all devices currently listed in the available device list
   */
  public assignAll() {
    const unassignable: Device[] = [];
    // for each device in the filteredDevices list, add to selectedDevices and add a FormControl to the filenameForm
    this.filteredDevices.forEach(d => {
      if (d.state === 'IDLE') {
        this.selectedDevices.push(d);
        this.filenameForm.addControl(d.name, new FormControl('video_recording', Validators.required));
      } else {
        unassignable.push(d);
      }
    });

    // re-sort selectedDevices list
    this.selectedDevices.sort((a, b) => a.name.localeCompare(b.name));

    // set filteredDevices to anything that couldn't be assigned
    this.filteredDevices = unassignable;
  }

  /**
   * handle clicking on the bulk filename assignment button
   */
  public clickBulkFilenameAssignment() {

    // open a dialog for the user to enter a list of filenames
    const dialogRef = this.dialog.open(FileprefixGroupSetDialogComponent, {
      data: {expectedCount: this.selectedDevices.length}
    });

    // wait for the dialog to close
    dialogRef.afterClosed().subscribe(response => {
      // if a response was returned (user clicked "SAVE")
      if (response) {
        // split the contents of the textarea into lines
        const lines = response.split(/\r*\n/);
        // ignore the last line if it was all whitespace (user may have pressed enter after their last filename)
        if (lines[lines.length - 1].trim().length === 0) {
          lines.pop();
        }

        // iterate over each remaining line and set the corresponding device filename to that value
        lines.forEach((l: string, index: number) => {
          // remove characters that might cause issues for filenames
          const filename = l.replace(/[.*+?^${}()|[\]\\\s]/g, '');
          this.filenameForm.controls[this.selectedDevices[index].name].setValue(filename);
        });
      }
    });
  }
}
