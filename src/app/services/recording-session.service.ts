import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

    const payload = {
      name: session.name,
      duration: session.duration,
      fragment_hourly: session.fragment_hourly,
      target_fps: session.target_fps,
      apply_filter: session.apply_filter,
      device_spec: session.device_spec
    };

    if (session.notes) {
      payload[`notes`] = session.notes;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    return this.http.post<RecordingSession>(this.baseURL, payload, {headers}).pipe(retry(3));

  }

  public getSessions() {
    return this.http.get<RecordingSession[]>(this.baseURL).pipe(retry(3));
  }

  public cancelSession(session: RecordingSession) {
    return this.http.delete<any>(this.baseURL + '/' + session.id).pipe(retry(3));
  }
  public archiveSession(session: RecordingSession) {
    const parameters = new HttpParams().set('archive', 'true');
    return this.http.delete<any>(this.baseURL + '/' + session.id, {params: parameters}).pipe(retry(3));
  }

}
