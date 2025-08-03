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

export interface TrendChartData {
  time: string;
  temperature: number;
  humidity: number;
  hydrogen: number;
}
