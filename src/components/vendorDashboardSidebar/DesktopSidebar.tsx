"use client";

import { cn } from "@/lib/utils";
import Sidebar from "@/src/components/vendorDashboardSidebar/vendorDashboardSidebar";
import Topbar from "@/src/components/vendorTopbar/Topbar";
import { ListNavigationProvider } from "@/src/hooks/use-list-navigation";
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


  // The only shell, at every width (see the layout). Below `md` the rail wrapper
  // takes no space: `Sidebar` shows its own fixed mobile bar and drawer there,
  // and the rail inside it is `hidden md:flex`.
  return (
    <div className="flex w-full">
      {/* Sidebar fixed left */}
      <div
        className={cn(
          "md:h-screen md:fixed md:top-0 md:left-0 md:z-50 md:bg-white md:border-r",
          open ? "lg:w-[20%] md:w-60" : "md:w-20"
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
          {/* Here rather than on each page: the shell persists across
              navigations, so the pending state survives the page swap. */}
          <ListNavigationProvider>{children}</ListNavigationProvider>
        </main>
      </div>
    </div>
  );
}
