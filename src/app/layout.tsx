import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Factura Simple · San Juan",
  description: "Facturación electrónica simple para monotributistas y pequeños contribuyentes de San Juan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
