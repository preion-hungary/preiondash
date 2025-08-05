"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Cpu,
  Siren,
  Settings,
  CircleHelp,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-primary-foreground text-lg font-headline">P</div>
            <span className="font-headline text-lg">Preion Pro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              isActive={pathname === "/"}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="All Devices">
              <Cpu />
              <span>All Devices</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Alerts">
              <Siren />
              <span>Alerts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Help & Support">
                    <CircleHelp />
                    <span>Help & Support</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, active: pathname === "/" },
    { href: "/devices", label: "Devices", icon: Cpu, active: pathname === "/devices" },
    { href: "/alerts", label: "Alerts", icon: Siren, active: pathname === "/alerts" },
    { href: "/settings", label: "Settings", icon: Settings, active: pathname === "/settings" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
              item.active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "w-6 h-6 mb-1",
              item.active ? "text-primary" : "text-gray-400 group-hover:text-foreground"
            )} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
