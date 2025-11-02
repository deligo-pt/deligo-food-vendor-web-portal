import Sidebar from "@/components/vendorDashboardSidebar/vendorDashboardSidebar";
import Topbar from "@/components/vendorTopbar/Topbar";

export default function VendorHome({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-0 md:w-[280px] fixed md:relative z-40">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:ml-[280px]">
        {/* Topbar */}
        <div className="sticky top-0 z-30">
          <Topbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
