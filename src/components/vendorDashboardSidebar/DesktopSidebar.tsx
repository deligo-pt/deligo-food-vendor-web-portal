"use client";

import { cn } from "@/lib/utils";
import Sidebar from "@/src/components/vendorDashboardSidebar/vendorDashboardSidebar";
import Topbar from "@/src/components/vendorTopbar/Topbar";
import { TVendor } from "@/src/types/vendor.type";
import React, { useState } from "react";

export default function DesktopSidebar({
  children,
  vendorData,
}: {
  children: React.ReactNode;
  vendorData: TVendor;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="hidden md:flex w-full">
      {/* Sidebar fixed left */}
      <div
        className={cn(
          "h-screen fixed top-0 left-0 z-50 bg-white border-r",
          open ? "w-[280px]" : "w-20"
        )}
      >
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      {/* Content area */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          open ? "md:ml-[280px]" : "md:ml-20"
        )}
      >
        {/* Topbar sticky */}
        <div className="w-full sticky top-0 z-40">
          <Topbar vendor={vendorData} />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
