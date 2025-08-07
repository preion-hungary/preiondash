"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DashboardSidebarNav,
  MobileBottomNav,
} from "@/components/dashboard/sidebar-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

function SettingsContent() {
  const isMobile = useIsMobile();

  return (
    <>
      <Sidebar>
        <DashboardSidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto pb-20 md:pb-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold font-headline text-white">
                Settings
              </h1>
            </div>
          </header>
          <main className="mt-8">
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-border/30 rounded-xl">
              <p className="text-muted-foreground">
                Your settings dashboard is empty.
              </p>
            </div>
          </main>
        </div>
        {isMobile && <MobileBottomNav />}
      </SidebarInset>
    </>
  );
}

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <SettingsContent />
    </SidebarProvider>
  );
}
