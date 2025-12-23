import SonnerToaster from "@/src/components/SonnerToaster/SonnerToaster";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeliGo Vendor Portal | Manage Orders, Menus & Growth",
  description:
    "DeliGo Vendor Portal empowers restaurants and business partners to manage menus, orders, delivery operations, payouts, analytics, and growth — all from one smart dashboard.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <SonnerToaster />
      </body>
    </html>
  );
}
