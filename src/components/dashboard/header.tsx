"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  TimeRangeSelector,
  TimeRange,
} from "@/components/dashboard/time-range-selector";

interface HeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

export function Header({ timeRange, onTimeRangeChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-bold font-headline text-white">
          Preion Pro
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <TimeRangeSelector value={timeRange} onValueChange={onTimeRangeChange} />
      </div>
    </header>
  );
}
