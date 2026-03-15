import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export default function AboutPage() {
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

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-white border border-[#ede9e2] flex items-center justify-center">
            <Leaf size={18} className="text-[#7c9a6e]" />
          </div>
          <h1 className="font-serif text-3xl text-[#3d3a35]">About AXUNE</h1>
        </div>

        <div className="prose prose-sm max-w-none text-[#5a5549] leading-relaxed space-y-6">
          <p className="font-serif text-lg text-[#3d3a35] leading-relaxed">
            AXUNE is a digital sanctuary designed for people who want to live
            with more intention, more peace, and more presence.
          </p>

          <p>
            In a world that constantly demands your attention, AXUNE gives you a
            quiet space to return to yourself. Inspired by Japanese philosophy —
            wabi-sabi, kaizen, zen simplicity — this app helps you build small,
            gentle habits that compound into a deeply meaningful life.
          </p>

          <p>
            AXUNE is not about productivity. It is not about optimization. It is
            about slowing down enough to notice the beauty in your ordinary
            days, and building a rhythm of self-care that feels natural rather
            than forced.
          </p>

          <div className="bg-white rounded-2xl border border-[#ede9e2] p-7 my-8">
            <h2 className="font-serif text-xl text-[#3d3a35] mb-4">
              Our Philosophy
            </h2>
            <ul className="space-y-3">
              {[
                ["Simplicity over complexity", "Less noise, more clarity"],
                ["Gentleness over intensity", "Progress without pressure"],
                ["Consistency over perfection", "Small daily practice over grand gestures"],
                ["Presence over productivity", "Being here, now"],
                ["Self-compassion over self-criticism", "Kindness as the foundation"],
              ].map(([principle, sub]) => (
                <li key={principle} className="flex items-start gap-3">
                  <span className="text-[#7c9a6e] mt-1">✦</span>
                  <div>
                    <span className="font-medium text-[#3d3a35]">{principle}</span>
                    <span className="text-[#8a8578]"> — {sub}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p>
            AXUNE draws from Japanese minimalism, Zen philosophy, and the wisdom
            of generations past. It is built for anyone who wants to live a more
            intentional, peaceful life — whether you are new to mindfulness or
            deepening an existing practice.
          </p>

          <blockquote className="font-serif italic text-xl text-[#3d3a35] border-l-2 border-[#7c9a6e] pl-5 py-2 my-8">
            &ldquo;I went to the woods because I wished to live deliberately, to
            front only the essential facts of life.&rdquo;
            <footer className="text-sm text-[#8a8578] font-sans not-italic mt-2">
              — Henry David Thoreau
            </footer>
          </blockquote>

          <div className="bg-[#3d3a35] rounded-2xl p-7 text-white/70">
            <h2 className="font-serif text-xl text-white/90 mb-3">
              Inspired by Japan
            </h2>
            <p className="text-sm leading-relaxed">
              Wabi-sabi — finding beauty in imperfection. Kaizen — small,
              continuous improvement. Ma — the beauty of negative space and
              silence. These concepts form the soul of AXUNE. We believe your
              wellness app should feel like a zen garden, not a productivity
              dashboard.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#ede9e2]">
          <div className="flex flex-wrap gap-4 text-sm text-[#8a8578]">
            <Link href="/privacy" className="hover:text-[#3d3a35] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#3d3a35] transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-[#3d3a35] transition-colors">Health Disclaimer</Link>
            <Link href="/" className="hover:text-[#3d3a35] transition-colors">← Back to app</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
