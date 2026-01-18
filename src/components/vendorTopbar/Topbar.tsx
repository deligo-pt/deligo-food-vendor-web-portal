"use client";

import TopbarIcons from "@/src/components/vendorTopbar/TopbarIcons";
import { TVendor } from "@/src/types/vendor.type";

type Props = {
  sidebarWidth?: number;
  vendor?: TVendor;
};

export default function Topbar({ sidebarWidth = 280, vendor }: Props) {
  return (
    <>
      {/* Fixed Topbar */}
      <header
        className="fixed top-0 left-0 right-0 z-1000 bg-white/70 backdrop-blur-lg border-b border-pink-100"
        style={{ height: 64 }}
      >
        <div
          className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6"
          style={{
            paddingLeft:
              typeof sidebarWidth === "number" ? undefined : undefined,
          }}
        >
          {/* LEFT (Empty for now) */}
          <div className="flex-1 h-full flex items-center"></div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 relative z-1001">
            <TopbarIcons vendor={vendor} />
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: 64 }} />
    </>
  );
}
