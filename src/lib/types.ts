export interface SensorData {
  deviceId: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  hydrogen: number;
  safetyStatus: "NORMAL" | "CAUTION" | "DANGER" | "ALERT!" | "WARNING";
}

export interface RtdbSensorData {
  deviceId: string;
  timestamp: number;
  temp: number;
  hum: number;
  h2: number;
  status: "NORMAL" | "CAUTION" | "DANGER" | "ALERT!" | "WARNING";
}


export interface TrendChartData {
  time: string;
  temperature: number;
  humidity: number;
  hydrogen: number;
}
