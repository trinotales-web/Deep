import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "AXUNE — Your Sanctuary for Mindful Living",
  description:
    "A Japanese-inspired self-care, mindfulness, and habit tracking app. Build gentle habits that compound into a deeply meaningful life.",
  keywords: [
    "mindfulness",
    "self-care",
    "habit tracking",
    "wellness",
    "meditation",
    "zen",
    "japanese",
    "axune",
  ],
  authors: [{ name: "AXUNE" }],
  creator: "AXUNE",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AXUNE",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "AXUNE — Your Sanctuary for Mindful Living",
    description:
      "A Japanese-inspired self-care app for intentional, peaceful living.",
    siteName: "AXUNE",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
