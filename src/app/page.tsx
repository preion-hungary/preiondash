
"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DashboardSidebarNav,
  MobileBottomNav,
} from "@/components/dashboard/sidebar-nav";
import { Header } from "@/components/dashboard/header";
import { DataCard } from "@/components/dashboard/data-card";
import { ControlsCard } from "@/components/dashboard/controls-card";
import type { RtdbSensorData, SensorData } from "@/lib/types";
import { Cpu } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  ref,
  get,
  query,
  limitToLast,
  onChildAdded,
} from "firebase/database";
import {
  TimeRange,
} from "@/components/dashboard/time-range-selector";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAwsIot } from "@/hooks/use-aws-iot";
import { Card } from "@/components/ui/card";


interface SensorDisplayData extends SensorData {}

function DashboardContent() {
  const [sensors, setSensors] = useState<SensorDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const isMobile = useIsMobile();
  const { sendCommand } = useAwsIot();

  const handleCommand = async (command: string, deviceId: string) => {
    await sendCommand(command, deviceId);
  };

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
          
          const latestReadingQuery = query(deviceReadingsRef, limitToLast(1));

          const readingSnapshot = await get(latestReadingQuery);
          if (!readingSnapshot.exists()) return null;

          const readingsData = readingSnapshot.val();
          const latestReading = Object.values<RtdbSensorData>(readingsData)[0];

          return {
            deviceId: latestReading.deviceId,
            timestamp: latestReading.timestamp,
            temperature: latestReading.temp,
            humidity: latestReading.hum,
            safetyStatus: latestReading.status,
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
                        const sensorIndex = prevSensors.findIndex(s => s.deviceId === deviceId);

                        if (sensorIndex === -1) {
                           return [
                             ...prevSensors,
                             {
                                deviceId: newReading.deviceId,
                                timestamp: newReading.timestamp,
                                temperature: newReading.temp,
                                humidity: newReading.hum,
                                safetyStatus: newReading.status,
                             }
                           ].sort((a, b) => a.deviceId.localeCompare(b.deviceId));
                        }

                        // Sensor exists, update it
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

  }, []);

  return (
    <>
      <Sidebar>
        <DashboardSidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto pb-20 md:pb-8">
          <Header timeRange={timeRange} onTimeRangeChange={setTimeRange} />
          <main className="mt-8">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {sensors.map((sensor) => {
                return (
                  <Card
                    key={sensor.deviceId}
                    className="lg:col-span-1 p-4 flex flex-col gap-4"
                  >
                    <h3 className="text-lg font-headline flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      {sensor.deviceId}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">
                      Status: {sensor.safetyStatus}
                    </p>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                       <DataCard
                          temperature={sensor.temperature}
                          humidity={sensor.humidity}
                          tempStatus="NORMAL"
                          humStatus="NORMAL"
                        />
                       <ControlsCard
                        deviceId={sensor.deviceId}
                        onCommand={handleCommand}
                       />
                    </div>
                  </Card>
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
                  No sensor data found.
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
