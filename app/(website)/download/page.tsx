"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const features = [
  { icon: "◈", title: "Habit Tracking", description: "28 Japanese-inspired habits across 6 categories" },
  { icon: "🧘", title: "Void Space", description: "Meditation with ambient soundscapes" },
  { icon: "📖", title: "Daily Academy", description: "Learn a new Japanese philosophy every day" },
  { icon: "⏱", title: "Digital Detox", description: "Set screen time limits with math quiz friction" },
  { icon: "🎯", title: "Focus Timer", description: "Pomodoro with Ensō circle visualization" },
  { icon: "🌙", title: "Sleep Tracker", description: "Log and analyze your rest quality" },
  { icon: "✍️", title: "Journal", description: "Gratitude, free writing, and daily reflection" },
  { icon: "🏆", title: "Achievements", description: "16 milestones inspired by Japanese concepts" },
];

const testimonials = [
  { text: "AXUNE helped me build a morning routine that finally stuck. The philosophy lessons are beautiful.", author: "Sarah M.", role: "Designer" },
  { text: "The Void Space meditation feature is unlike anything I've tried. So peaceful and thoughtfully designed.", author: "James K.", role: "Engineer" },
  { text: "I love how every feature is rooted in real Japanese philosophy. It's not just another habit tracker.", author: "Yuki T.", role: "Writer" },
];

const faqs = [
  { q: "Is AXUNE free?", a: "AXUNE is free to download and use. All core features — habit tracking, journaling, meditation, and the philosophy academy — are available at no cost. We believe self-care tools should be accessible to everyone." },
  { q: "What devices does it support?", a: "AXUNE is available on iOS (iPhone and iPad) and Android devices. We also have a progressive web app that works on any modern browser." },
  { q: "Is my data private?", a: "Absolutely. Your data is stored locally on your device and never shared with third parties. We don't run ads, we don't sell data, and we don't track your behavior. Your self-care journey is yours alone." },
  { q: "Can I export my data?", a: "Yes. You can export all your data — habits, journal entries, mood logs, and more — as a JSON or CSV file at any time. Your data belongs to you." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-site-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-heading text-[18px] font-medium text-site-heading pr-4">
          {q}
        </span>
        <ChevronDown
          size={20}
          className={`text-site-muted flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="font-body text-[15px] text-site-secondary leading-[1.7] pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[100px]">
      {/* Hero */}
      <section className="max-w-site mx-auto px-5 mb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h1 className="font-heading text-[32px] md:text-[40px] font-bold text-site-heading">
              AXUNE: Your daily self-care sanctuary
            </h1>
            <p className="font-body text-[17px] text-site-secondary leading-[1.7] mt-4">
              Track habits inspired by Japanese wisdom. Meditate in the Void
              Space. Learn a new philosophy every day. Build routines that bring
              peace. All in one beautifully designed app that respects your
              privacy and your time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button className="bg-site-dark text-white px-8 py-3.5 rounded-lg font-body text-[15px] font-semibold hover:bg-black transition-colors">
                Download for iOS
              </button>
              <button className="bg-site-dark text-white px-8 py-3.5 rounded-lg font-body text-[15px] font-semibold hover:bg-black transition-colors">
                Download for Android
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-shrink-0"
          >
            <div className="w-[280px] h-[560px] rounded-[32px] bg-site-dark border-2 border-site-border flex items-center justify-center">
              <div className="text-center">
                <p className="font-heading text-[24px] font-bold text-site-inverse">
                  AXUNE
                </p>
                <p className="font-body text-[13px] text-white/30 mt-2">
                  App Preview
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-site-bg-alt py-[60px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-[28px] md:text-[36px] font-bold text-site-heading">
              Everything you need, nothing you don&apos;t
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-white rounded-xl p-6 shadow-site-card text-center"
              >
                <span className="text-[32px] block mb-3">{f.icon}</span>
                <h3 className="font-heading text-[18px] font-medium text-site-heading mb-1">
                  {f.title}
                </h3>
                <p className="font-body text-[14px] text-site-secondary leading-[1.5]">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-site-bg py-[60px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-[28px] md:text-[36px] font-bold text-site-heading">
              What people are saying
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-xl p-6 shadow-site-card"
              >
                <p className="font-body text-[15px] text-site-body leading-[1.7] italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-site-bg-alt flex items-center justify-center">
                    <span className="font-body text-[12px] font-semibold text-site-secondary">
                      {t.author[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-[14px] font-medium text-site-heading">
                      {t.author}
                    </p>
                    <p className="font-body text-[12px] text-site-muted">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-site-bg-alt py-[60px] md:py-[100px]">
        <div className="max-w-article mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-heading text-[28px] md:text-[36px] font-bold text-site-heading">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
