
export interface RecordingSession {
  name: string;
  duration: number;
  fragment_hourly: boolean;
  target_fps: number;
  apply_filter: boolean;
  creation_time?: string;
  device_statuses?: object;
  id?: number;
  status?: string;
  device_spec?: {device_id: number, filename_prefix: string}[];
}
