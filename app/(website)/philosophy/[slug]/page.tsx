"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Linkedin, Link2 } from "lucide-react";

const philosophyData: Record<
  string,
  {
    icon: string;
    title: string;
    subtitle: string;
    accentColor: string;
    category: string;
    description: string;
    origin: string;
    practices: { title: string; description: string }[];
  }
> = {
  ikigai: {
    icon: "🌸",
    title: "Ikigai",
    subtitle: "A reason for being",
    accentColor: "#2D5A3D",
    category: "Mindset",
    description:
      "Ikigai (生き甲斐) is a Japanese concept referring to something that gives a person a sense of purpose, a reason for living. Unlike the Western pursuit of a single grand purpose, ikigai is found in the small, daily rituals that make life meaningful — tending a garden, sharing tea with a friend, mastering a craft over decades.\n\nThe people of Okinawa, one of the world's Blue Zones where residents regularly live past 100, attribute their longevity partly to ikigai. They don't have a word for retirement because they never stop engaging with what gives them purpose. Their ikigai might be as simple as growing vegetables for their grandchildren or teaching traditional dance to young people.\n\nIn its truest form, ikigai doesn't require grand ambitions or world-changing goals. It asks only that you pay attention to what brings you alive, what makes time disappear, what you would do even if nobody noticed or paid you for it. Your ikigai might shift throughout your life — and that's perfectly natural. What matters is that you keep listening for it.",
    origin:
      "The word ikigai combines 'iki' (生き, life) and 'gai' (甲斐, worth/value). It has been part of Japanese culture since the Heian period (794-1185), originally associated with the source of value in one's life. The concept gained global attention through Dan Buettner's research on Blue Zones and Héctor García's book 'Ikigai: The Japanese Secret to a Long and Happy Life.'",
    practices: [
      {
        title: "Morning Intention Setting",
        description:
          "Each morning, before reaching for your phone, sit quietly and ask yourself: What am I looking forward to today? What will bring me energy? Write down one small thing that gives your day purpose. This daily practice gradually reveals patterns that point toward your ikigai.",
      },
      {
        title: "Joy Inventory",
        description:
          "Spend a week tracking moments when you feel most alive, most engaged, most yourself. Note what you're doing, who you're with, and what skills you're using. After seven days, look for patterns. Your ikigai often hides in the activities you'd never think to list on a resume.",
      },
      {
        title: "The Subtraction Method",
        description:
          "Instead of adding more to your life, try removing what doesn't serve you. Cancel one obligation that drains you. Say no to one activity that feels hollow. In the space that opens, notice what your heart naturally reaches for. Ikigai appears when there's room for it.",
      },
      {
        title: "Community Connection",
        description:
          "In Okinawa, ikigai is deeply connected to community. Join or create a moai — a small group of people who meet regularly for support and companionship. Share your evolving sense of purpose with others. Often, our ikigai becomes clearer when reflected through the eyes of people who know us well.",
      },
    ],
  },
  "wabi-sabi": {
    icon: "🍂",
    title: "Wabi-Sabi",
    subtitle: "Beauty in imperfection",
    accentColor: "#C4956B",
    category: "Aesthetics",
    description:
      "Wabi-sabi (侘寂) is the Japanese aesthetic philosophy centered on accepting the beauty of imperfection, impermanence, and incompleteness. Rooted in Zen Buddhism, it represents a comprehensive worldview that finds richness in simplicity and depth in the natural cycle of growth, decay, and renewal.\n\nWabi originally referred to the loneliness of living in nature, remote from society, while sabi meant 'cold,' 'lean,' or 'withered.' Over time, these evolved to represent a positive aesthetic: wabi suggests rustic simplicity and quietness, while sabi conveys the beauty that comes with age and wear.\n\nIn daily life, wabi-sabi manifests as the cracked glaze on a beloved tea bowl, the weathered wood of an old temple, the asymmetry of a hand-thrown pot. It's the moss growing between flagstones, the patina on copper, the slight irregularity in handmade paper. Rather than covering these signs of time and use, wabi-sabi celebrates them as evidence of authenticity and lived experience.",
    origin:
      "Wabi-sabi traces its roots to the tea ceremony traditions of Sen no Rikyū in the 16th century. Rikyū rejected the ornate Chinese-style tea culture in favor of simple, rustic vessels and humble tea rooms. The aesthetic draws deeply from Zen Buddhist teachings on the Three Marks of Existence: impermanence (mujō), suffering (ku), and emptiness (kū).",
    practices: [
      {
        title: "Repair Instead of Replace",
        description:
          "The next time something in your home breaks — a bowl, a piece of clothing, a piece of furniture — repair it instead of throwing it away. Use the repair as an opportunity to add character. The mend becomes part of the object's story, a mark of resilience rather than damage.",
      },
      {
        title: "Find Beauty in Decay",
        description:
          "Take a walk and photograph five things that show the beauty of age, wear, or natural decay — peeling paint, a weathered bench, fallen leaves, rust on iron. Train your eye to see these not as flaws but as textures that tell stories. Share them with someone.",
      },
      {
        title: "Embrace Imperfect Work",
        description:
          "Create something without trying to make it perfect. Write a poem without editing it. Draw without erasing. Cook without a recipe. The goal is not polished output but authentic expression. Notice how freeing it feels to release the demand for perfection.",
      },
      {
        title: "Simplify One Space",
        description:
          "Choose one surface or shelf in your home. Remove everything from it, then add back only what is truly meaningful or necessary. Leave some space empty. Notice how the emptiness itself becomes beautiful, how fewer objects allow each remaining one to breathe and be appreciated.",
      },
    ],
  },
  "shinrin-yoku": {
    icon: "🌲",
    title: "Shinrin-yoku",
    subtitle: "Forest bathing",
    accentColor: "#7AAE8B",
    category: "Practices",
    description:
      "Shinrin-yoku (森林浴) literally translates to 'forest bathing' — the practice of immersing yourself in a forest environment, not for exercise or hiking, but simply to be present among the trees. Developed in Japan in the 1980s as a form of nature therapy, it has since been backed by extensive scientific research showing measurable health benefits.\n\nThe practice is deceptively simple: walk slowly through a forest, breathe deeply, and engage all five senses. Touch the bark of trees. Listen to birdsong and the rustle of leaves. Smell the phytoncides — natural oils released by trees that have been shown to boost the immune system, reduce cortisol levels, and lower blood pressure.\n\nShinrin-yoku is not about covering distance or reaching a destination. It's about slowing down enough to let the forest work its medicine on you. Studies from Chiba University and other institutions have shown that just two hours in a forest environment can significantly reduce stress hormones, increase natural killer cell activity, and improve mood and cognitive function.",
    origin:
      "The term was coined by the Japanese Ministry of Agriculture, Forestry, and Fisheries in 1982 as part of a national health program. Dr. Qing Li of Nippon Medical School became the leading researcher, conducting studies that demonstrated the physiological benefits of forest environments. Today, Japan has 62 designated Forest Therapy bases across the country.",
    practices: [
      {
        title: "Weekly Forest Visit",
        description:
          "Commit to spending at least two hours in a forested area each week. Leave your phone on silent. Walk slowly — much slower than your normal pace. Stop frequently. There is no destination. Your only task is to be present and allow the forest to wash over your senses.",
      },
      {
        title: "Five Senses Walk",
        description:
          "During your forest visit, consciously engage each sense one at a time. Spend five minutes just listening. Five minutes touching different textures — bark, moss, leaves, stone. Five minutes breathing deeply and noticing scents. Five minutes observing colors and patterns of light.",
      },
      {
        title: "Tree Breathing",
        description:
          "Find a tree that calls to you and sit or stand near it for ten minutes. Place your hand on its trunk if you wish. Synchronize your breathing — slow, deep inhales and exhales. Imagine breathing in the phytoncides and oxygen the tree is releasing. This isn't mysticism; trees genuinely release beneficial compounds.",
      },
      {
        title: "Nature Micro-doses",
        description:
          "When you can't reach a forest, bring nature to you. Keep a small plant on your desk. Open windows to let in natural sounds. Take your lunch break in the nearest park. Even brief exposure to nature — as little as 15 minutes — has measurable stress-reduction benefits.",
      },
    ],
  },
};

// Default for unknown slugs
const defaultPhilosophy = {
  icon: "🌿",
  title: "Philosophy",
  subtitle: "Japanese wisdom",
  accentColor: "#2D5A3D",
  category: "Mindset",
  description:
    "This philosophy page is being enriched with detailed content. Please explore our Philosophy Library for all 60 Japanese concepts, each offering timeless wisdom for modern living.",
  origin:
    "Rooted in centuries of Japanese tradition and Zen Buddhist philosophy.",
  practices: [
    {
      title: "Daily Reflection",
      description:
        "Take five minutes each day to reflect on how this concept appears in your daily life. Journal your observations and notice how awareness itself begins to shift your perspective.",
    },
    {
      title: "Mindful Application",
      description:
        "Choose one specific situation today where you can consciously apply this philosophy. Start small — a single conversation, a single task, a single moment of pause.",
    },
    {
      title: "Share the Wisdom",
      description:
        "Discuss this concept with someone you trust. Teaching and sharing philosophical ideas deepens your own understanding and creates meaningful connections.",
    },
    {
      title: "Create a Ritual",
      description:
        "Design a simple daily ritual that embodies this philosophy. It could be as brief as a one-minute morning intention or an evening gratitude practice.",
    },
  ],
};

const relatedPhilosophies = [
  { slug: "wabi-sabi", icon: "🍂", title: "Wabi-Sabi", subtitle: "Beauty in imperfection", accentColor: "#C4956B" },
  { slug: "kaizen", icon: "📈", title: "Kaizen", subtitle: "Continuous improvement", accentColor: "#2D5A3D" },
  { slug: "kintsugi", icon: "✨", title: "Kintsugi", subtitle: "Golden repair", accentColor: "#2D5A3D" },
];

const relatedArticles = [
  { slug: "ikigai-japanese-secret-life-worth-living", title: "Ikigai: The Japanese Secret to a Life Worth Living", category: "Philosophy", readTime: "8 min", gradient: "linear-gradient(135deg, #E8E4DC, #D8D0C4)" },
  { slug: "wabi-sabi-changed-way-i-see-flaws", title: "How Wabi-Sabi Changed the Way I See My Flaws", category: "Philosophy", readTime: "6 min", gradient: "linear-gradient(135deg, #D8D0C4, #C8BFB0)" },
];

export default function PhilosophyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = philosophyData[params.slug] || { ...defaultPhilosophy, title: params.slug.split("-").map(w => w[0]?.toUpperCase() + w.slice(1)).join(" ") };

  return (
    <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[100px]">
      <div className="max-w-site mx-auto px-5">
        {/* Breadcrumb */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-body text-[13px] text-site-muted mb-6"
        >
          <Link href="/philosophy" className="hover:text-site-accent transition-colors">
            Philosophy Library
          </Link>{" "}
          ›{" "}
          <Link href={`/philosophy?cat=${p.category}`} className="hover:text-site-accent transition-colors">
            {p.category}
          </Link>{" "}
          › {p.title}
        </motion.p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 max-w-article">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[56px] block mb-4">{p.icon}</span>
              <h1 className="font-heading text-[36px] md:text-[44px] font-bold text-site-heading">
                {p.title}
              </h1>
              <p
                className="font-body text-[18px] italic mt-2"
                style={{ color: p.accentColor }}
              >
                {p.subtitle}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-[1px] uppercase border border-site-border text-site-muted">
                  {p.category}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-10"
            >
              {p.description.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="font-body text-[17px] text-site-body leading-[1.85] mb-6"
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Origin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-4">
                ORIGIN
              </p>
              <p className="font-heading text-[17px] italic text-site-body leading-[1.85]">
                {p.origin}
              </p>
            </motion.div>

            {/* Practices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-6">
                HOW TO PRACTICE
              </p>
              <div className="space-y-6">
                {p.practices.map((practice, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-site-bg-alt flex items-center justify-center font-heading text-[16px] font-bold text-site-secondary">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-[18px] font-medium text-site-heading">
                        {practice.title}
                      </h3>
                      <p className="font-body text-[15px] text-site-secondary leading-[1.7] mt-1">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Related Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-6">
                RELATED ARTICLES
              </p>
              <div className="space-y-4">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group flex gap-4 p-4 rounded-xl hover:bg-site-bg-alt transition-colors"
                  >
                    <div
                      className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: article.gradient }}
                    />
                    <div>
                      <h4 className="font-heading text-[16px] font-medium text-site-heading group-hover:text-site-accent transition-colors">
                        {article.title}
                      </h4>
                      <p className="font-body text-[13px] text-site-muted mt-1">
                        {article.category} · {article.readTime} read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Related Philosophies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-6">
                EXPLORE RELATED
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPhilosophies.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/philosophy/${rp.slug}`}
                    className="group bg-white rounded-xl p-5 shadow-site-card hover:-translate-y-1 hover:shadow-site-card-hover transition-all duration-300"
                  >
                    <span className="text-[32px]">{rp.icon}</span>
                    <h4 className="font-heading text-[18px] font-medium text-site-heading mt-2 group-hover:text-site-accent transition-colors">
                      {rp.title}
                    </h4>
                    <p
                      className="font-body text-[13px] italic mt-1"
                      style={{ color: rp.accentColor }}
                    >
                      {rp.subtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-[100px] space-y-6">
              {/* Practice CTA */}
              <div className="bg-site-bg-alt rounded-xl p-5">
                <h4 className="font-heading text-[16px] font-medium text-site-heading mb-2">
                  Practice this today
                </h4>
                <p className="font-body text-[14px] text-site-secondary leading-[1.6] mb-4">
                  {p.practices[0]?.description.slice(0, 120)}...
                </p>
                <Link
                  href="/download"
                  className="block text-center bg-site-accent hover:bg-site-accent-hover text-white px-5 py-2.5 rounded-lg font-body text-[13px] font-semibold transition-colors"
                >
                  Get the AXUNE App →
                </Link>
              </div>

              {/* Share */}
              <div className="bg-white rounded-xl p-5 shadow-site-card">
                <h4 className="font-body text-[13px] font-semibold text-site-heading mb-3">
                  Share
                </h4>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-full border border-site-border flex items-center justify-center hover:bg-site-bg-alt transition-colors">
                    <Twitter size={14} className="text-site-muted" />
                  </button>
                  <button className="w-9 h-9 rounded-full border border-site-border flex items-center justify-center hover:bg-site-bg-alt transition-colors">
                    <Linkedin size={14} className="text-site-muted" />
                  </button>
                  <button className="w-9 h-9 rounded-full border border-site-border flex items-center justify-center hover:bg-site-bg-alt transition-colors">
                    <Link2 size={14} className="text-site-muted" />
                  </button>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="bg-white rounded-xl p-5 shadow-site-card">
                <h4 className="font-body text-[13px] font-semibold text-site-heading mb-3">
                  On this page
                </h4>
                <nav className="space-y-2">
                  <p className="font-body text-[13px] text-site-secondary hover:text-site-accent cursor-pointer transition-colors">
                    Description
                  </p>
                  <p className="font-body text-[13px] text-site-secondary hover:text-site-accent cursor-pointer transition-colors">
                    Origin
                  </p>
                  <p className="font-body text-[13px] text-site-secondary hover:text-site-accent cursor-pointer transition-colors">
                    How to Practice
                  </p>
                  <p className="font-body text-[13px] text-site-secondary hover:text-site-accent cursor-pointer transition-colors">
                    Related Articles
                  </p>
                  <p className="font-body text-[13px] text-site-secondary hover:text-site-accent cursor-pointer transition-colors">
                    Explore Related
                  </p>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
