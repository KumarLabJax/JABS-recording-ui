import { Component, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { RecordingSession } from '../shared/recording-session';
import { RecordingSessionService } from '../services/recording-session.service';
import { Subject, timer } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatSnackBar, MatTable } from '@angular/material';
import { CancelConfirmationDialogComponent } from './cancel-confirmation-dialog/cancel-confirmation-dialog.component';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SessionTableComponent implements OnInit, OnDestroy {

  activeSessions: RecordingSession[] = [];
  columnsToDisplay = ['name', 'creation_time', 'duration', 'status', 'actions'];
  expandedElement: number | null = null;

  @ViewChild(MatTable, {static: false}) table: MatTable<RecordingSession>;

  // used to stop the timer when the component is destroyed
  private killTrigger: Subject<void> = new Subject();
  private readonly refreshRate = 10000;

  constructor(private recordingSessionService: RecordingSessionService,
              private snackbar: MatSnackBar,
              private dialog: MatDialog) { }


  /**
   * process a click on a delete icon for a completed/canceled session
   * @param session - which session the delete button was clicked on
   */
  onClickDelete(session) {
    this.recordingSessionService.archiveSession(session).subscribe(() => {
      this.removeSession(session);
    }, err => {
      this.openSnackbar('Error deleting session');
      console.error(err);
    });
  }

  /**
   * process a click on the cancel icon for a session
   * @param session - session to cancel
   */
  onClickCancel(session) {

    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        session.status = 'CANCELING...';
        this.recordingSessionService.cancelSession(session).subscribe(() => {
          session.status = 'CANCELED';
        }, err => {
          this.openSnackbar('Error canceling session');
          console.error(err);
        });
      }
    });
  }

  /**
   * handle user click on button to open live stream for a device
   * @param deviceId ID of device user wants to view
   */
  onClickOpenStream(deviceId: number) {
    // TODO: not yet implemented
  }

  /**
   * handle user click on cancel icon for device in recording session
   * @param sessionID session ID that the device is a member of
   * @param deviceStatus device session status object for device user wants to stop
   */
  onClickStopDevice(sessionID: number, deviceStatus: any) {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent,
      {data: {stop_device: true, device_name: deviceStatus.device_name}});

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        deviceStatus.status = 'CANCELING...';
        this.recordingSessionService.stopDevice(sessionID, deviceStatus.device_id).subscribe(() => {
          deviceStatus.status = 'CANCELED';
        }, err => {
          this.openSnackbar('Error canceling session on device ' + deviceStatus.name);
          console.error(err);
        });
      }
    });
  }

  /**
   * remove a session from our list of sessions, called after delete icon clicked
   * @param session - session to remove
   */
  removeSession(session) {
    this.activeSessions.forEach( (item: RecordingSession, index) => {
      if (item.id === session.id) {
        this.activeSessions.splice(index, 1);
      }
    });
    this.table.renderRows();
  }

  ngOnInit() {
    timer(0, this.refreshRate)
      .pipe(
        takeUntil(this.killTrigger),
        switchMap(() => this.recordingSessionService.getSessions())
      ).subscribe((data) => {

      this.activeSessions = data;
    });
  }

  /**
   * cleanup after this component is destroyed.
   * makes sure our timer used to refresh the list of sessions is stopped
   */
  ngOnDestroy() {
    this.killTrigger.next();
  }

  /**
   * expand a row, or collapse a row if it is already expanded
   * @param session - session that was clicked on in table
   */
  clickRow(session) {
    this.expandedElement = this.expandedElement === session.id ? null : session.id;
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

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  private static pad(num: number, size: number = 2): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  /**
   * format a duration in seconds in to a string in the format of DD:HH:MM:SS
   * @param value duration in seconds
   */
  transform(value: number): string {
    const days = Math.floor(value / 86400);
    value -= days * 86400;
    const hours = Math.floor(value / 3600);
    value -= hours * 3600;
    const minutes = Math.floor(value / 60);
    value -= minutes * 60;

    return DurationPipe.pad(days) + ':' + DurationPipe.pad(hours) + ':' + DurationPipe.pad(minutes) + ':' + DurationPipe.pad(value);

  }



}
