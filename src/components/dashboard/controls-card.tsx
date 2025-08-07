
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
    },
    {
      name: "Flash LED",
      command: "flash_led",
      icon: Zap,
    },
    {
      name: "Sync Time",
      command: "sync_time",
      icon: Clock,
    },
  ] as const;

  return (
    <>
      <h3 className="text-lg font-headline flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        Device Controls
      </h3>
      <div className="flex flex-col gap-3">
        {controls.map((control) => (
          <Button
            key={control.command}
            variant="outline"
            className="group justify-between transition-all duration-200 ease-in-out hover:bg-primary/10 hover:border-primary/50 hover:pl-6"
            onClick={() => onCommand(control.command, deviceId)}
          >
            <div className="flex items-center gap-2">
              <control.icon className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-primary" />
              <span>{control.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50 transition-transform group-hover:translate-x-1" />
          </Button>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="group justify-between transition-all duration-200 ease-in-out hover:bg-destructive/80 hover:pl-6">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>Reset Wifi</span>
              </div>
              <AlertTriangle className="w-4 h-4 transition-transform group-hover:scale-110" />
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
