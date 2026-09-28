"use client";

import { cn } from "@/lib/utils";
import Sidebar from "@/src/components/vendorDashboardSidebar/vendorDashboardSidebar";
import Topbar from "@/src/components/vendorTopbar/Topbar";
import { useStore } from "@/src/store/store";
import { TVendor } from "@/src/types/vendor.type";
import React, { useEffect, useState } from "react";

export default function DesktopSidebar({
  children,
  vendorData,
}: {
  children: React.ReactNode;
  vendorData: TVendor;
}) {
  const [open, setOpen] = useState(true);
  const { setCategoryType } = useStore();
  const categoryType = vendorData?.businessDetails?.businessType || "";
  
  useEffect(() => {
    setCategoryType(categoryType);
  }, [categoryType, setCategoryType]);


  return (
    <div className="hidden md:flex w-full">
      {/* Sidebar fixed left */}
      <div
        className={cn(
          "h-screen fixed top-0 left-0 z-50 bg-white border-r",
          open ? "lg:w-[20%] md:w-60" : "w-20"
        )}
      >
        <Sidebar open={open} setOpen={setOpen} vendor={vendorData} />
      </div>

      {/* Content area */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          open ? "lg:ml-[20%] md:ml-60" : "md:ml-20"
        )}
      >
        {/* Topbar sticky */}
        <div className="w-full sticky top-0 z-40">
          <Topbar vendor={vendorData} sidebarOpen={open} />
        </div>

        {/* Page content */}
        {/* The dashboard's scroller, and so the one that wears the custom
            scrollbar. It used to sit on the products grid's own pane; that
            pane is gone, and with it the second scrollbar this page had. */}
        <main className="deligo-scroll flex-1 min-w-0 overflow-x-hidden p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
