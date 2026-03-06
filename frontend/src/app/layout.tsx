import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SavePulse — Emergency Response Platform",
  description: "Real-time emergency response platform connecting patients, ambulances, and hospitals. Built for panic, not planning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: 'var(--sp-bg)', minHeight: '100vh' }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
