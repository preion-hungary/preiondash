"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";
import { Header } from "@/components/dashboard/header";
import { DataCard } from "@/components/dashboard/data-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import type { RtdbSensorData, SensorData, TrendChartData } from "@/lib/types";
import { BarChart, Cpu } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  ref,
  onValue,
  get,
  query,
  limitToLast,
  orderByChild,
  startAt,
  onChildAdded,
} from "firebase/database";
import {
  TimeRange,
  TimeRangeSelector,
} from "@/components/dashboard/time-range-selector";

interface SensorDisplayData extends SensorData {
  chartData: TrendChartData[];
}

export default function DashboardPage() {
  const [sensors, setSensors] = useState<SensorDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  useEffect(() => {
    setLoading(true);
    const devicesRef = ref(db, "sensors");
    const unsubscribes: (() => void)[] = [];

    const fetchInitialData = async () => {
      try {
        const deviceListSnapshot = await get(devicesRef);
        if (!deviceListSnapshot.exists()) {
          setLoading(false);
          setSensors([]);
          return;
        }

        const deviceIds = Object.keys(deviceListSnapshot.val());
        const sensorPromises = deviceIds.map(async (deviceId) => {
          const deviceReadingsRef = ref(db, `sensors/${deviceId}`);
          const now = Date.now();
          let startTime = 0;

          switch (timeRange) {
            case "1h":
              startTime = now - 3600 * 1000;
              break;
            case "24h":
              startTime = now - 86400 * 1000;
              break;
            case "7d":
              startTime = now - 604800 * 1000;
              break;
            case "30d":
              startTime = now - 2592000 * 1000;
              break;
            case "all":
            default:
              startTime = 0;
              break;
          }

          const readingsQuery = query(
            deviceReadingsRef,
            orderByChild("timestamp"),
            startAt(startTime)
          );

          const readingSnapshot = await get(readingsQuery);
          if (!readingSnapshot.exists()) return null;

          const readingsData = readingSnapshot.val();
          const readingsArray = Object.values<RtdbSensorData>(readingsData).sort(
            (a, b) => a.timestamp - b.timestamp
          );

          if (readingsArray.length === 0) return null;

          const latestReading = readingsArray[readingsArray.length - 1];

          const chartData = readingsArray.map((reading) => ({
            time: new Date(reading.timestamp).toLocaleTimeString("en-GB", {
              timeZone: "Europe/London",
            }),
            temperature: reading.temp,
            humidity: reading.hum,
            hydrogen: 0,
          }));

          // Set up listener for new data
          const lastTimestamp = latestReading.timestamp;
          const newReadingsQuery = query(
            deviceReadingsRef,
            orderByChild("timestamp"),
            startAt(lastTimestamp + 1)
          );

          const unsubscribe = onChildAdded(newReadingsQuery, (newReadingSnapshot) => {
            if (newReadingSnapshot.exists()) {
              const newReading: RtdbSensorData = newReadingSnapshot.val();
              setSensors((prevSensors) => {
                return prevSensors.map((sensor) => {
                  if (sensor.deviceId === newReading.deviceId) {
                    const newChartData = {
                      time: new Date(newReading.timestamp).toLocaleTimeString("en-GB", {
                        timeZone: "Europe/London",
                      }),
                      temperature: newReading.temp,
                      humidity: newReading.hum,
                      hydrogen: 0,
                    };
                    return {
                      ...sensor,
                      temperature: newReading.temp,
                      humidity: newReading.hum,
                      hydrogen: 0,
                      safetyStatus: newReading.status,
                      timestamp: newReading.timestamp,
                      chartData: [...sensor.chartData, newChartData],
                    };
                  }
                  return sensor;
                });
              });
            }
          });
          unsubscribes.push(unsubscribe);


          return {
            deviceId: latestReading.deviceId,
            timestamp: latestReading.timestamp,
            temperature: latestReading.temp,
            humidity: latestReading.hum,
            hydrogen: 0,
            safetyStatus: latestReading.status,
            chartData: chartData,
          };
        });

        const newSensors = (await Promise.all(sensorPromises))
          .filter((s): s is SensorDisplayData => s !== null)
          .sort((a, b) => a.deviceId.localeCompare(b.deviceId));

        setSensors(newSensors);
      } catch (error) {
        console.error("Firebase read failed: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [timeRange]);

  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardSidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
          <Header timeRange={timeRange} onTimeRangeChange={setTimeRange} />
          <main className="mt-8">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sensors.map((sensor) => {
                return (
                  <React.Fragment key={sensor.deviceId}>
                    <div className="lg:col-span-2 xl:col-span-2 rounded-xl bg-card/70 backdrop-blur-sm border border-border/20 p-4 flex flex-col gap-4">
                      <h3 className="text-lg font-headline flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary" />
                        {sensor.deviceId}
                      </h3>
                      <p className="text-sm text-muted-foreground italic">
                        Status: {sensor.safetyStatus}
                      </p>
                      <div className="grid grid-cols-2 gap-4 flex-grow">
                        <DataCard
                          title="Temperature"
                          value={sensor.temperature}
                          unit="°C"
                          status="NORMAL"
                        />
                        <DataCard
                          title="Humidity"
                          value={sensor.humidity}
                          unit="%"
                          status="NORMAL"
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-1 xl:col-span-2 rounded-xl bg-card/70 backdrop-blur-sm border border-border/20 p-4 flex flex-col">
                      <h3 className="text-lg font-headline flex items-center gap-2 mb-4">
                        <BarChart className="w-5 h-5 text-primary" />
                        Data Trends
                      </h3>
                      <div className="flex-grow">
                        <TrendChart data={sensor.chartData} />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            {loading && (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading sensor data...</p>
              </div>
            )}
            {!loading && sensors.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                  No sensor data found for the selected time range.
                </p>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
