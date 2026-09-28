"use client";

import { cn } from "@/lib/utils";
import TopbarIcons from "@/src/components/vendorTopbar/TopbarIcons";
import { TVendor } from "@/src/types/vendor.type";
import { Store } from "lucide-react";
import { vendorDisplayName } from "@/src/utils/vendorName";

type Props = {
  vendor?: TVendor;
  /**
   * Whether the desktop sidebar is expanded.
   *
   * The header is `fixed left-0`, so it spans the whole viewport and takes no
   * notice of the `md:ml-20 / lg:ml-[20%]` its content-area wrapper is shifted
   * by — the sidebar is drawn over its left end. Anything placed at the start of
   * this row therefore has to step around the rail itself, and the rail's width
   * depends on this flag. Undefined on mobile, where there is no rail.
   */
  sidebarOpen?: boolean;
};

export default function Topbar({ vendor, sidebarOpen }: Props) {
  // A branch is its branch name, the parent is its business name — a vendor
  // signed into a branch needs the header to tell the two apart, since nothing
  // else on the screen does. Trimmed and falling back either way, so a name
  // that is only whitespace renders nothing rather than an empty pill.
  const businessName = vendorDisplayName(vendor);

  return (
    <>
      {/* Fixed Topbar */}
      <header
        className="fixed top-0 left-0 right-0 z-1000 bg-white/70 backdrop-blur-lg border-b border-pink-100"
        style={{ height: 64 }}
      >
        {/* The left padding steps around the sidebar rail this header is drawn
            over — see `sidebarOpen`. The values mirror `DesktopSidebar`'s own:
            `w-20` collapsed, `md:w-60 / lg:w-[20%]` expanded, plus this row's
            `md:px-6` gutter so the pill clears the border rather than touching
            it. Below `md` there is no rail, so the base `px-3` stands. */}
        <div
          className={cn(
            "flex items-center justify-between h-full px-3 sm:px-4 md:px-6",
            sidebarOpen
              ? "md:pl-[calc(15rem+1.5rem)] lg:pl-[calc(20%+1.5rem)]"
              : "md:pl-[calc(5rem+1.5rem)]"
          )}
        >
          {/* LEFT — which store this dashboard belongs to.

              A pill in the project's pink rather than plain text: the header is
              translucent white over whatever the page is showing, and grey text
              on that reads as a leftover label instead of the answer to "whose
              catalogue am I editing". Tinted at 10% with a 20% border, which is
              the same weight the active category and the selection bar use, so
              it highlights without competing with the pink prompt on the right.

              `min-w-0` on the slot and `truncate` on the pill: the row's right
              side is `shrink-0`, so a long business name has to give way here
              rather than push the language select and avatar off the header.
              The full name stays available on hover through `title`. */}
          <div className="flex-1 min-w-0 h-full flex items-center">
            {businessName && (
              <span
                title={businessName}
                className="inline-flex min-w-0 max-w-[10rem] items-center gap-2 rounded-full border border-[#DC3173]/20 bg-[#DC3173]/10 px-3 py-1.5 text-sm font-semibold text-[#DC3173] sm:max-w-[16rem] md:max-w-[22rem] lg:max-w-[30rem]"
              >
                <Store className="h-4 w-4 shrink-0" />
                <span className="truncate">{businessName}</span>
              </span>
            )}
          </div>

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
