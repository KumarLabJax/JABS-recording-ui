import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RecordingSession } from '../shared/recording-session';

@Injectable({
  providedIn: 'root'
})
export class RecordingSessionService {

  private baseURL = environment.api + 'recording-session';

  constructor(private http: HttpClient) { }

  public createNewSession(session: RecordingSession) {

    const ids: number[] = [];

    session.devices.forEach(d => {
      ids.push(d.id);
    });

    const payload = {
      name: session.name,
      duration: session.duration,
      fragment_hourly: session.fragmentHourly,
      target_fps: session.targetFps,
      apply_filter: session.applyFilter,
      device_ids: ids
    };

    if (session.notes) {
      payload[`notes`] = session.notes;
    }

    if (session.filePrefix) {
      payload[`file_prefix`] = session.filePrefix;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    return this.http.post<RecordingSession>(this.baseURL, payload, {headers}).pipe(retry(3));

  }
}
