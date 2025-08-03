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
import { ref, onValue } from "firebase/database";

export default function DashboardPage() {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [chartData, setChartData] = useState<TrendChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sensorsRef = ref(db, 'sensors');
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const updatedSensors: SensorData[] = [];
      
      if (snapshot.exists()) {
        const devicesData = snapshot.val();
        
        Object.keys(devicesData).forEach((deviceId) => {
          const deviceReadings = devicesData[deviceId];
          
          // The timestamps are keys, so we get all of them and find the latest one.
          // We must treat them as numbers for correct sorting.
          const latestTimestampKey = Object.keys(deviceReadings).sort((a, b) => Number(b) - Number(a))[0];

          if (latestTimestampKey) {
            const latestReading: RtdbSensorData = deviceReadings[latestTimestampKey];
            
            updatedSensors.push({
              deviceId: latestReading.deviceId,
              timestamp: latestReading.timestamp,
              temperature: latestReading.temp,
              humidity: latestReading.hum,
              hydrogen: latestReading.h2,
              safetyStatus: latestReading.status,
            });
          }
        });
      }
      
      setSensors(updatedSensors);

      // Create some sample chart data based on latest readings for demo
      if (updatedSensors.length > 0) {
        const latestSensor = updatedSensors[updatedSensors.length-1];
        setChartData(Array.from({ length: 12 }, (_, i) => ({
            time: `${String(i*2).padStart(2, '0')}:00`,
            temperature: parseFloat((latestSensor.temperature - 2 + Math.random() * 4).toFixed(1)),
            humidity: parseFloat((latestSensor.humidity - 5 + Math.random() * 10).toFixed(1)),
            hydrogen: Math.floor(latestSensor.hydrogen * (0.8 + Math.random() * 0.4)),
        })));
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase read failed: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
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
                const hydrogenStatus =
                  sensor.hydrogen > 9000
                    ? "DANGER"
                    : sensor.hydrogen > 7500
                    ? "CAUTION"
                    : "NORMAL";

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
                        <DataCard
                          title="Hydrogen"
                          value={sensor.hydrogen}
                          unit="ppm"
                          status={hydrogenStatus}
                        />
                      </div>
                    </div>
                     <div className="lg:col-span-1 xl:col-span-2 rounded-xl bg-card/70 backdrop-blur-sm border border-border/20 p-4 flex flex-col">
                        <h3 className="text-lg font-headline flex items-center gap-2 mb-4">
                           <BarChart className="w-5 h-5 text-primary"/>
                           Data Trends
                        </h3>
                        <div className="flex-grow">
                            <TrendChart data={chartData} />
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
