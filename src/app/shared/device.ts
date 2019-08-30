export interface Location {
  name: string;
  parent: Location | null;
}

export interface Device {
  name: string;
  id: number;
  last_update: string;
  state: string;
  sensor_status: object;
  location?: Location;
}
