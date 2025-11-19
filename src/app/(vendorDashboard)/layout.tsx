import { serverRequest } from "@/lib/serverFetch";
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
      <div className="hidden md:flex w-full">
        {/* Sidebar fixed left */}
        <div className="w-[280px] h-screen fixed top-0 left-0 z-50 bg-white border-r">
          <Sidebar />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col md:ml-[280px]">
          {/* Topbar sticky */}
          <div className="w-full sticky top-0 z-40">
            <Topbar vendor={vendorData} />
          </div>
          {/* Page content */}
          <main className="flex-1 p-4 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
