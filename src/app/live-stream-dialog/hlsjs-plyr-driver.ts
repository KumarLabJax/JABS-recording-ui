/**
 * This driver is provided with the ngx-plyr HLS demo code in the ngx-plyr git repository. See the following copyright and license notice,
 * which only applies to the contents of this file and no other source code in this project.
 *
 * MIT License
 * Copyright (c) 2018 Semen Bobrov (smnbbrv) Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Hls from 'hls.js';
import Plyr from 'plyr';
import { PlyrDriver, PlyrDriverCreateParams, PlyrDriverDestroyParams, PlyrDriverUpdateSourceParams } from 'ngx-plyr';

/**
 * implement PlyrDriver for HLS video.
 * This driver is available in the demo code for ngx-plyr:
 * https://github.com/smnbbrv/ngx-plyr/tree/master/src/app/hlsjs-plyr-driver
 * and is licensed under the MIT open source license
 */
export class HlsjsPlyrDriver implements PlyrDriver {

  hls = new Hls();
  private loaded = false;

  constructor(private autoload: boolean) {}

  create(params: PlyrDriverCreateParams) {
    this.hls.attachMedia(params.videoElement);

    return new Plyr(params.videoElement, params.options);
  }

  updateSource(params: PlyrDriverUpdateSourceParams) {
    if (this.autoload) {
      this.load(params.source.sources[0].src);
    } else {
      // poster does not work with autoload
      params.videoElement.poster = params.source.poster;
    }
  }

  destroy(params: PlyrDriverDestroyParams) {
    params.plyr.destroy();
    this.hls.detachMedia();
  }

  load(src: string) {
    if (!this.loaded) {
      this.loaded = true;
      this.hls.loadSource(src);
    }
  }

}
