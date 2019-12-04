export interface SysInfo {
  uptime: number;
  free_disk: number;
  total_disk: number;
  free_ram: number;
  total_ram: number;
  load: number;
}

export interface Device {
  name: string;
  id: number;
  location?: string;
  last_update: string;
  state: string;
  sensor_status: object;
  system_info: SysInfo;
}
