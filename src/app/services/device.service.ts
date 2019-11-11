import { Injectable } from '@angular/core';
import { Device } from '../shared/device';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private baseURL = environment.api + 'device';

  constructor(private http: HttpClient) { }

  public getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.baseURL).pipe(retry(3));
  }

  public getIdleDevices(): Observable<Device[]> {
    const parameters = new HttpParams().set('state', 'IDLE');
    return this.http.get<Device[]>(this.baseURL, {params: parameters}).pipe(retry(3));
  }
}
