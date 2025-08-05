"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardSidebarNav, MobileBottomNav } from "@/components/dashboard/sidebar-nav";
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
} from "@/components/dashboard/time-range-selector";
import { useIsMobile } from "@/hooks/use-mobile";

interface SensorDisplayData extends SensorData {
  chartData: TrendChartData[];
}


function DashboardContent() {
  const [sensors, setSensors] = useState<SensorDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const isMobile = useIsMobile();

  useEffect(() => {
    setLoading(true);
    const devicesRef = ref(db, "sensors");

    const fetchData = async () => {
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
            startAt(startTime / 1000)
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
            time: new Date(reading.timestamp * 1000).toLocaleTimeString("en-GB", {
              timeZone: "Europe/London",
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }),
            temperature: reading.temp,
            humidity: reading.hum,
          }));

          return {
            deviceId: latestReading.deviceId,
            timestamp: latestReading.timestamp,
            temperature: latestReading.temp,
            humidity: latestReading.hum,
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

    fetchData();

    // Setup realtime listeners for card data
    const unsubscribes: (() => void)[] = [];
    get(devicesRef).then((snapshot) => {
        if (!snapshot.exists()) return;
        const deviceIds = Object.keys(snapshot.val());
        deviceIds.forEach(deviceId => {
            const deviceReadingsRef = ref(db, `sensors/${deviceId}`);
            const realtimeQuery = query(deviceReadingsRef, limitToLast(1));
            
            const unsubscribe = onChildAdded(realtimeQuery, (snapshot) => {
                if (snapshot.exists()) {
                    const newReading: RtdbSensorData = snapshot.val();
                    
                    setSensors(prevSensors => {
                        const sensorExists = prevSensors.some(s => s.deviceId === deviceId);
                        if (!sensorExists && prevSensors.length > 0) return prevSensors;

                        return prevSensors.map(sensor => {
                            if (sensor.deviceId === deviceId) {
                                return {
                                    ...sensor,
                                    temperature: newReading.temp,
                                    humidity: newReading.hum,
                                    safetyStatus: newReading.status,
                                    timestamp: newReading.timestamp,
                                };
                            }
                            return sensor;
                        });
                    });
                }
            });
            unsubscribes.push(unsubscribe);
        });
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    }

  }, [timeRange]);

  return (
    <>
      <Sidebar>
        <DashboardSidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto pb-20 md:pb-8">
          <Header timeRange={timeRange} onTimeRangeChange={setTimeRange} />
          <main className="mt-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sensors.map((sensor) => {
                return (
                  <React.Fragment key={sensor.deviceId}>
                    <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 rounded-xl bg-card/70 backdrop-blur-sm border border-border/20 p-4 flex flex-col gap-4">
                      <h3 className="text-lg font-headline flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary" />
                        {sensor.deviceId}
                      </h3>
                      <p className="text-sm text-muted-foreground italic">
                        Status: {sensor.safetyStatus}
                      </p>
                      <div className="flex-grow">
                         <DataCard
                          temperature={sensor.temperature}
                          humidity={sensor.humidity}
                          tempStatus="NORMAL"
                          humStatus="NORMAL"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 rounded-xl bg-card/70 backdrop-blur-sm border border-border/20 p-4 flex flex-col">
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
        {isMobile && <MobileBottomNav />}
      </SidebarInset>
    </>
  );
}


export default function DashboardPage() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  )
}
