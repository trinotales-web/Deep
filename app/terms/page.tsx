import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8a8578] hover:text-[#3d3a35] mb-10 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to AXUNE
        </Link>

        <h1 className="font-serif text-3xl text-[#3d3a35] mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-[#8a8578] mb-10">
          Last updated: March 15, 2026
        </p>

        <div className="space-y-10 text-[#5a5549] leading-relaxed text-sm">
          <p>
            Welcome to AXUNE. By accessing or using our service, you agree to
            be bound by these Terms of Service. Please read them carefully —
            we&apos;ve written them to be clear and fair.
          </p>

          {[
            {
              title: "1. Acceptance of Terms",
              content: "By creating an account or using AXUNE, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the service. These terms constitute a legally binding agreement between you and AXUNE.",
            },
            {
              title: "2. Account Responsibilities",
              content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to keep your information current. You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.",
            },
            {
              title: "3. Acceptable Use",
              content: "AXUNE is a personal wellness tool. You agree not to: misuse the service in ways that could harm others or AXUNE; attempt to access other users' data; use automated tools to scrape or abuse the service; share your account with others; or use the service for any unlawful purpose.",
            },
            {
              title: "4. Your Content",
              content: "The data you create in AXUNE (journal entries, habits, goals, etc.) belongs to you. You grant AXUNE a limited license to store and display your content for the purpose of providing the service. We do not claim ownership of your personal wellness data.",
            },
            {
              title: "5. Intellectual Property",
              content: "AXUNE's design, code, branding, and content (excluding your personal data) are owned by AXUNE and protected by intellectual property laws. You may not copy, modify, or distribute any part of the service without our explicit permission.",
            },
            {
              title: "6. Health Disclaimer",
              content: "AXUNE is a self-care companion, not a medical device or healthcare provider. The app does not provide medical advice, diagnosis, or treatment. See our full Health Disclaimer for important information about the limitations of wellness tracking tools.",
            },
            {
              title: "7. Service Availability",
              content: "We strive to provide reliable service but cannot guarantee 100% uptime. AXUNE may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control. We are not liable for any inconvenience caused by service interruptions.",
            },
            {
              title: "8. Limitation of Liability",
              content: "AXUNE is provided 'as is' without warranties of any kind. To the maximum extent permitted by law, AXUNE and its creators are not liable for any indirect, incidental, special, or consequential damages arising from your use of the service.",
            },
            {
              title: "9. Account Termination",
              content: "You may delete your account at any time from your profile settings. We may suspend or terminate accounts that violate these terms. Upon termination, your right to use the service ceases, and your data will be deleted according to our Privacy Policy.",
            },
            {
              title: "10. Changes to Terms",
              content: "We may update these terms from time to time. We will notify you of significant changes via email or in-app notification. Continued use of AXUNE after changes constitutes acceptance of the updated terms.",
            },
            {
              title: "11. Governing Law",
              content: "These terms are governed by the laws of Japan. Any disputes shall be resolved in the appropriate courts of Nagoya, Japan, unless otherwise required by your local consumer protection laws.",
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-serif text-xl text-[#3d3a35] mb-2">
                {section.title}
              </h2>
              <p>{section.content}</p>
            </div>
          ))}

          <div className="bg-[#f6f3ee] border border-[#ede9e2] rounded-xl p-5 mt-6">
            <p className="text-xs text-[#8a8578]">
              Questions about these terms? Contact us at{" "}
              <span className="text-[#7c9a6e]">hello@axune.app</span>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#ede9e2]">
          <div className="flex flex-wrap gap-4 text-sm text-[#8a8578]">
            <Link href="/privacy" className="hover:text-[#3d3a35] transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-[#3d3a35] transition-colors">Health Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
