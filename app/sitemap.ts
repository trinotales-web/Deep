import { MetadataRoute } from "next";

const baseUrl = "https://axune.co";

const philosophySlugs = [
  "ikigai", "wabi-sabi", "kaizen", "kintsugi", "mushin", "shoshin",
  "gaman", "gambatte", "mono-no-aware", "nanakorobi-yaoki", "shu-ha-ri", "oubaitori",
  "ma", "kanso", "fukinsei", "shibui", "datsuzoku", "seijaku",
  "shizen", "yugen", "miyabi", "iki", "engawa", "komorebi",
  "shinrin-yoku", "ichigyo-zammai", "hansei", "misogi", "chado", "shodo",
  "kodo", "ikebana", "seiri-seiton", "mokusatsu", "nemawashi", "takumi",
  "hanami", "tsukimi", "yukimi", "momijigari", "hotarugari", "sakura",
  "kogarashi", "negai", "fuyu-no-hanabi", "umi", "satoyama", "shinme",
  "ichigo-ichie", "omotenashi", "omoiyari", "kizuna", "wa", "on",
  "senpai-kohai", "mottainai", "otsukaresama", "amae", "tatemae-honne", "nakama",
];

const articleSlugs = [
  "ikigai-japanese-secret-life-worth-living",
  "wabi-sabi-changed-way-i-see-flaws",
  "7-morning-habits-zen-monks",
  "kaizen-approach-productivity",
  "japanese-minimalism-more-than-decluttering",
  "shinrin-yoku-science-behind-forest-bathing",
  "morning-routine-that-actually-sticks",
  "ma-negative-space-in-schedule",
  "kintsugi-beauty-of-being-broken",
  "digital-minimalism-japanese-approach",
  "pomodoro-meets-zen-focus",
  "ichigo-ichie-treasure-every-moment",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/philosophy`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/productivity`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/download`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const articlePages = articleSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const philosophyPages = philosophySlugs.map((slug) => ({
    url: `${baseUrl}/philosophy/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...philosophyPages];
}
