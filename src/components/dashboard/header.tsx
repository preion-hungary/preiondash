"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  TimeRangeSelector,
  TimeRange,
} from "@/components/dashboard/time-range-selector";

interface HeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

export function Header({ timeRange, onTimeRangeChange }: HeaderProps) {
  const { toast } = useToast();

  const handleExport = () => {
    // This functionality would require fetching all data which can be implemented later.
    toast({
      title: "Exporting...",
      description: "This functionality is not yet implemented.",
    });
  };

  const handleSeedDatabase = async () => {
    // This functionality would require writing to the database, which can be re-enabled if needed.
    toast({
      variant: "destructive",
      title: "Seeding Disabled",
      description: "Database seeding is currently disabled.",
    });
  };

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
        <Button variant="outline" size="sm" onClick={handleSeedDatabase}>
          <Database className="mr-2 h-4 w-4" />
          Seed Database
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </header>
  );
}
