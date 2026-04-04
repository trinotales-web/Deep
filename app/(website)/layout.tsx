import { Metadata } from "next";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

export const metadata: Metadata = {
  title: {
    default: "AXUNE — Japanese Wisdom for Modern Life",
    template: "%s — AXUNE | Japanese Wisdom for Modern Life",
  },
  description:
    "Explore ancient Japanese philosophies, rituals, and habits that help you build a life of clarity, purpose, and peace.",
  keywords: [
    "japanese philosophy",
    "mindfulness",
    "intentional living",
    "wabi-sabi",
    "ikigai",
    "kaizen",
    "zen",
    "minimalism",
    "productivity",
    "self-care",
    "axune",
  ],
  authors: [{ name: "Hiroto Takana" }],
  creator: "AXUNE",
  openGraph: {
    type: "website",
    title: "AXUNE — Japanese Wisdom for Modern Life",
    description:
      "Explore ancient Japanese philosophies, rituals, and habits that help you build a life of clarity, purpose, and peace.",
    siteName: "AXUNE",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AXUNE — Japanese Wisdom for Modern Life",
    description:
      "Explore ancient Japanese philosophies, rituals, and habits that help you build a life of clarity, purpose, and peace.",
  },
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="paper-grain bg-site-bg font-body text-site-body min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
