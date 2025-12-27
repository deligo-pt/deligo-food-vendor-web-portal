import { serverRequest } from "@/lib/serverFetch";
import FooterDeligoPremium from "@/src/components/Footer/Footer";
import Navbar from "@/src/components/nabar/Navbar";
import { TVendor } from "@/src/types/vendor.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import React from "react";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  let vendorData: TVendor = {} as TVendor;

  if (accessToken) {
    const decoded = jwtDecode(accessToken) as { role: string };

    if (decoded && decoded?.role === "VENDOR") {
      try {
        const result = await serverRequest.get("profile");

        if (result?.success) {
          vendorData = result?.data;
        }
      } catch (err) {
        console.error("Server fetch error:", err);
      }
    }
  }

  return (
    <div>
      <Navbar vendorData={vendorData} />
      {children}
      <FooterDeligoPremium />
    </div>
  );
};

export default PublicLayout;
