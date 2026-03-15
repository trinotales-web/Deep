import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-[#8a8578] mb-10">
          Last updated: March 15, 2026
        </p>

        <div className="bg-[#3d3a35] rounded-2xl p-6 mb-10">
          <p className="font-serif italic text-lg text-white/80 leading-relaxed">
            At AXUNE, your privacy is sacred. Just like the journal entries you
            write, your data belongs to you and you alone.
          </p>
        </div>

        <div className="space-y-10 text-[#5a5549] leading-relaxed">
          <Section title="What we collect">
            <p>
              We collect only what is necessary to provide the AXUNE experience:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
              <li>
                <strong className="text-[#3d3a35]">Account information:</strong> Your name, email address, and hashed password (we never store your password in plain text)
              </li>
              <li>
                <strong className="text-[#3d3a35]">Wellness data:</strong> Habit logs, mood entries, journal content, sleep data, water intake, energy levels, and other self-care data you choose to log
              </li>
              <li>
                <strong className="text-[#3d3a35]">Screen time data:</strong> App usage records you manually log within AXUNE
              </li>
              <li>
                <strong className="text-[#3d3a35]">Usage data:</strong> Anonymized analytics to improve the app (no personally identifiable information)
              </li>
            </ul>
          </Section>

          <Section title="How we use your data">
            <p className="text-sm">
              Your data is used solely to provide AXUNE&apos;s functionality:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
              <li>Displaying your personal dashboard and wellness metrics</li>
              <li>Generating insights and analytics visible only to you</li>
              <li>Maintaining your habit streaks and goal progress</li>
              <li>Personalizing your experience (e.g., your name in greetings)</li>
            </ul>
            <p className="mt-3 text-sm font-medium text-[#3d3a35]">
              We never sell, share, or monetize your personal data.
            </p>
          </Section>

          <Section title="Data storage and security">
            <p className="text-sm">
              Your data is stored in an encrypted database. We use
              industry-standard security measures including:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
              <li>Encrypted database connections (TLS/SSL)</li>
              <li>Bcrypt password hashing (min 12 rounds)</li>
              <li>JWT tokens with expiration for authentication sessions</li>
              <li>No third-party sharing of your wellness data</li>
            </ul>
          </Section>

          <Section title="Your rights">
            <p className="text-sm">
              You have complete control over your data:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
              <li><strong className="text-[#3d3a35]">Access:</strong> View all your data in the app at any time</li>
              <li><strong className="text-[#3d3a35]">Export:</strong> Download a complete JSON export of your data from your profile settings</li>
              <li><strong className="text-[#3d3a35]">Delete:</strong> Permanently delete your account and all associated data from your profile settings</li>
              <li><strong className="text-[#3d3a35]">Correct:</strong> Update your information at any time in profile settings</li>
            </ul>
          </Section>

          <Section title="Third-party services">
            <p className="text-sm">
              AXUNE uses only the following third-party services:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
              <li><strong className="text-[#3d3a35]">Google OAuth:</strong> Optional sign-in provider. If you use Google sign-in, we receive your name, email, and profile photo from Google.</li>
              <li><strong className="text-[#3d3a35]">Database hosting:</strong> Your data is stored on secure, encrypted servers.</li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p className="text-sm">
              We use session cookies for authentication only. No tracking
              cookies, advertising cookies, or third-party analytics cookies are
              used. You can clear cookies at any time via your browser settings.
            </p>
          </Section>

          <Section title="Children's privacy">
            <p className="text-sm">
              AXUNE is intended for users 13 years of age and older. We do not
              knowingly collect personal information from children under 13. If
              you believe we have inadvertently collected such information,
              please contact us immediately.
            </p>
          </Section>

          <Section title="GDPR compliance">
            <p className="text-sm">
              If you are located in the European Economic Area (EEA), you have
              additional rights under GDPR: the right to data portability, the
              right to restriction of processing, and the right to object to
              processing. To exercise these rights, please contact us.
            </p>
          </Section>

          <Section title="California privacy rights">
            <p className="text-sm">
              California residents have additional rights under CCPA, including
              the right to know what personal information is collected, the
              right to delete personal information, and the right to opt-out of
              the sale of personal information (we do not sell personal
              information).
            </p>
          </Section>

          <Section title="Data retention">
            <p className="text-sm">
              Your data is retained for as long as your account is active. When
              you delete your account, all associated data is permanently and
              irrevocably deleted within 30 days.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p className="text-sm">
              We may update this Privacy Policy from time to time. We will
              notify you of any significant changes by email or through a
              prominent notice in the app. Continued use of AXUNE after changes
              constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="Contact">
            <p className="text-sm">
              Questions about your privacy? We&apos;re here. Reach out at{" "}
              <span className="text-[#7c9a6e]">privacy@axune.app</span> — we
              respond to all privacy inquiries within 7 business days.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#ede9e2]">
          <div className="flex flex-wrap gap-4 text-sm text-[#8a8578]">
            <Link href="/terms" className="hover:text-[#3d3a35] transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-[#3d3a35] transition-colors">Health Disclaimer</Link>
            <Link href="/about" className="hover:text-[#3d3a35] transition-colors">About</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-[#3d3a35] mb-3">{title}</h2>
      {children}
    </div>
  );
}
