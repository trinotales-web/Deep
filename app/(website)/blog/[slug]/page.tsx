"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Linkedin, Link2 } from "lucide-react";
import Newsletter from "@/components/website/Newsletter";

const articleData: Record<
  string,
  {
    title: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    gradient: string;
    content: { type: string; text?: string; items?: string[] }[];
    relatedPhilosophy?: { slug: string; icon: string; title: string; subtitle: string };
  }
> = {
  "ikigai-japanese-secret-life-worth-living": {
    title: "Ikigai: The Japanese Secret to a Life Worth Living",
    category: "Philosophy",
    excerpt:
      "In a culture obsessed with productivity and optimization, the ancient Japanese concept of ikigai offers a radically different approach to finding meaning and purpose in everyday life.",
    author: "Hiroto Takana",
    date: "March 15, 2026",
    readTime: "8 min",
    gradient: "linear-gradient(135deg, #E8E4DC, #D8D0C4)",
    relatedPhilosophy: {
      slug: "ikigai",
      icon: "🌸",
      title: "Ikigai",
      subtitle: "A reason for being",
    },
    content: [
      {
        type: "paragraph",
        text: "In the small village of Ogimi on the northern tip of Okinawa — often called the \"Village of Longevity\" — the residents don't have a word for retirement. They wake each morning with a clear sense of purpose, a reason that pulls them gently out of sleep and into another day of meaningful activity. This reason, this inner compass, is what the Japanese call ikigai.",
      },
      {
        type: "paragraph",
        text: "Ikigai (生き甲斐) is often translated as \"a reason for being\" or \"a reason to wake up in the morning.\" Unlike the Western pursuit of grand purpose or career ambition, ikigai is quieter, more personal, and deeply rooted in the small joys and rituals of daily life. It doesn't require you to change the world. It asks only that you find what makes your life feel worth living.",
      },
      {
        type: "heading",
        text: "The Four Circles of Ikigai",
      },
      {
        type: "paragraph",
        text: "While the popular Western interpretation presents ikigai as the intersection of four circles — what you love, what you're good at, what the world needs, and what you can be paid for — the traditional Japanese understanding is simpler and more intimate. In Japan, ikigai doesn't need to be connected to income at all. A grandmother who tends her garden every morning has ikigai. A fisherman who has cast his net the same way for forty years has ikigai.",
      },
      {
        type: "quote",
        text: "Your ikigai is at the intersection of what you are good at and what you love doing. It is not about making money or being recognized. It is the quiet joy of being alive.",
      },
      {
        type: "subheading",
        text: "Finding Ikigai in Ordinary Moments",
      },
      {
        type: "paragraph",
        text: "The people of Okinawa don't sit down one day and discover their ikigai through a grand revelation. Instead, it emerges naturally from years of paying attention to what brings them energy, peace, and a sense of contribution. For some, it's tending to their community garden. For others, it's teaching children the songs of their ancestors. For many, it's simply being present for the people they love.",
      },
      {
        type: "paragraph",
        text: "This is perhaps the most radical aspect of ikigai for Western audiences: it rejects the idea that purpose must be extraordinary. Your ikigai might be making tea for your family each morning. It might be the walk you take along the river at dusk. It might be the way you arrange flowers on your kitchen table.",
      },
      {
        type: "heading",
        text: "How to Begin Exploring Your Ikigai",
      },
      {
        type: "list",
        items: [
          "Pay attention to what activities make you lose track of time. These flow states often point toward your ikigai.",
          "Notice what you do even when nobody is watching or paying you. The things you'd do for free often carry the seeds of purpose.",
          "Reflect on your childhood joys. What did you love doing before the world told you what you should love?",
          "Start small. Ikigai doesn't require a career change. It might simply mean dedicating more time to what already nourishes you.",
          "Be patient. Ikigai reveals itself gradually, through living, not through thinking.",
        ],
      },
      {
        type: "paragraph",
        text: "In a world that constantly asks you to do more, achieve more, and become more, ikigai whispers a different message: you are already enough. Your purpose isn't somewhere out there waiting to be discovered. It's woven into the fabric of your daily life, in the small things you do with love and attention. All you need to do is notice.",
      },
    ],
  },
  "wabi-sabi-changed-way-i-see-flaws": {
    title: "How Wabi-Sabi Changed the Way I See My Flaws",
    category: "Philosophy",
    excerpt: "Embracing imperfection as a path to peace and self-acceptance.",
    author: "Hiroto Takana",
    date: "March 12, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #D8D0C4, #C8BFB0)",
    relatedPhilosophy: {
      slug: "wabi-sabi",
      icon: "🍂",
      title: "Wabi-Sabi",
      subtitle: "Beauty in imperfection",
    },
    content: [
      {
        type: "paragraph",
        text: "I used to believe that beauty meant perfection. Smooth surfaces, symmetrical lines, flawless execution. Then I spent a year living with my grandfather in Nagoya, and he showed me a different way of seeing — one that the Japanese call wabi-sabi.",
      },
      {
        type: "paragraph",
        text: "Wabi-sabi (侘寂) is the Japanese aesthetic philosophy centered on the acceptance of transience and imperfection. It finds beauty in the weathered, the asymmetrical, the incomplete. A cracked tea bowl. A fading autumn leaf. The patina of age on a wooden beam. These aren't flaws to be fixed — they're marks of character, evidence of a life lived.",
      },
      {
        type: "heading",
        text: "The Crack in the Tea Bowl",
      },
      {
        type: "paragraph",
        text: "My grandfather had a tea bowl that had been in our family for three generations. It had a long crack running down one side, repaired with simple lacquer — not gold, like kintsugi, but a humble, nearly invisible mend. When I asked him why he didn't replace it, he looked at me with gentle surprise. \"Why would I?\" he said. \"This crack is part of its story. Without it, it would just be another bowl.\"",
      },
      {
        type: "quote",
        text: "Perfection is a kind of death. It is the living, breathing imperfections that make something truly beautiful.",
      },
      {
        type: "subheading",
        text: "Applying Wabi-Sabi to Ourselves",
      },
      {
        type: "paragraph",
        text: "The real transformation came when I began applying wabi-sabi not to objects, but to myself. The scar on my knee from a childhood fall. The gray hairs appearing at my temples. The project I poured my heart into that didn't turn out as planned. Wabi-sabi taught me to see these not as failures but as textures — the rough, authentic surfaces of a real life.",
      },
      {
        type: "paragraph",
        text: "In a world of filters and carefully curated feeds, wabi-sabi is a radical act of self-acceptance. It says: you don't need to be polished to be valuable. Your rough edges, your mistakes, your visible repairs — they are what make you irreplaceable.",
      },
    ],
  },
  "7-morning-habits-zen-monks": {
    title: "7 Morning Habits Inspired by Zen Monks",
    category: "Habits",
    excerpt: "Simple rituals to start your day with clarity and intention.",
    author: "Hiroto Takana",
    date: "March 10, 2026",
    readTime: "7 min",
    gradient: "linear-gradient(135deg, #D4DDD8, #C4CFC8)",
    content: [
      {
        type: "paragraph",
        text: "Zen monks have refined their morning routines over centuries. In monasteries across Japan, the day begins before dawn with practices designed to cultivate clarity, gratitude, and presence. While most of us can't replicate monastic life, we can adapt these principles into simple morning habits.",
      },
      {
        type: "heading",
        text: "The Seven Habits",
      },
      {
        type: "list",
        items: [
          "Rise early and with intention: Zen monks wake at 4 AM, but the key isn't the hour — it's waking with purpose rather than resistance.",
          "Clean your space: Soji (cleaning) is the first activity of the day in a Zen monastery. Even five minutes of tidying creates mental clarity.",
          "Drink warm water mindfully: Before tea or coffee, warm water cleanses the body. Drink it slowly, feeling its warmth.",
          "Sit in stillness: Even five minutes of seated meditation sets the tone for an intentional day.",
          "Move your body gently: Zen monks practice walking meditation. A simple stretch or slow walk achieves the same grounding.",
          "Eat breakfast with full attention: Oryoki, the Zen practice of mindful eating, transforms a simple meal into a meditation.",
          "Set a single intention: Not a to-do list, but one guiding principle for the day ahead.",
        ],
      },
      {
        type: "quote",
        text: "How you begin your morning is how you begin your life. Each day is a complete lifetime in miniature.",
      },
      {
        type: "paragraph",
        text: "The beauty of these habits is their simplicity. You don't need special equipment, apps, or a two-hour morning routine. You need only the willingness to slow down and pay attention to the first moments of your day. Start with one habit. Practice it for a week. Then add another. This is the way of kaizen — small, continuous improvement.",
      },
    ],
  },
};

// Default article for unmatched slugs
const defaultArticle = {
  title: "Article Coming Soon",
  category: "Philosophy",
  excerpt: "This article is being crafted with care and will be available soon.",
  author: "Hiroto Takana",
  date: "March 2026",
  readTime: "5 min",
  gradient: "linear-gradient(135deg, #E8E4DC, #D8D0C4)",
  content: [
    {
      type: "paragraph" as const,
      text: "This article is currently being written. Please check back soon for the full content. In the meantime, explore our other articles and the Philosophy Library for Japanese wisdom and insights.",
    },
  ],
};

const relatedArticles = [
  {
    slug: "wabi-sabi-changed-way-i-see-flaws",
    title: "How Wabi-Sabi Changed the Way I See My Flaws",
    category: "Philosophy",
    date: "Mar 12, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #D8D0C4, #C8BFB0)",
  },
  {
    slug: "kintsugi-beauty-of-being-broken",
    title: "Kintsugi and the Beauty of Being Broken",
    category: "Philosophy",
    date: "Feb 22, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #DCD4D8, #CCC4C8)",
  },
  {
    slug: "ichigo-ichie-treasure-every-moment",
    title: "Ichigo Ichie: How to Treasure Every Single Moment",
    category: "Philosophy",
    date: "Feb 12, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #E0D8DC, #D0C8CC)",
  },
];

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = articleData[params.slug] || defaultArticle;

  return (
    <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[100px]">
      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-article mx-auto px-5"
      >
        <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber">
          {article.category.toUpperCase()}
        </p>
        <h1 className="font-heading text-[32px] md:text-[44px] font-bold text-site-heading leading-[1.2] mt-3">
          {article.title}
        </h1>
        <p className="font-body text-[16px] md:text-[18px] text-site-secondary leading-[1.6] mt-3.5">
          {article.excerpt}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-5">
          <div className="w-8 h-8 rounded-full bg-site-bg-alt flex items-center justify-center">
            <span className="text-[12px] font-semibold text-site-secondary">
              HT
            </span>
          </div>
          <p className="font-body text-[14px] text-site-muted">
            By <span className="font-medium text-site-body">{article.author}</span>{" "}
            · {article.date} · {article.readTime} read
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex gap-3 mt-4">
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
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-article mx-auto px-5 mt-8"
      >
        <div
          className="aspect-[16/9] rounded-xl flex items-center justify-center"
          style={{ background: article.gradient }}
        >
          <span className="text-site-muted text-sm font-body">
            Article Image
          </span>
        </div>
      </motion.div>

      {/* Article Body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-article mx-auto px-5 mt-10 article-body"
      >
        {article.content.map((block, i) => {
          switch (block.type) {
            case "paragraph":
              return <p key={i}>{block.text}</p>;
            case "heading":
              return <h2 key={i}>{block.text}</h2>;
            case "subheading":
              return <h3 key={i}>{block.text}</h3>;
            case "quote":
              return <blockquote key={i}>{block.text}</blockquote>;
            case "list":
              return (
                <ul key={i}>
                  {block.items?.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            default:
              return null;
          }
        })}

        {/* Related Philosophy Card */}
        {article.relatedPhilosophy && (
          <Link
            href={`/philosophy/${article.relatedPhilosophy.slug}`}
            className="block bg-site-bg-alt rounded-xl p-6 my-9 hover:shadow-site-card transition-shadow"
          >
            <div className="flex items-start gap-4">
              <span className="text-[32px]">
                {article.relatedPhilosophy.icon}
              </span>
              <div>
                <h4 className="font-heading text-[18px] font-medium text-site-heading">
                  {article.relatedPhilosophy.title}
                </h4>
                <p className="font-body text-[14px] italic text-site-amber">
                  {article.relatedPhilosophy.subtitle}
                </p>
                <p className="font-body text-[13px] font-semibold text-site-accent mt-2">
                  Learn more in the Philosophy Library →
                </p>
              </div>
            </div>
          </Link>
        )}
      </motion.div>

      {/* Author Bio */}
      <div className="max-w-article mx-auto px-5 mt-12 pt-8 border-t border-site-border">
        <div className="flex gap-5">
          <div className="w-16 h-16 rounded-full bg-site-bg-alt flex-shrink-0 flex items-center justify-center">
            <span className="font-heading text-[20px] font-bold text-site-secondary">
              HT
            </span>
          </div>
          <div>
            <h4 className="font-heading text-[18px] font-medium text-site-heading">
              About {article.author}
            </h4>
            <p className="font-body text-[15px] text-site-secondary leading-[1.6] mt-2">
              A writer and content creator based in Nagoya, Japan. Through
              AXUNE, Hiroto explores the Japanese philosophies and daily
              practices that help modern people live with more intention,
              clarity, and peace.
            </p>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="max-w-site mx-auto px-5 mt-16">
        <h3 className="font-heading text-[28px] font-medium text-site-heading mb-8">
          Continue Reading
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedArticles.map((ra, i) => (
            <motion.div
              key={ra.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${ra.slug}`}
                className="group block hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="aspect-[16/10] rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ background: ra.gradient }}
                >
                  <span className="text-site-muted text-sm font-body">
                    Article Image
                  </span>
                </div>
                <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mt-4">
                  {ra.category.toUpperCase()}
                </p>
                <h3 className="font-heading text-[18px] md:text-[20px] font-medium text-site-heading mt-1.5 group-hover:text-site-accent transition-colors">
                  {ra.title}
                </h3>
                <p className="font-body text-[13px] text-site-muted mt-3">
                  Hiroto Takana · {ra.date} · {ra.readTime} read
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 bg-site-bg-alt py-[60px]">
        <Newsletter variant="compact" />
      </div>
    </div>
  );
}
