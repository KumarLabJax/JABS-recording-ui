import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { HlsjsPlyrDriver } from './hlsjs-plyr-driver';
import { Observable, of, Subject, Subscription, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { retryStrategy } from './delayed-retry';
import { catchError, retryWhen, switchMap, takeUntil } from 'rxjs/operators';
import { DeviceService } from '../services/device.service';

@Component({
  selector: 'app-live-stream-dialog',
  templateUrl: './live-stream-dialog.component.html',
  styleUrls: ['./live-stream-dialog.component.css']
})
export class LiveStreamDialogComponent implements OnInit, OnDestroy {
  // get the Plyr component from the page
  @ViewChild(PlyrComponent, {static: false}) plyr: PlyrComponent;

  // driver for plyr to configure it to play HLS video
  hlsjsDriver = new HlsjsPlyrDriver(true);

  // plyr video source, will be set to device HLS live stream url
  videoSource: Plyr.Source[] = [];

  // booleans that control how the dialog is displayed
  err = false;
  loading = true;

  // used to stop the timer when the component is destroyed or we no longer need it
  private killTrigger: Subject<void> = new Subject();

  // used to manage a subscription that checks the HLS playlist url and retries until
  // we get a 200 http response or we time out (if the device wasn't streaming, it
  // will take a moment for the streaming command to make it's way to the device)
  private checkSourceSub: Subscription;

  // player options
  // TODO: get aspect ratio from device rather than hard code 1:1 (requires server support)
  options = {
    autoplay: true,
    controls: ['fullscreen'],
    ratio: '1:1',
    muted: true
  };

  constructor(
    private deviceService: DeviceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<LiveStreamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {

    // TODO get the url for the stream from the server rather than build it here
    // this hard coded streaming server address will go away once above task is done,
    // but it requires server-side support
    const url = `http://kumar-dell-7810.jax.org/${this.data.device.name.toLowerCase()}.m3u8`;

    // source for plyr
    const source = [
      {
        src: url,
        type: 'video'
      }
    ];

    // request that the stream for this device be kept alive
    // we send the request every 5 seconds, which is sufficient for the server to keep
    // the stream going
    timer(0, 5000)
      .pipe(
        takeUntil(this.killTrigger),
        switchMap(() => this.deviceService.requestLiveStream(this.data.device))
      ).subscribe(() => {
        // we successfully requested the live stream, now check to make sure
        // the HLS m3u8 playlist exists
        // retry up to 60 times with default delay (1000ms) between retries

        // since we continuously make the request on a timer to keep the stream alive,
        // make sure checkSourceSub hasn't already been initialized (we only want to set
        // this up after the first successful request for the stream)
        if (!this.checkSourceSub) {
          this.checkSourceSub = this.checkSource(url)
            .pipe(retryWhen(retryStrategy({maxRetryAttempts: 60})), catchError(error => of(error)))
            .subscribe(resp => {
              // we have a response or we are done retrying
              this.loading = false;
              if (resp.status === 200) {
                this.videoSource = source;
              } else {
                // we never got a 200 response, the stream isn't available
                this.err = true;
              }}, err => {
                // the observable threw some other type of error
                this.loading = false;
                console.error(err);
                this.err = true;
            });
        }
      }, err => {
        console.error('unable to request live stream');
        this.err = true;
        this.loading = false;
      }
    );
  }

  onClickClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.checkSourceSub) {
      this.checkSourceSub.unsubscribe();
    }
    this.killTrigger.next();
  }

  private checkSource(source: string): Observable<any> {
    return this.http.get(source, {observe: 'response', responseType: 'text'});
  }
}
