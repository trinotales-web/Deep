import Link from "next/link";

const exploreLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/philosophy", label: "Philosophy Library" },
  { href: "/productivity", label: "Productivity" },
  { href: "/about", label: "About" },
  { href: "/download", label: "Download App" },
];

const topicLinks = [
  { href: "/blog?topic=mindset", label: "Mindset" },
  { href: "/blog?topic=aesthetics", label: "Aesthetics" },
  { href: "/blog?topic=practices", label: "Practices" },
  { href: "/blog?topic=nature", label: "Nature" },
  { href: "/blog?topic=relationships", label: "Relationships" },
  { href: "/blog?topic=routines", label: "Routines" },
];

const connectLinks = [
  { href: "/newsletter", label: "Newsletter" },
  { href: "https://youtube.com", label: "YouTube", external: true },
  { href: "https://instagram.com", label: "Instagram", external: true },
  { href: "/contact", label: "Contact" },
  { href: "/rss", label: "RSS Feed" },
];

const socialLinks = [
  { href: "https://youtube.com", label: "YouTube" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://substack.com", label: "Substack" },
];

export default function Footer() {
  return (
    <footer className="bg-site-dark pt-20 pb-10">
      <div className="max-w-site mx-auto px-6">
        {/* Main grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-12 desktop:gap-8">
          {/* Column 1: Brand */}
          <div>
            <h3 className="font-body text-[18px] font-semibold tracking-[3px] uppercase text-site-inverse">
              AXUNE
            </h3>
            <p className="mt-3 text-[14px] font-body text-site-inverse/60 leading-relaxed">
              Japanese-inspired wisdom for modern, intentional living.
            </p>
            <div className="mt-5 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-body text-site-inverse/40 hover:text-site-inverse/70 transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="font-body text-[13px] font-semibold tracking-wider uppercase text-site-inverse/80 mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] font-body text-site-inverse/50 hover:text-site-inverse/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Topics */}
          <div>
            <h4 className="font-body text-[13px] font-semibold tracking-wider uppercase text-site-inverse/80 mb-5">
              Topics
            </h4>
            <ul className="space-y-3">
              {topicLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] font-body text-site-inverse/50 hover:text-site-inverse/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="font-body text-[13px] font-semibold tracking-wider uppercase text-site-inverse/80 mb-5">
              Connect
            </h4>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] font-body text-site-inverse/50 hover:text-site-inverse/80 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[14px] font-body text-site-inverse/50 hover:text-site-inverse/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-site-inverse/10 flex flex-col tablet:flex-row items-center justify-between gap-4">
          <p className="text-[13px] font-body text-site-inverse/40">
            &copy; 2026 AXUNE. Crafted in Nagoya, Japan.
          </p>
          <div className="flex items-center gap-4 text-[13px] font-body text-site-inverse/40">
            <Link
              href="/privacy"
              className="hover:text-site-inverse/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>&middot;</span>
            <Link
              href="/terms"
              className="hover:text-site-inverse/70 transition-colors"
            >
              Terms
            </Link>
            <span>&middot;</span>
            <Link
              href="/disclaimer"
              className="hover:text-site-inverse/70 transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
