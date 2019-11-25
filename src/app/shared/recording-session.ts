
export interface RecordingSession {
  name: string;
  notes?: string;
  duration: number;
  fragment_hourly: boolean;
  target_fps: number;
  apply_filter: boolean;
  device_ids?: number[];
  creation_time?: string;
  device_statuses?: object;
  id?: number;
  status?: string;
  file_prefixes?: { [id: number]: string};
}
