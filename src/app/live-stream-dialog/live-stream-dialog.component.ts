import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { HlsjsPlyrDriver } from './hlsjs-plyr-driver';

@Component({
  selector: 'app-live-stream-dialog',
  templateUrl: './live-stream-dialog.component.html',
  styleUrls: ['./live-stream-dialog.component.css']
})
export class LiveStreamDialogComponent implements OnInit {
  // get the Plyr component from the page
  @ViewChild(PlyrComponent, {static: true}) plyr: PlyrComponent;

  hlsjsDriver = new HlsjsPlyrDriver(true);

  videoSource: Plyr.Source[];

  // player options
  // TODO: get aspect ratio from device rather than hard code 1:1
  options = {
    autoplay: true,
    controls: ['fullscreen'],
    ratio: '1:1'
  };

  constructor(
    public dialogRef: MatDialogRef<LiveStreamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    // TODO get the url for the stream from the server rather than build it here
    // this hard coded streaming server address will go away once above task is done,
    // but it requires server-side support
    this.videoSource = [
      {
        src: 'http://kumar-dell-7810.jax.org/' + this.data.device.name.toLowerCase() + '.m3u8',
        type: 'video'
      },
    ];
  }
}
