import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Startup Growth OS",
  description: "The Daily Execution OS for Founders — AI-Powered Startup Idea & Execution Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
