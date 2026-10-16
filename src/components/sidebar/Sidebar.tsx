"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  CreditCard,
  ClipboardList,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

export const navigation = [
  { name: "Dashboard Overview", href: "/", icon: LayoutDashboard },
  { name: "Organizations", href: "/organizations", icon: Building2 },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
  { name: "Role & Permission", href: "/role-permission", icon: ShieldCheck },
  { name: "Diagnostics Management", href: "/diagnostics-managment", icon: ClipboardList },

];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {open && ( 
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id="dashboard-sidebar"
        className={cn(
          "fixed lg:sticky top-0 left-0 h-dvh shrink-0 overflow-hidden w-[280px] lg:w-[280px] isolate bg-[#030812] text-white border-r border-white/15 z-50 flex flex-col transition-[transform,width] duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !open && "invisible lg:visible",
          collapsed && "lg:w-[88px]",
        )}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source src="/images/sidebar_video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        {/* Logo */}
        <div className={cn("h-[76px] shrink-0 flex items-center gap-2 border-b border-white/15", collapsed ? "justify-center px-3" : "justify-between px-4")}>
          <Link href="/" onClick={() => setOpen(false)} className={cn("flex items-center gap-2.5", collapsed && "lg:hidden")} aria-label="Noitra.ai home">
            <span className="relative block h-10 w-12 shrink-0 overflow-hidden">
              <Image
                src="/images/auth_logo.png"
                alt=""
                width={150}
                height={120}
                className="absolute -left-[13px] -top-[12px] h-auto w-[74px] max-w-none"
                priority
              />
            </span>
            <span className="text-[18px] font-semibold tracking-tight text-white">Noltra.ai</span>
          </Link>
          <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} aria-controls="dashboard-sidebar" title={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden h-8 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/15 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white lg:flex">
            {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close sidebar" aria-expanded={open} aria-controls="dashboard-sidebar" className="flex h-8 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/15 text-white hover:bg-white/25 lg:hidden">
            <ChevronsLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn("min-h-0 flex-1 gap-2 flex flex-col items-center pb-2 overflow-x-hidden overflow-y-auto overscroll-contain mt-3 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]", collapsed ? "px-3" : "px-[14px]")}>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                aria-label={collapsed ? item.name : undefined}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "flex h-10 w-full shrink-0 cursor-pointer items-center gap-2 rounded-[5px] border border-l-2 border-transparent px-2 text-[16px] leading-5 font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400",
                  collapsed && "lg:justify-center lg:px-0",
                  isActive
                    ? "border-[#ECECF3] border-l-[#DB27E3] bg-white text-[#DB27E3]"
                    : "rounded-none border-b-white/15 bg-black/15 text-[#F1F1F5] hover:rounded-[5px] hover:bg-white/10",
                )}
              >
                <item.icon
                  strokeWidth={1.5}
                  className="h-5 w-5 shrink-0 text-current"
                />

                <span className={cn("whitespace-nowrap font-semibold", collapsed && "lg:hidden")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={cn("mt-auto shrink-0 pb-5 pt-3", collapsed ? "px-3" : "px-[14px]")}>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            aria-label={collapsed ? "Log out" : undefined}
            title={collapsed ? "Log out" : undefined}
            className={cn("group flex h-10 w-full items-center gap-2 rounded-[5px] px-3 text-[16px] leading-5 font-semibold text-[#EF4444] cursor-pointer transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400", collapsed && "lg:justify-center lg:px-0")}
          >
            <LogOut strokeWidth={1.5} className="h-4 w-4 shrink-0" />
            <span className={cn("whitespace-nowrap font-semibold", collapsed && "lg:hidden")}>Log Out</span>
          </button>
        </div>
      </div>
      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
}
