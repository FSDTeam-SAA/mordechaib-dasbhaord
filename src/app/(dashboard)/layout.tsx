"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const authenticated = status === "authenticated" && Boolean(session?.accessToken);
  useEffect(() => {
    if (status !== "loading" && !authenticated) router.replace("/signin");
  }, [status, authenticated, router]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!authenticated) return null;

  return (
    <>
      <Header setSidebarOpen={setSidebarOpen} sidebarCollapsed={sidebarCollapsed} onExpandSidebar={() => setSidebarCollapsed(false)} />

      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(true)}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />


        <main className="min-w-0 w-full lg:ml-0 mt-[76px] p-4 md:p-6 overflow-x-auto bg-[#F7FAF9]">
          {children}
        </main>
      </div>
    </>
  );
}

export default Layout;