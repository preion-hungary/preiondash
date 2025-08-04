"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";
import { Header } from "@/components/dashboard/header";
import { DataCard } from "@/components/dashboard/data-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import type { RtdbSensorData, SensorData, TrendChartData } from "@/lib/types";
import { BarChart, Cpu } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue, get, query, limitToLast, orderByChild } from "firebase/database";

interface SensorDisplayData extends SensorData {
  chartData: TrendChartData[];
}

export default function DashboardPage() {
  const [sensors, setSensors] = useState<SensorDisplayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(db, 'sensors');
    const unsubscribes: (() => void)[] = [];

    get(devicesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const deviceIds = Object.keys(snapshot.val());

        if (deviceIds.length === 0) {
            setLoading(false);
            return;
        }

        deviceIds.forEach(deviceId => {
          const deviceReadingsRef = ref(db, `sensors/${deviceId}`);
          const recentReadingsQuery = query(
            deviceReadingsRef,
            orderByChild('timestamp'),
            limitToLast(12)
          );

          const unsubscribe = onValue(recentReadingsQuery, (readingSnapshot) => {
            if (readingSnapshot.exists()) {
              const readingsData = readingSnapshot.val();
              const readingsArray = Object.values<RtdbSensorData>(readingsData)
                .sort((a, b) => a.timestamp - b.timestamp);

              const latestReading = readingsArray[readingsArray.length - 1];

              if (latestReading) {
                const chartData = readingsArray.map((reading) => {
                   const timeLabel = new Date(reading.timestamp).toLocaleTimeString();
                   return {
                     time: timeLabel,
                     temperature: reading.temp,
                     humidity: reading.hum,
                     hydrogen: 0,
                   };
                });

                const sensorDisplayData: SensorDisplayData = {
                  deviceId: latestReading.deviceId,
                  timestamp: latestReading.timestamp,
                  temperature: latestReading.temp,
                  humidity: latestReading.hum,
                  hydrogen: 0,
                  safetyStatus: latestReading.status,
                  chartData: chartData,
                };

                setSensors(prevSensors => {
                  const existingSensorIndex = prevSensors.findIndex(s => s.deviceId === deviceId);
                  const newSensors = [...prevSensors];
                  if (existingSensorIndex > -1) {
                    newSensors[existingSensorIndex] = sensorDisplayData;
                  } else {
                    newSensors.push(sensorDisplayData);
                  }
                  return newSensors.sort((a, b) => a.deviceId.localeCompare(b.deviceId));
                });
              }
            }
            setLoading(false);
          }, (error) => {
              console.error(`Firebase read failed for device ${deviceId}: `, error);
              setLoading(false);
          });
          unsubscribes.push(unsubscribe);
        });
      } else {
        setLoading(false);
      }
    }).catch(error => {
        console.error("Firebase device list read failed: ", error);
        setLoading(false);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardSidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
          <Header />
          <main className="mt-8">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sensors.map((sensor) => {
                return (
                  <React.Fragment key={sensor.deviceId}>
                    <div className="lg:col-span-2 xl:col-span-2 rounded-xl bg-card/70 backdrop-blur-sm border border-border/20 p-4 flex flex-col gap-4">
                       <h3 className="text-lg font-headline flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary"/>
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
                           <BarChart className="w-5 h-5 text-primary"/>
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
                <p className="text-muted-foreground">No sensor data found in the database.</p>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
