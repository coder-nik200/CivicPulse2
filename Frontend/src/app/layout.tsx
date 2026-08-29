import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CivicPulse — Civic Intelligence",
  description: "Evidence-backed civic action",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
