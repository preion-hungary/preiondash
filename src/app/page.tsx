"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";
import { Header } from "@/components/dashboard/header";
import { DataCard } from "@/components/dashboard/data-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { CHART_DATA, SENSOR_DATA } from "@/lib/mock-data";
import type { RtdbSensorData, SensorData } from "@/lib/types";
import { BarChart, Cpu, MapPin } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function DashboardPage() {
  const [sensors, setSensors] = useState<SensorData[]>([]);

  useEffect(() => {
    const sensorsRef = ref(db, 'sensors');
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const updatedSensors: SensorData[] = [];
      if (snapshot.exists()) {
        const devicesData = snapshot.val();
        
        Object.keys(devicesData).forEach((deviceId) => {
          const deviceReadings = devicesData[deviceId];
          
          // Sort timestamps numerically to get the latest one
          const latestTimestampKey = Object.keys(deviceReadings).sort((a, b) => Number(b) - Number(a))[0];

          if (latestTimestampKey) {
            const latestReading: RtdbSensorData = deviceReadings[latestTimestampKey];
            const mockSensor = SENSOR_DATA.find(s => s.deviceId === deviceId) || SENSOR_DATA[0];

            updatedSensors.push({
              deviceId: latestReading.deviceId,
              timestamp: latestReading.timestamp,
              temperature: latestReading.temp,
              humidity: latestReading.hum,
              hydrogen: mockSensor.hydrogen, // Using mock hydrogen
              hydrogenVoltage: mockSensor.hydrogenVoltage,
              safetyStatus: mockSensor.safetyStatus,
              location: mockSensor.location,
            });
          }
        });
      }
      setSensors(updatedSensors);
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
                  sensor.hydrogen > 1000
                    ? "DANGER"
                    : sensor.hydrogen > 750
                    ? "CAUTION"
                    : "NORMAL";

                return (
                  <React.Fragment key={sensor.deviceId}>
                    <div className="lg:col-span-2 xl:col-span-2 rounded-xl bg-card/70 backdrop-blur-sm border border-border/20 p-4 flex flex-col gap-4">
                       <h3 className="text-lg font-headline flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary"/>
                        {sensor.deviceId}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {sensor.location}
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
                         <DataCard
                          title="H2 Voltage"
                          value={sensor.hydrogenVoltage}
                          unit="V"
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
                            <TrendChart data={CHART_DATA} />
                        </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
