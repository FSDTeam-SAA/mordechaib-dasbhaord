"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navigation } from "@/components/sidebar/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronsRight, Download, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getPageConfig } from "@/lib/page-config";
import Notifications from "./Notifications";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onExpandSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen, sidebarCollapsed, onExpandSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [panel, setPanel] = useState<"search" | "account" | null>(null);
  const [query, setQuery] = useState("");
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismiss = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) setPanel(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const actionClass = "flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#E3E6F2] bg-[#F7F8FF] text-[#30364E] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400";
  const matches = navigation.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  const pageInfo = getPageConfig(pathname);

  const { data: session } = useSession();

  const user = session?.user as {
    email?: string | null;
    name?: string | null;
    image?: string | null;
    profileImage?: string | null;
  } | undefined;

  const email = user?.email;
  const profileImage = user?.profileImage || user?.image || undefined;
  const displayName = user?.name?.trim() || email?.split("@")[0] || "Admin User";
  const nameParts = displayName.split(/\s+/);
  const initials = (nameParts.length > 1
    ? nameParts.slice(0, 2).map((part) => part[0]).join("")
    : displayName.slice(0, 2)
  ).toUpperCase();

  return (
    <div className={`fixed top-0 right-[var(--removed-body-scroll-bar-size,0px)] left-0 z-30 h-[76px] flex items-center justify-between gap-3 px-3 md:px-5 isolate bg-[#030812] text-white border-b border-white/15 ${sidebarCollapsed ? "lg:left-0" : "lg:left-[240px]"}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/images/header_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
      </div>
      {/* Left Side */}
      <div className="flex min-w-0 items-center gap-3">
        <button className="cursor-pointer lg:hidden" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>

        {sidebarCollapsed && (
          <button type="button" onClick={onExpandSidebar} aria-label="Expand sidebar" aria-expanded={false} aria-controls="dashboard-sidebar" title="Expand sidebar" className="hidden h-8 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/15 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white lg:flex">
            <ChevronsRight className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold leading-tight tracking-tight text-white xl:text-2xl">
            {pageInfo.title}
          </h1>

          <p className="mt-1 hidden xl:block text-xs leading-5 text-slate-300">
            {pageInfo.description}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div ref={actionsRef} className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button type="button" onClick={() => window.print()} className={`${actionClass} gap-2 px-2.5 sm:px-3`} aria-label="Export PDF" title="Export PDF">
          <Download className="h-4 w-4" />
          <span className="hidden text-xs font-medium md:inline">Export PDF</span>
        </button>
        <button type="button" className={`${actionClass} w-10`} aria-label="Search pages" aria-expanded={panel === "search"} aria-controls="header-search" onClick={() => setPanel(panel === "search" ? null : "search")}>
          <Search className="h-[18px] w-[18px]" />
        </button>
        <Notifications buttonClassName={actionClass} onOpen={() => setPanel(null)} />
        {panel === "search" && (
          <section id="header-search" aria-label="Search pages" className="absolute right-0 top-full mt-3 w-[min(340px,calc(100vw-24px))] rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Search pages</h2>
              <button type="button" onClick={() => setPanel(null)} aria-label="Close panel" className="cursor-pointer rounded p-1 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <>
                <input autoFocus aria-label="Search menu pages" placeholder="Search pages…" value={query} onChange={(event) => setQuery(event.target.value)} className="mb-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-400" />
                <div className="max-h-64 overflow-y-auto">
                  {matches.map((item) => <Link key={item.href} href={item.href} onClick={() => { setPanel(null); setQuery(""); }} className="block rounded-md px-3 py-2 text-sm hover:bg-fuchsia-50 hover:text-fuchsia-600">{item.name}</Link>)}
                  {matches.length === 0 && <p className="py-3 text-sm text-slate-500">No pages found.</p>}
                </div>
            </>
          </section>
        )}
        {panel === "account" && (
          <div id="account-panel" className="absolute right-0 top-full mt-3 w-52 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
            <Link href="/change-password" onClick={() => setPanel(null)} className="block rounded-md px-3 py-2 text-sm hover:bg-fuchsia-50 hover:text-fuchsia-600">Change Password</Link>
          </div>
        )}
        <button
          type="button"
          aria-label="Account settings"
          aria-expanded={panel === "account"}
          aria-controls="account-panel"
          onClick={() => setPanel(panel === "account" ? null : "account")}
          className="flex h-10 cursor-pointer items-center py-1 gap-2 rounded-md border border-[#E3E6F2] bg-[#F7F8FF] px-1.5 sm:px-2.5 text-[#20243B]"

        >
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarImage src={profileImage} alt={displayName} className="object-cover" />
            <AvatarFallback className="rounded-md bg-[#E7E9F8] text-xs font-semibold text-[#30364E]" aria-label={displayName}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block max-w-28">
            <p className="truncate text-xs font-medium">{displayName}</p>
            <p className="truncate text-[10px] text-slate-500">{email || "Administrator"}</p>
          </div>
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        </button>
      </div>
    </div>
  );
}
