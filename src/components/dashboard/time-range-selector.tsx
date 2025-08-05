"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TimeRange = "1h" | "24h" | "7d" | "30d" | "all";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onValueChange: (value: TimeRange) => void;
}

export function TimeRangeSelector({
  value,
  onValueChange,
}: TimeRangeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {
            {
              "1h": "Last hour",
              "24h": "Last 24 hours",
              "7d": "Last 7 days",
              "30d": "Last 30 days",
              all: "All time",
            }[value]
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onValueChange(v as TimeRange)}>
          <DropdownMenuRadioItem value="1h">Last hour</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="24h">Last 24 hours</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="7d">Last 7 days</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="30d">Last 30 days</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="all">All time</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
