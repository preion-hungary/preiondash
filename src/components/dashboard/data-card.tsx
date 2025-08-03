"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: number | string;
  unit: string;
  status: "NORMAL" | "CAUTION" | "DANGER";
}

export function DataCard({ title, value, unit, status }: DataCardProps) {
  const statusClasses = {
    NORMAL: "bg-green-500",
    CAUTION: "bg-yellow-500",
    DANGER: "bg-red-500 animate-pulse",
  };

  return (
    <Card className="bg-background/50 border-0 shadow-none flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            statusClasses[status]
          )}
        />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-4xl font-bold font-headline text-primary">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </CardContent>
    </Card>
  );
}
