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
import Link from "next/link";

export function DashboardSidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/devices", label: "Devices", icon: Cpu },
    { href: "/alerts", label: "Alerts", icon: Siren },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-primary-foreground text-lg font-headline">
            P
          </div>
          <span className="font-headline text-lg">Preion Pro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={pathname === item.href}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
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
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/devices", label: "Devices", icon: Cpu },
    { href: "/alerts", label: "Alerts", icon: Siren },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label} className="contents">
            <button
              type="button"
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-1",
                  pathname === item.href
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-foreground"
                )}
              />
              <span className="text-xs">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
