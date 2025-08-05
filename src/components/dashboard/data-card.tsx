"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Status = "NORMAL" | "CAUTION" | "DANGER";

interface DataCardProps {
  temperature: number;
  humidity: number;
  tempStatus: Status;
  humStatus: Status;
}

const statusClasses = {
  NORMAL: "bg-green-500",
  CAUTION: "bg-yellow-500",
  DANGER: "bg-red-500 animate-pulse",
};

export function DataCard({
  temperature,
  humidity,
  tempStatus,
  humStatus,
}: DataCardProps) {
  return (
    <Card className="bg-background/50 border-0 shadow-none">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x divide-border/20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Temperature
              </CardTitle>
              <div
                className={cn("w-3 h-3 rounded-full", statusClasses[tempStatus])}
              />
            </div>
            <div className="text-4xl font-bold font-headline text-primary">
              {temperature}
            </div>
            <p className="text-xs text-muted-foreground">°C</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Humidity
              </CardTitle>
              <div
                className={cn("w-3 h-3 rounded-full", statusClasses[humStatus])}
              />
            </div>
            <div className="text-4xl font-bold font-headline text-primary">
              {humidity}
            </div>
            <p className="text-xs text-muted-foreground">%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
