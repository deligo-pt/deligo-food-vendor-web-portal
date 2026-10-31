import NumberInputStopScroll from "@/src/components/NumberInputStopScroll/NumberInputStopScroll";
import { RegisterFCMSW } from "@/src/components/RegisterFCMSW/RegisterFCMSW";
import SonnerToaster from "@/src/components/SonnerToaster/SonnerToaster";
import type { Metadata } from "next";
import "react-international-phone/style.css";
import "./globals.css";
import { GoogleMapsProvider } from "../store/googleProvider";

export const metadata: Metadata = {
  title: "DeliGo | Portal de Parceiros | Gestão de Encomendas e Negócios",
  description:
    "A DeliGo ajuda restaurantes, supermercados e outros parceiros a gerir encomendas, menus, entregas, pagamentos e vendas, tudo numa única plataforma simples e intuitiva.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="notranslate"
      translate="no"
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <GoogleMapsProvider>
          <RegisterFCMSW />
          {children}
          <SonnerToaster />
          <NumberInputStopScroll />
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
