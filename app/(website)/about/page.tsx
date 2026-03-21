"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const values = [
  {
    icon: "🌱",
    title: "Simplicity",
    description:
      "We believe a meaningful life is built from small, intentional daily practices rather than dramatic overhauls.",
  },
  {
    icon: "🔒",
    title: "Privacy",
    description:
      "Your self-care journey is yours alone. We do not track, sell, or share your data. Ever.",
  },
  {
    icon: "🌸",
    title: "Authenticity",
    description:
      "Every philosophy we share is researched, understood, and practiced. We don't simplify wisdom into clickbait.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-site-dark py-[80px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-site-amber mb-4">
              ABOUT AXUNE
            </p>
            <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-site-inverse">
              We help you live deliberately
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-site-bg py-[60px] md:py-[80px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-article mx-auto px-5"
        >
          <p className="font-heading text-[17px] text-site-body leading-[1.85] mb-6">
            I grew up in Nagoya, Japan, the son of a Japanese father and an Indian
            mother. My childhood was spent between two cultures, two languages, two
            ways of seeing the world. But it was in my grandfather Daiki&apos;s small
            wooden house on the outskirts of the city where I learned the most
            important lessons of my life.
          </p>
          <p className="font-heading text-[17px] text-site-body leading-[1.85] mb-6">
            Ojiichan — grandfather — was a retired schoolteacher who lived with
            extraordinary simplicity. He woke before dawn every day. He tended his
            small garden. He practiced shodo (calligraphy) for exactly one hour. He
            drank green tea slowly, watching the steam rise. He kept journals — not
            of his accomplishments, but of the small things he noticed: the first
            plum blossom of spring, the way light fell through the shoji screens in
            the afternoon, the sound of rain on the engawa.
          </p>

          <blockquote className="border-l-[3px] border-site-amber pl-6 my-8">
            <p className="font-heading text-[20px] italic text-site-body leading-[1.6]">
              &ldquo;A good life is not built from grand gestures. It is built from
              ten thousand small mornings, each one lived with care.&rdquo;
            </p>
            <p className="font-body text-[14px] text-site-muted mt-3">
              — From the journals of Daiki Takana
            </p>
          </blockquote>

          <p className="font-heading text-[17px] text-site-body leading-[1.85] mb-6">
            When I left Japan for college and then for work in the tech industry,
            I slowly lost touch with these practices. I replaced stillness with
            screens, rituals with routines, presence with productivity. Like so
            many others, I was optimizing everything except what mattered.
          </p>
          <p className="font-heading text-[17px] text-site-body leading-[1.85] mb-6">
            It took a burnout — a real, proper, couldn&apos;t-get-out-of-bed burnout —
            to send me back to Ojiichan&apos;s journals. Reading them again as an
            adult, I realized something profound: the Japanese philosophies I had
            grown up with weren&apos;t quaint cultural artifacts. They were
            technologies for living well. Practical, tested, refined over
            centuries.
          </p>
          <p className="font-heading text-[17px] text-site-body leading-[1.85] mb-6">
            AXUNE was born from that realization. The name combines &ldquo;action&rdquo; with
            &ldquo;inner tune&rdquo; — the idea that external habits and internal harmony are
            inseparable. Through this website, the AXUNE app, and our growing
            community, we explore the Japanese philosophies and daily practices
            that help modern people live with more intention, clarity, and peace.
          </p>
          <p className="font-heading text-[17px] text-site-body leading-[1.85]">
            This isn&apos;t about productivity hacks or life optimization. It&apos;s about
            returning to what matters. About building a life that feels like
            home.
          </p>
        </motion.div>
      </section>

      {/* Mission / Values */}
      <section className="bg-site-bg-alt py-[60px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-3">
              OUR VALUES
            </p>
            <h2 className="font-heading text-[28px] md:text-[40px] font-bold text-site-heading">
              What we believe
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-xl p-8 shadow-site-card text-center"
              >
                <span className="text-[40px] block mb-4">{value.icon}</span>
                <h3 className="font-heading text-[22px] font-medium text-site-heading mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-[15px] text-site-secondary leading-[1.6]">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator */}
      <section className="bg-site-bg py-[60px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-10 max-w-[800px] mx-auto"
          >
            <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full bg-site-bg-alt flex-shrink-0 flex items-center justify-center">
              <span className="font-heading text-[48px] font-bold text-site-muted">
                HT
              </span>
            </div>
            <div>
              <h3 className="font-heading text-[28px] font-bold text-site-heading">
                Hiroto Takana
              </h3>
              <p className="font-body text-[15px] text-site-amber font-medium mt-1">
                Creator & Writer
              </p>
              <p className="font-body text-[16px] text-site-secondary leading-[1.7] mt-4">
                A writer, content creator, and developer based in Nagoya, Japan.
                Through AXUNE, Hiroto explores the Japanese philosophies and
                daily practices that help modern people live with more intention,
                clarity, and peace. He also runs the YouTube channels Koden
                Obscure and Invest Kaizen.
              </p>
              <div className="flex gap-4 mt-5">
                <span className="font-body text-[13px] font-semibold text-site-accent hover:underline cursor-pointer">
                  YouTube
                </span>
                <span className="font-body text-[13px] font-semibold text-site-accent hover:underline cursor-pointer">
                  Instagram
                </span>
                <span className="font-body text-[13px] font-semibold text-site-accent hover:underline cursor-pointer">
                  Substack
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
