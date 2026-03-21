"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";

const categories = ["All", "Mindset", "Aesthetics", "Practices", "Nature", "Relationships"];

const philosophies = [
  { slug: "ikigai", icon: "🌸", title: "Ikigai", subtitle: "A reason for being", category: "Mindset", accentColor: "#2D5A3D", preview: "Discover the intersection of passion, mission, vocation, and profession to find your reason for being." },
  { slug: "wabi-sabi", icon: "🍂", title: "Wabi-Sabi", subtitle: "Beauty in imperfection", category: "Aesthetics", accentColor: "#C4956B", preview: "A worldview centered on acceptance of transience and imperfection, finding beauty in the incomplete." },
  { slug: "kaizen", icon: "📈", title: "Kaizen", subtitle: "Continuous improvement", category: "Mindset", accentColor: "#2D5A3D", preview: "The practice of continuous improvement through small, daily changes that compound over time." },
  { slug: "kintsugi", icon: "✨", title: "Kintsugi", subtitle: "Golden repair", category: "Mindset", accentColor: "#2D5A3D", preview: "The art of repairing broken pottery with gold, treating breakage as part of an object's history." },
  { slug: "mushin", icon: "🌊", title: "Mushin", subtitle: "Mind without mind", category: "Mindset", accentColor: "#2D5A3D", preview: "A mental state of no-mindedness, free from thoughts of anger, fear, and ego during combat or daily life." },
  { slug: "shoshin", icon: "🌱", title: "Shoshin", subtitle: "Beginner's mind", category: "Mindset", accentColor: "#2D5A3D", preview: "An attitude of openness, eagerness, and lack of preconceptions, even at an advanced level." },
  { slug: "gaman", icon: "💪", title: "Gaman", subtitle: "Enduring patience", category: "Mindset", accentColor: "#2D5A3D", preview: "The Japanese value of enduring the seemingly unbearable with patience and dignity." },
  { slug: "gambatte", icon: "🔥", title: "Gambatte", subtitle: "Do your best", category: "Mindset", accentColor: "#2D5A3D", preview: "An expression of encouragement meaning to do one's best and persevere through challenges." },
  { slug: "mono-no-aware", icon: "🌸", title: "Mono no Aware", subtitle: "Pathos of things", category: "Mindset", accentColor: "#2D5A3D", preview: "A bittersweet awareness of the transience of things, and a gentle sadness at their passing." },
  { slug: "nanakorobi-yaoki", icon: "🎋", title: "Nanakorobi Yaoki", subtitle: "Fall seven, rise eight", category: "Mindset", accentColor: "#2D5A3D", preview: "The spirit of resilience — no matter how many times you fall, you always get back up." },
  { slug: "shu-ha-ri", icon: "📚", title: "Shu Ha Ri", subtitle: "Stages of mastery", category: "Mindset", accentColor: "#2D5A3D", preview: "Three stages of learning: obey, detach, transcend. The path from student to master." },
  { slug: "oubaitori", icon: "🌺", title: "Oubaitori", subtitle: "Never compare yourself", category: "Mindset", accentColor: "#2D5A3D", preview: "Like the cherry, plum, peach, and apricot — each blooms in its own time. Never compare." },
  { slug: "ma", icon: "空", title: "Ma", subtitle: "Negative space", category: "Aesthetics", accentColor: "#C4956B", preview: "The concept of negative space, the pause between notes, the silence between words." },
  { slug: "kanso", icon: "🎍", title: "Kanso", subtitle: "Simplicity", category: "Aesthetics", accentColor: "#C4956B", preview: "Elimination of clutter and the expression of things in a plain, natural manner." },
  { slug: "fukinsei", icon: "⚡", title: "Fukinsei", subtitle: "Asymmetry", category: "Aesthetics", accentColor: "#C4956B", preview: "The beauty found in irregularity and asymmetry, rejecting perfect balance in favor of natural flow." },
  { slug: "shibui", icon: "🎎", title: "Shibui", subtitle: "Subtle beauty", category: "Aesthetics", accentColor: "#C4956B", preview: "An aesthetic of simple, subtle, and unobtrusive beauty that grows on you over time." },
  { slug: "datsuzoku", icon: "🦋", title: "Datsuzoku", subtitle: "Freedom from routine", category: "Aesthetics", accentColor: "#C4956B", preview: "Breaking free from the conventional and routine to discover new perspectives and possibilities." },
  { slug: "seijaku", icon: "🤫", title: "Seijaku", subtitle: "Stillness in chaos", category: "Aesthetics", accentColor: "#C4956B", preview: "Finding tranquility and active calm in the midst of activity and chaos." },
  { slug: "shizen", icon: "🍃", title: "Shizen", subtitle: "Naturalness", category: "Aesthetics", accentColor: "#C4956B", preview: "The quality of naturalness, avoiding artificiality and forced design in art and life." },
  { slug: "yugen", icon: "🌙", title: "Yūgen", subtitle: "Mysterious grace", category: "Aesthetics", accentColor: "#C4956B", preview: "A profound, mysterious sense of the beauty of the universe and the sad beauty of human suffering." },
  { slug: "miyabi", icon: "👘", title: "Miyabi", subtitle: "Refined elegance", category: "Aesthetics", accentColor: "#C4956B", preview: "The elimination of anything that is absurd or vulgar in favor of refined, courtly elegance." },
  { slug: "iki", icon: "🎭", title: "Iki", subtitle: "Sophisticated style", category: "Aesthetics", accentColor: "#C4956B", preview: "An aesthetic ideal of effortless sophistication, originality, and bold simplicity." },
  { slug: "engawa", icon: "🏡", title: "Engawa", subtitle: "Threshold spaces", category: "Aesthetics", accentColor: "#C4956B", preview: "The transitional space between inside and outside, between private and public worlds." },
  { slug: "komorebi", icon: "☀️", title: "Komorebi", subtitle: "Sunlight through leaves", category: "Aesthetics", accentColor: "#C4956B", preview: "The interplay of light and leaves when sunlight filters through the canopy of trees." },
  { slug: "shinrin-yoku", icon: "🌲", title: "Shinrin-yoku", subtitle: "Forest bathing", category: "Practices", accentColor: "#8B7355", preview: "The practice of immersing yourself in nature to restore calm and reduce stress." },
  { slug: "ichigyo-zammai", icon: "🎯", title: "Ichigyo-zammai", subtitle: "Full concentration", category: "Practices", accentColor: "#8B7355", preview: "Giving yourself fully to one task at a time, with complete, undivided attention." },
  { slug: "hansei", icon: "🪞", title: "Hansei", subtitle: "Self-reflection", category: "Practices", accentColor: "#8B7355", preview: "The practice of acknowledging your mistakes and pledging to improve." },
  { slug: "misogi", icon: "💧", title: "Misogi", subtitle: "Ritual purification", category: "Practices", accentColor: "#8B7355", preview: "A cleansing ritual of standing under cold waterfalls to purify body and spirit." },
  { slug: "chado", icon: "🍵", title: "Chado", subtitle: "The way of tea", category: "Practices", accentColor: "#8B7355", preview: "The Japanese tea ceremony — a choreographic ritual of preparing and serving matcha." },
  { slug: "shodo", icon: "✍️", title: "Shodo", subtitle: "The way of writing", category: "Practices", accentColor: "#8B7355", preview: "Japanese calligraphy as a meditative art form that cultivates presence and beauty." },
  { slug: "kodo", icon: "🌿", title: "Kodo", subtitle: "The way of incense", category: "Practices", accentColor: "#8B7355", preview: "The art of appreciating incense through careful observation and stillness." },
  { slug: "ikebana", icon: "💐", title: "Ikebana", subtitle: "The way of flowers", category: "Practices", accentColor: "#8B7355", preview: "The Japanese art of flower arranging that emphasizes form, line, and minimalism." },
  { slug: "seiri-seiton", icon: "🗂️", title: "Seiri Seiton", subtitle: "Sort and organize", category: "Practices", accentColor: "#8B7355", preview: "The first two S's of 5S — sorting what's needed and organizing it with purpose." },
  { slug: "mokusatsu", icon: "🤐", title: "Mokusatsu", subtitle: "Silent contemplation", category: "Practices", accentColor: "#8B7355", preview: "The practice of killing with silence — taking time to contemplate before responding." },
  { slug: "nemawashi", icon: "🌳", title: "Nemawashi", subtitle: "Building consensus", category: "Practices", accentColor: "#8B7355", preview: "Laying the groundwork for change by talking to people and building consensus slowly." },
  { slug: "takumi", icon: "🔨", title: "Takumi", subtitle: "Artisan mastery", category: "Practices", accentColor: "#8B7355", preview: "The pursuit of mastery in craft through decades of devoted, patient practice." },
  { slug: "hanami", icon: "🌸", title: "Hanami", subtitle: "Flower viewing", category: "Nature", accentColor: "#7AAE8B", preview: "The traditional custom of enjoying the transient beauty of cherry blossoms." },
  { slug: "tsukimi", icon: "🌕", title: "Tsukimi", subtitle: "Moon viewing", category: "Nature", accentColor: "#7AAE8B", preview: "Autumn moon-viewing gatherings that celebrate the beauty of the full moon." },
  { slug: "yukimi", icon: "❄️", title: "Yukimi", subtitle: "Snow viewing", category: "Nature", accentColor: "#7AAE8B", preview: "The quiet pleasure of watching snow fall and settle, appreciating winter's beauty." },
  { slug: "momijigari", icon: "🍁", title: "Momijigari", subtitle: "Autumn leaf hunting", category: "Nature", accentColor: "#7AAE8B", preview: "The tradition of visiting places where autumn leaves are at their most beautiful." },
  { slug: "hotarugari", icon: "🪲", title: "Hotarugari", subtitle: "Firefly hunting", category: "Nature", accentColor: "#7AAE8B", preview: "The summer tradition of going to rivers and fields to watch fireflies dance." },
  { slug: "sakura", icon: "🌸", title: "Sakura", subtitle: "Cherry blossom spirit", category: "Nature", accentColor: "#7AAE8B", preview: "The cherry blossom as a symbol of the beauty and fragility of life." },
  { slug: "kogarashi", icon: "🍂", title: "Kogarashi", subtitle: "First autumn wind", category: "Nature", accentColor: "#7AAE8B", preview: "The cold wind that signals the arrival of winter, stripping leaves from trees." },
  { slug: "negai", icon: "⭐", title: "Negai", subtitle: "Power of wishes", category: "Nature", accentColor: "#7AAE8B", preview: "The tradition of making wishes on stars, tanabata strips, and natural phenomena." },
  { slug: "fuyu-no-hanabi", icon: "🎆", title: "Fuyu no Hanabi", subtitle: "Winter fireworks", category: "Nature", accentColor: "#7AAE8B", preview: "The beauty of fireworks against cold winter skies, celebrating warmth in cold." },
  { slug: "umi", icon: "🌊", title: "Umi", subtitle: "The way of the sea", category: "Nature", accentColor: "#7AAE8B", preview: "The ocean as teacher — learning patience, power, and humility from the waves." },
  { slug: "satoyama", icon: "🏔️", title: "Satoyama", subtitle: "Village mountain harmony", category: "Nature", accentColor: "#7AAE8B", preview: "The landscape where human settlement meets wild mountain, a model of ecological harmony." },
  { slug: "shinme", icon: "🌾", title: "Shinme", subtitle: "Sacred renewal", category: "Nature", accentColor: "#7AAE8B", preview: "New growth and sacred renewal, the fresh shoots that represent hope and regeneration." },
  { slug: "ichigo-ichie", icon: "☕", title: "Ichigo Ichie", subtitle: "One time, one meeting", category: "Relationships", accentColor: "#D4A0B0", preview: "Treasure every encounter, for it will never recur in exactly the same way." },
  { slug: "omotenashi", icon: "🎁", title: "Omotenashi", subtitle: "Selfless hospitality", category: "Relationships", accentColor: "#D4A0B0", preview: "Wholehearted hospitality without expectation of reward or reciprocation." },
  { slug: "omoiyari", icon: "💝", title: "Omoiyari", subtitle: "Compassionate empathy", category: "Relationships", accentColor: "#D4A0B0", preview: "The ability to sense and anticipate the needs and feelings of others." },
  { slug: "kizuna", icon: "🤝", title: "Kizuna", subtitle: "Deep bonds", category: "Relationships", accentColor: "#D4A0B0", preview: "The deep, enduring bonds between people that are strengthened through shared experience." },
  { slug: "wa", icon: "🕊️", title: "Wa", subtitle: "Harmony", category: "Relationships", accentColor: "#D4A0B0", preview: "The principle of harmony and peaceful unity, avoiding conflict and promoting cooperation." },
  { slug: "on", icon: "🙏", title: "On", subtitle: "Gratitude and obligation", category: "Relationships", accentColor: "#D4A0B0", preview: "The weight of gratitude and social obligation that comes from receiving kindness." },
  { slug: "senpai-kohai", icon: "👥", title: "Senpai-Kohai", subtitle: "Mentorship", category: "Relationships", accentColor: "#D4A0B0", preview: "The mentor-student relationship that structures learning, respect, and guidance." },
  { slug: "mottainai", icon: "♻️", title: "Mottainai", subtitle: "Nothing wasted", category: "Relationships", accentColor: "#D4A0B0", preview: "A sense of regret over waste — expressing respect for resources and the effort behind them." },
  { slug: "otsukaresama", icon: "🫂", title: "Otsukaresama", subtitle: "Acknowledging effort", category: "Relationships", accentColor: "#D4A0B0", preview: "A daily expression that honors the effort and tiredness of others after their work." },
  { slug: "amae", icon: "🫶", title: "Amae", subtitle: "Sweet dependence", category: "Relationships", accentColor: "#D4A0B0", preview: "The desire to be lovingly cared for, a uniquely Japanese concept of healthy dependence." },
  { slug: "tatemae-honne", icon: "🎭", title: "Tatemae-Honne", subtitle: "Public and private self", category: "Relationships", accentColor: "#D4A0B0", preview: "The distinction between one's public facade and true feelings — social harmony through discretion." },
  { slug: "nakama", icon: "👫", title: "Nakama", subtitle: "Companions in purpose", category: "Relationships", accentColor: "#D4A0B0", preview: "Close friends who share a common goal or journey — deeper than friendship, a chosen family." },
];

export default function PhilosophyLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = philosophies;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.preview.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[100px]">
      <div className="max-w-site mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-site-heading">
            Philosophy Library
          </h1>
          <p className="font-body text-[17px] text-site-secondary mt-3">
            60 Japanese concepts for a more intentional life
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2.5 mb-6"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-site-dark text-white"
                  : "bg-transparent border-[1.5px] border-site-border text-site-secondary hover:border-site-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-[480px] mx-auto mb-12"
        >
          <div className="relative">
            <Search
              size={16}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-site-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search philosophies..."
              className="w-full h-12 rounded-full border-[1.5px] border-site-border bg-white pl-12 pr-5 font-body text-[15px] text-site-body placeholder:text-site-muted focus:border-site-accent focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
            >
              <Link
                href={`/philosophy/${p.slug}`}
                className="group block bg-white rounded-xl p-6 shadow-site-card hover:-translate-y-1 hover:shadow-site-card-hover transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-[40px] mb-4"
                  style={{ backgroundColor: `${p.accentColor}14` }}
                >
                  {p.icon}
                </div>
                <h3 className="font-heading text-[20px] font-medium text-site-heading">
                  {p.title}
                </h3>
                <p
                  className="font-body text-[14px] italic mt-1"
                  style={{ color: p.accentColor }}
                >
                  {p.subtitle}
                </p>
                <p className="font-body text-[14px] text-site-secondary leading-[1.6] mt-2 line-clamp-2">
                  {p.preview}
                </p>
                <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-muted mt-3">
                  {p.category.toUpperCase()}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-site-muted text-[16px]">
              No philosophies found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
