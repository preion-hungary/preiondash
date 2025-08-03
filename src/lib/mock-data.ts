import type { SensorData, TrendChartData } from "./types";

export const SENSOR_DATA: SensorData[] = [
  {
    deviceId: "PreionBoard001",
    timestamp: 1634567890,
    temperature: 23.5,
    humidity: 65.2,
    hydrogen: 245,
    hydrogenVoltage: 2.1,
    safetyStatus: "NORMAL",
    location: "Building A - Room 101",
  },
  {
    deviceId: "PREIONPRO_002",
    timestamp: 1634567990,
    temperature: 24.1,
    humidity: 66.8,
    hydrogen: 850,
    hydrogenVoltage: 2.8,
    safetyStatus: "CAUTION",
    location: "Building A - Room 102",
  },
  {
    deviceId: "AQT_LAB_01",
    timestamp: 1634568090,
    temperature: 22.9,
    humidity: 63.1,
    hydrogen: 150,
    hydrogenVoltage: 1.9,
    safetyStatus: "NORMAL",
    location: "Laboratory Sector B",
  },
  {
    deviceId: "STOR_UNIT_5",
    timestamp: 1634568190,
    temperature: 25.5,
    humidity: 70.5,
    hydrogen: 1105,
    hydrogenVoltage: 3.5,
    safetyStatus: "DANGER",
    location: "Storage Unit 5",
  },
];

export const CHART_DATA: TrendChartData[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  temperature: parseFloat((23 + Math.sin(i / 3) * 2 + Math.random()).toFixed(1)),
  humidity: parseFloat((65 + Math.cos(i / 4) * 5 + Math.random() * 2).toFixed(1)),
  hydrogen: Math.floor(200 + Math.sin(i/2) * 50 + Math.random() * 100),
}));
