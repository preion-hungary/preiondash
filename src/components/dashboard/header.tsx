"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Download, Database } from "lucide-react";
import { SENSOR_DATA } from "@/lib/mock-data";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { toast } = useToast();

  const handleExport = () => {
    const data = SENSOR_DATA;
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row: any) =>
        headers
          .map((fieldName) =>
            JSON.stringify(row[fieldName], (key, value) =>
              value === null ? "" : value
            )
          )
          .join(",")
      ),
    ];

    const csvString = csvRows.join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "preionpro_data.csv");
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSeedDatabase = async () => {
    try {
      const batch = writeBatch(db);
      const sensorsCollection = collection(db, "sensors");
      SENSOR_DATA.forEach((sensor) => {
        const docRef = doc(sensorsCollection, sensor.deviceId);
        batch.set(docRef, sensor);
      });
      await batch.commit();
      toast({
        title: "Success!",
        description: "Database seeded with mock data.",
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not seed the database.",
      });
    }
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
