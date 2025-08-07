"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DashboardSidebarNav,
  MobileBottomNav,
} from "@/components/dashboard/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Plug,
  WifiOff,
  Signal,
  KeyRound,
  ChevronRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Card, CardContent } from "@/components/ui/card";

function DevicesContent() {
  const isMobile = useIsMobile();
  const [devices, setDevices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(db, "sensors");
    const unsubscribe = onValue(
      devicesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDevices(Object.keys(snapshot.val()));
        } else {
          setDevices([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase read failed: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onboardingSteps = [
    {
      icon: Plug,
      title: "Power Up",
      description: "Plug your new Preion device into a power source.",
    },
    {
      icon: WifiOff,
      title: "Disconnect from Wi-Fi",
      description:
        "On your phone or computer, temporarily disconnect from your current Wi-Fi network.",
    },
    {
      icon: Signal,
      title: "Connect to the Device",
      description:
        "Find and connect to the Wi-Fi network named Preion-Setup. No password is required.",
    },
  ];

  return (
    <>
      <Sidebar>
        <DashboardSidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto pb-20 md:pb-8">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-headline text-white">
              Your Devices
            </h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline">
                    Onboard a New Device
                  </DialogTitle>
                  <DialogDescription>
                    Follow these steps to connect your new device to your Wi-Fi
                    network.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  {onboardingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-primary" />
                      Provide Wi-Fi Credentials
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once connected to the device's hotspot, click the link
                      below to open the configuration page.
                    </p>
                    <Button asChild className="w-full justify-between">
                      <a
                        href="http://192.168.4.1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Configuration Page
                        <ChevronRight />
                      </a>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-start gap-3 p-3 bg-background rounded-lg border">
                    <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-semibold text-sm text-foreground">
                        Your Credentials are Safe
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        You are providing your Wi-Fi details directly to your
                        device, not to us. Even if we could steal them, it's
                        highly unlikely we'd camp outside your house just to
                        syphon your Netflix.
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </header>
          <main className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                 <p className="text-muted-foreground col-span-full">Loading devices...</p>
              ) : devices.length > 0 ? (
                devices.map((deviceId) => (
                  <Card key={deviceId}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <Cpu className="w-8 h-8 text-primary" />
                      <p className="font-semibold text-foreground">{deviceId}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-64 border-2 border-dashed border-border/30 rounded-xl">
                  <p className="text-muted-foreground">
                    No devices found. Click "Add Device" to get started.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
        {isMobile && <MobileBottomNav />}
      </SidebarInset>
    </>
  );
}

export default function DevicesPage() {
  return (
    <SidebarProvider>
      <DevicesContent />
    </SidebarProvider>
  );
}
