"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CalendarRange,
  ClipboardPenLine,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  Plane,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard Overview", href: "/", icon: LayoutDashboard },
  {
    name: "User Management",
    href: "/users-management",
    icon: UserRound,
  },
  { name: "Applications", href: "/applications", icon: ClipboardPenLine },
  {
    name: "Visa Applications",
    href: "/visa-applications",
    icon: Plane,
  },
  {
    name: "Student Applications",
    href: "/student-applications",
    icon: GraduationCap,
  },
  {
    name: "Tour Booking",                    
    href: "/tour-booking",
    icon: MapPin,
  },
  {
    name: "Consultation",
    href: "/consultation",
    icon: CalendarRange,
  },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

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
        className={cn(
          "fixed lg:sticky top-0 left-0 h-dvh shrink-0 overflow-hidden w-[280px] lg:w-[320px] bg-[#E8EEEE] text-[#003b3b] z-50 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Mobile Close Button */}
        <div className="absolute right-4 top-4 lg:hidden">
          <button className="cursor-pointer" aria-label="Close sidebar" onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="shrink-0 flex items-center justify-center py-6">
          <Image
            src="/images/logo_image.png"
            alt="Bookkeepers Marketplace"
            width={150}
            height={120}
            className="h-auto max-h-[72px] w-auto max-w-[150px] object-contain"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 space-y-2 flex flex-col items-center px-3 pb-2 overflow-x-hidden overflow-y-auto overscroll-contain mt-3 [scrollbar-width:thin] [scrollbar-color:#9BB7B2_transparent]">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex w-full shrink-0 cursor-pointer items-center gap-3 rounded-[8px] border-l-4 border-transparent pl-3 pr-4 py-[8px] text-sm font-medium transition-all duration-200",
                  isActive
                    ? "rounded-[4px] border-l-[#3C6E6C] bg-[#003B3B] text-white"
                    : "text-[#245858] hover:bg-[#DCE6E6]",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-white" : "text-[#245858]",
                  )}
                />

                <span
                  className={cn("text-base", isActive ? "font-semibold" : "")}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 p-6">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#E6470B] cursor-pointer transition-all duration-300 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 transition-colors duration-300" />
            <span className="text-base">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
