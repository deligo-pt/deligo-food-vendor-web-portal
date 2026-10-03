export const dynamic = "force-dynamic";

import NotificationToast from "@/src/components/NotificationToast/NotificationToast";
import DesktopSidebar from "@/src/components/vendorDashboardSidebar/DesktopSidebar";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TVendor } from "@/src/types/vendor.type";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Dashboard",
  description: "Deligo vendor dashboard",
};

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const vendorData: TVendor = await getProfileData();

  // One shell for every width. There used to be a mobile copy and a desktop
  // copy side by side, with CSS hiding one of them. Hidden is not unmounted, so
  // every Topbar, Sidebar and page component mounted twice and ran its requests
  // twice. `DesktopSidebar` now lays itself out for both widths.
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <DesktopSidebar vendorData={vendorData}>{children}</DesktopSidebar>
      <NotificationToast />
    </div>
  );
}
