
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
  AlertTriangle,
  RefreshCw,
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
     {
      name: "Get Status",
      command: "get_status",
      icon: RefreshCw,
    }
  ] as const;

  return (
    <>
      <h3 className="text-lg font-headline flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        Device Controls
      </h3>
      <div className="flex flex-col gap-4 flex-grow">
        <div className="grid grid-cols-2 gap-3 flex-grow">
            {controls.map((control) => (
              <Button
                key={control.command}
                variant="outline"
                className="group flex flex-col h-full w-full items-center justify-center p-2 transition-all duration-200 ease-in-out hover:bg-primary/10 hover:border-primary/50"
                onClick={() => onCommand(control.command, deviceId)}
              >
                  <control.icon className="w-6 h-6 mb-2 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="text-center text-xs">{control.name}</span>
              </Button>
            ))}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full group justify-center transition-all duration-200 ease-in-out hover:bg-destructive/80">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>Reset Wifi</span>
              </div>
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
