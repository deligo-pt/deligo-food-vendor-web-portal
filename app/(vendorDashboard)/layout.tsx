import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Vendor Dashboard",
  description: "Deligo vendor dashboard",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
