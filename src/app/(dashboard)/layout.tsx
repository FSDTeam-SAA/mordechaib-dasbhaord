"use client";

import React, { useState } from "react";
import Header from "@/components/header/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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