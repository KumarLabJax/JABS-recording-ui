import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RecordingSession } from '../shared/recording-session';
import { Device } from '../shared/device';

@Injectable({
  providedIn: 'root'
})
export class RecordingSessionService {

  private baseURL = environment.api + 'recording-session';

  constructor(private http: HttpClient) { }

  public createNewSession(
    devices: Device[],
    name: string,
    notes: string,
    duration: number,
    filePrefix: string,
    fragmentHourly: boolean,
    targetFps: number,
    applyFilter: boolean) {

    const ids: number[] = [];

    devices.forEach(d => {
      ids.push(d.id);
    });

    const payload = {
      name,
      duration,
      fragment_hourly: fragmentHourly,
      target_fps: targetFps,
      apply_filter: applyFilter,
      device_ids: ids
    };

    if (notes) {
      payload[`notes`] = notes;
    }

    if (filePrefix) {
      payload[`file_prefix`] = filePrefix;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    return this.http.post<RecordingSession>(this.baseURL, payload, {headers}).pipe(retry(3));

  }
}
