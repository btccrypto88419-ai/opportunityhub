// Central place for enums / labels shared across the app.

export const CATEGORIES = [
  { slug: "jobs", label: "Jobs", icon: "Briefcase" },
  { slug: "internships", label: "Internships", icon: "GraduationCap" },
  { slug: "scholarships", label: "Scholarships", icon: "Award" },
  { slug: "fellowships", label: "Fellowships", icon: "Users" },
  { slug: "grants", label: "Grants", icon: "HandCoins" },
  { slug: "competitions", label: "Competitions", icon: "Trophy" },
  { slug: "training", label: "Training Programs", icon: "BookOpen" },
  { slug: "volunteer", label: "Volunteer Opportunities", icon: "HeartHandshake" },
  { slug: "remote-jobs", label: "Remote Jobs", icon: "Globe" },
  { slug: "apprenticeships", label: "Apprenticeships", icon: "Hammer" },
  { slug: "graduate-programs", label: "Graduate Programs", icon: "GraduationCap" },
  { slug: "exchange-programs", label: "Exchange Programs", icon: "Plane" },
  { slug: "conferences", label: "Conferences", icon: "Mic" },
  { slug: "hackathons", label: "Hackathons", icon: "Code" },
  { slug: "bootcamps", label: "Bootcamps", icon: "Rocket" },
  { slug: "certifications", label: "Certifications", icon: "BadgeCheck" },
  { slug: "research", label: "Research Opportunities", icon: "Microscope" },
  { slug: "entrepreneurship", label: "Entrepreneurship Opportunities", icon: "Lightbulb" },
  { slug: "funding", label: "Funding Opportunities", icon: "Landmark" },
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.label])
);

export const MODES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export const APPLICATION_STATUSES = [
  "Saved",
  "Applied",
  "Under Review",
  "Interview",
  "Accepted",
  "Rejected",
];

export const REPORT_REASONS = [
  { value: "scam", label: "Scam / suspicious" },
  { value: "expired", label: "Expired" },
  { value: "incorrect", label: "Incorrect information" },
  { value: "broken_link", label: "Broken link" },
  { value: "duplicate", label: "Duplicate" },
  { value: "other", label: "Other" },
];

export const PAYMENT_METHODS = [
  { value: "opay", label: "OPay / Bank Transfer (NGN)", group: "fiat" },
  { value: "usdt", label: "USDT", group: "crypto" },
  { value: "btc", label: "BTC", group: "crypto" },
  { value: "usdc", label: "USDC", group: "crypto" },
  { value: "eth", label: "ETH", group: "crypto" },
  { value: "bnb", label: "BNB", group: "crypto" },
  { value: "sol", label: "SOL", group: "crypto" },
  { value: "ton", label: "TON", group: "crypto" },
];

export const CRYPTO_NETWORKS = {
  usdt: ["TRC20 (Tron)", "ERC20 (Ethereum)", "BEP20 (BNB Smart Chain)"],
  btc: ["Bitcoin"],
  usdc: ["ERC20 (Ethereum)", "BEP20 (BNB Smart Chain)", "SOL (Solana)"],
  eth: ["ERC20 (Ethereum)"],
  bnb: ["BEP20 (BNB Smart Chain)"],
  sol: ["Solana"],
  ton: ["TON"],
};

export const PAYMENT_STATUSES = ["pending", "approved", "rejected"];

export const DEFAULT_REFERRAL_REWARD_USDT = 2;

export const BRAND = {
  name: "OpportunityHub",
  tagline: "Find. Apply. Succeed.",
  creator: "Ojattah Wisdom",
  colors: {
    navy: "#0B1D3A",
    blue: "#1D4ED8",
    skyBlue: "#38BDF8",
    amber: "#FBBF24",
    green: "#22C55E",
  },
};
