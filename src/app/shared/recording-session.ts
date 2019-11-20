import { Device } from './device';

export interface RecordingSession {
  name: string;
  notes?: string;
  duration: number;
  filePrefix: string;
  fragmentHourly: boolean;
  targetFps: number;
  applyFilter: boolean;
  devices?: Device[];
}
