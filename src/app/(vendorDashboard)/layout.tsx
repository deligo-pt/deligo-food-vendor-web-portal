import { serverRequest } from "@/lib/serverFetch";
import DesktopSidebar from "@/src/components/vendorDashboardSidebar/DesktopSidebar";
import Sidebar from "@/src/components/vendorDashboardSidebar/vendorDashboardSidebar";
import Topbar from "@/src/components/vendorTopbar/Topbar";
import { TVendor } from "@/src/types/vendor.type";
import { jwtDecode } from "jwt-decode";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Vendor Dashboard",
  description: "Deligo vendor dashboard",
};

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as { id: string };

  let vendorData: TVendor = {} as TVendor;

  try {
    const result = await serverRequest.get(`/vendors/${decoded.id}`);

    if (result?.success) {
      vendorData = result?.data;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile view: Sidebar on top, Topbar below */}
      <div className="flex flex-col md:hidden w-full">
        <div className="w-full">
          <Sidebar />
        </div>
        <div className="w-full sticky top-0 z-40">
          <Topbar />
        </div>
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>

      {/* Desktop view */}
      <DesktopSidebar vendorData={vendorData}>{children}</DesktopSidebar>
    </div>
  );
}
