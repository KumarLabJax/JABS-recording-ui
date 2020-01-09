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

  /**
   * this sends a request to the control service requesting that this device begin/continue
   * to stream live video
   *
   * @param device - device that we want to view live stream of
   */
  public requestLiveStream(device: Device): Observable<any> {
    return this.http.get<any>(this.baseURL + `/stream/${device.id}`);
  }
}
