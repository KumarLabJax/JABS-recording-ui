import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { HlsjsPlyrDriver } from '../hlsjs-plyr-driver';

@Component({
  selector: 'app-live-stream-dialog',
  templateUrl: './live-stream-dialog.component.html',
  styleUrls: ['./live-stream-dialog.component.css']
})
export class LiveStreamDialogComponent implements OnInit {
  @ViewChild(PlyrComponent, {static: true}) plyr: PlyrComponent;

  hlsjsDriver = new HlsjsPlyrDriver(true);

  videoSource: Plyr.Source[];

  options = {
    autoplay: true,
    controls: ['play-large', 'play', 'progress', 'current-time', 'fullscreen'],
    ratio: '1:1'
  };

  constructor(
    public dialogRef: MatDialogRef<LiveStreamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    // TODO we will eventually get the src from the server rather that build it here
    this.videoSource = [
      {
        src: 'http://kumar-dell-7810.jax.org/' + this.data.device.name.toLowerCase() + '.m3u8',
        type: 'video'
      },
    ];
  }

  played(event: Plyr.PlyrEvent) {
    console.log('played');
  }

  play(): void {
    this.plyr.player.play();
  }
}
