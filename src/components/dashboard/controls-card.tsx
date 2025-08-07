"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Film,
  WifiOff,
  Clock,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface ControlsCardProps {
  deviceId: string;
  onCommand: (command: string, deviceId: string) => void;
}

export function ControlsCard({ deviceId, onCommand }: ControlsCardProps) {
  const controls = [
    {
      name: "Change Slide",
      command: "change_slide",
      icon: Film,
      variant: "outline",
    },
    {
      name: "Flash LED",
      command: "flash_led",
      icon: Zap,
      variant: "outline",
    },
    {
      name: "Sync Time",
      command: "sync_time",
      icon: Clock,
      variant: "outline",
    },
  ] as const;

  return (
    <>
      <h3 className="text-lg font-headline flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary" />
        Device Controls
      </h3>
      <div className="flex flex-col gap-3">
        {controls.map((control) => (
          <Button
            key={control.command}
            variant={control.variant as any}
            className="justify-between"
            onClick={() => onCommand(control.command, deviceId)}
          >
            <div className="flex items-center gap-2">
              <control.icon className="w-4 h-4" />
              <span>{control.name}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>Reset Wifi</span>
              </div>
              <AlertTriangle className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will reset the Wi-Fi credentials on the device. The
                device will lose connection and may require manual
                reconfiguration.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onCommand("reset_wifi", deviceId)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
