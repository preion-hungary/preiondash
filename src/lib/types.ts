export interface SensorData {
  deviceId: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  hydrogen: number;
  hydrogenVoltage: number;
  safetyStatus: "NORMAL" | "CAUTION" | "DANGER";
  location: string;
}

export interface RtdbSensorData {
  deviceId: string;
  timestamp: number;
  temp: number;
  hum: number;
  h2: number;
  status: string;
}


export interface TrendChartData {
  time: string;
  temperature: number;
  humidity: number;
  hydrogen: number;
}
