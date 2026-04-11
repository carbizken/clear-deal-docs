// ──────────────────────────────────────────────────────────────
// Trade-Up Sticker Template Library
//
// Pre-built headline templates organized by category so dealers
// can one-click load a hook and customize from there. Templates
// support vehicle variable injection: {year} {make} {model}
// ──────────────────────────────────────────────────────────────

export type TemplateCategory = "serious" | "funny" | "urgency" | "curiosity" | "loyalty" | "seasonal";

export interface StickerTemplate {
  id: string;
  category: TemplateCategory;
  name: string;
  headline: string;
  subhead: string;
  offerText: string;
  callText: string;
  recommendedTheme?: "red" | "blue" | "green" | "navy" | "gold";
  icon?: string;
}

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string; description: string }[] = [
  { id: "serious", label: "Professional", description: "Direct, trustworthy messaging" },
  { id: "urgency", label: "Urgency", description: "Limited-time hooks that drive action" },
  { id: "funny", label: "Witty", description: "Lighthearted hooks that stand out" },
  { id: "curiosity", label: "Curiosity", description: "Makes them want to scan to find out" },
  { id: "loyalty", label: "Loyalty", description: "For repeat customers & VIPs" },
  { id: "seasonal", label: "Seasonal", description: "Tax time, holiday, back-to-school" },
];

export const STICKER_TEMPLATES: StickerTemplate[] = [
  // ─────────── SERIOUS / PROFESSIONAL ───────────
  {
    id: "pro-instant-value",
    category: "serious",
    name: "Instant Value",
    headline: "WHAT'S YOUR CAR WORTH?",
    subhead: "TRADE UP TODAY",
    offerText: "Get an instant trade-in value and upgrade to a newer vehicle.",
    callText: "Scan to get your trade-in value in 60 seconds",
    recommendedTheme: "blue",
  },
  {
    id: "pro-top-dollar",
    category: "serious",
    name: "Top Dollar",
    headline: "TOP DOLLAR FOR YOUR TRADE",
    subhead: "GUARANTEED",
    offerText: "We'll beat any written offer from another dealer. Guaranteed.",
    callText: "Scan to get your guaranteed offer",
    recommendedTheme: "navy",
  },
  {
    id: "pro-no-hassle",
    category: "serious",
    name: "No Hassle",
    headline: "NO HAGGLING.",
    subhead: "JUST GREAT VALUES.",
    offerText: "One price, upfront. Your trade-in value in black and white.",
    callText: "Scan to get your no-hassle offer",
    recommendedTheme: "blue",
  },
  {
    id: "pro-transparent",
    category: "serious",
    name: "Transparent Pricing",
    headline: "TRANSPARENT TRADE VALUES",
    subhead: "NO SURPRISES",
    offerText: "Real market data. Real offers. No back-and-forth.",
    callText: "Scan for your transparent offer",
    recommendedTheme: "green",
  },

  // ─────────── URGENCY ───────────
  {
    id: "urgency-48hrs",
    category: "urgency",
    name: "48 Hours Only",
    headline: "48 HOURS ONLY",
    subhead: "PREMIUM TRADE VALUES",
    offerText: "This weekend, we're paying premium prices on trade-ins.",
    callText: "Scan before it's too late",
    recommendedTheme: "red",
  },
  {
    id: "urgency-bonus",
    category: "urgency",
    name: "$500 Bonus",
    headline: "$500 TRADE BONUS",
    subhead: "THIS WEEK ONLY",
    offerText: "Get an extra $500 on top of your trade-in value. Ends Sunday.",
    callText: "Scan to claim your bonus",
    recommendedTheme: "red",
  },
  {
    id: "urgency-prices-up",
    category: "urgency",
    name: "Prices Rising",
    headline: "USED CAR PRICES ARE UP",
    subhead: "TRADE NOW",
    offerText: "Your car is worth more than you think. But not for long.",
    callText: "Scan to see your current value",
    recommendedTheme: "red",
  },
  {
    id: "urgency-flash",
    category: "urgency",
    name: "Weekend Flash",
    headline: "WEEKEND FLASH SALE",
    subhead: "$1,000 TRADE BONUS",
    offerText: "Instant approval + $1,000 bonus this weekend only.",
    callText: "Scan before Sunday midnight",
    recommendedTheme: "red",
  },
  {
    id: "urgency-beat-offer",
    category: "urgency",
    name: "Beat Any Offer",
    headline: "WE'LL BEAT ANY OFFER",
    subhead: "OR PAY YOU $500",
    offerText: "Bring us a written offer. We'll beat it or give you $500.",
    callText: "Scan to challenge us",
    recommendedTheme: "red",
  },

  // ─────────── FUNNY / WITTY ───────────
  {
    id: "funny-side-eye",
    category: "funny",
    name: "Side Eye",
    headline: "IS YOUR CAR GIVING YOU",
    subhead: "THE SIDE EYE?",
    offerText: "It might be time for a new relationship. We can help.",
    callText: "Scan to start fresh",
    recommendedTheme: "gold",
  },
  {
    id: "funny-misses-you",
    category: "funny",
    name: "Miss You",
    headline: "THIS CAR MISSES YOU.",
    subhead: "WE MISS YOUR TRADE.",
    offerText: "Let's make everyone happy. Starting with your wallet.",
    callText: "Scan for the reunion tour",
    recommendedTheme: "gold",
  },
  {
    id: "funny-commitment",
    category: "funny",
    name: "Commitment Issues",
    headline: "COMMITMENT ISSUES?",
    subhead: "UPGRADE EVERY 3 YEARS.",
    offerText: "No judgment. Just great cars and even better trade values.",
    callText: "Scan to swipe right",
    recommendedTheme: "gold",
  },
  {
    id: "funny-older-wiser",
    category: "funny",
    name: "Older & Wiser",
    headline: "OLDER. WISER.",
    subhead: "DRIVING SOMETHING NEWER.",
    offerText: "You've earned it. Let's make the upgrade painless.",
    callText: "Scan to treat yourself",
    recommendedTheme: "navy",
  },
  {
    id: "funny-daydream",
    category: "funny",
    name: "Daydreaming",
    headline: "STOP DAYDREAMING.",
    subhead: "START TRADE-DREAMING.",
    offerText: "Your next car is 30 seconds away. We'll even pay for your current one.",
    callText: "Scan to start the dream",
    recommendedTheme: "blue",
  },
  {
    id: "funny-toaster",
    category: "funny",
    name: "Toaster",
    headline: "YOUR CAR IS BECOMING",
    subhead: "A VERY EXPENSIVE TOASTER.",
    offerText: "Let's get you into something that runs on gas, not repairs.",
    callText: "Scan for a rescue mission",
    recommendedTheme: "gold",
  },

  // ─────────── CURIOSITY ───────────
  {
    id: "curiosity-shocked",
    category: "curiosity",
    name: "Shocked",
    headline: "YOU'D BE SHOCKED",
    subhead: "WHAT YOUR CAR IS WORTH",
    offerText: "The number might surprise you. Actually, it probably will.",
    callText: "Scan to find out",
    recommendedTheme: "blue",
  },
  {
    id: "curiosity-5-seconds",
    category: "curiosity",
    name: "5 Seconds",
    headline: "5 SECONDS.",
    subhead: "ONE NUMBER. HUGE SURPRISE.",
    offerText: "That's all it takes to find out what your car is worth today.",
    callText: "Scan to reveal",
    recommendedTheme: "navy",
  },
  {
    id: "curiosity-hidden-number",
    category: "curiosity",
    name: "Hidden Number",
    headline: "THERE'S A NUMBER",
    subhead: "BEHIND THIS CODE",
    offerText: "And you're going to like it. We promise.",
    callText: "Scan to reveal",
    recommendedTheme: "navy",
  },
  {
    id: "curiosity-value-up",
    category: "curiosity",
    name: "Value Went Up",
    headline: "YOUR CAR'S VALUE",
    subhead: "JUST WENT UP.",
    offerText: "Market prices moved in your favor this week. See how much.",
    callText: "Scan to see the update",
    recommendedTheme: "green",
  },

  // ─────────── LOYALTY / VIP ───────────
  {
    id: "loyalty-vip",
    category: "loyalty",
    name: "VIP Only",
    headline: "REPEAT CUSTOMER?",
    subhead: "UNLOCK VIP TRADE VALUE",
    offerText: "Loyalty pays. Literally. Ask about our VIP bonus.",
    callText: "Scan for your VIP offer",
    recommendedTheme: "gold",
  },
  {
    id: "loyalty-welcome-back",
    category: "loyalty",
    name: "Welcome Back",
    headline: "WELCOME BACK",
    subhead: "YOUR LOYALTY REWARD AWAITS",
    offerText: "We haven't forgotten you. And neither has your trade bonus.",
    callText: "Scan to claim your reward",
    recommendedTheme: "gold",
  },

  // ─────────── SEASONAL ───────────
  {
    id: "seasonal-tax-time",
    category: "seasonal",
    name: "Tax Season",
    headline: "TAX REFUND?",
    subhead: "UPGRADE YOUR RIDE.",
    offerText: "Put that refund toward a better car. We'll stretch it further.",
    callText: "Scan to see what's possible",
    recommendedTheme: "green",
  },
  {
    id: "seasonal-summer",
    category: "seasonal",
    name: "Summer Road Trip",
    headline: "ROAD TRIP READY?",
    subhead: "TRADE UP FOR SUMMER.",
    offerText: "A better car for a better summer. We'll handle the paperwork.",
    callText: "Scan to get ready",
    recommendedTheme: "blue",
  },
  {
    id: "seasonal-winter",
    category: "seasonal",
    name: "Winter AWD",
    headline: "READY FOR WINTER?",
    subhead: "TRADE INTO AWD TODAY.",
    offerText: "Drive confident all winter. We'll value your current ride fairly.",
    callText: "Scan for your winter upgrade",
    recommendedTheme: "navy",
  },
  {
    id: "seasonal-holiday",
    category: "seasonal",
    name: "Holiday Gift",
    headline: "GIVE YOURSELF",
    subhead: "THE GIFT OF A NEW CAR",
    offerText: "Special holiday trade values. Drive home for the holidays in style.",
    callText: "Scan for your holiday offer",
    recommendedTheme: "red",
  },
  {
    id: "seasonal-new-year",
    category: "seasonal",
    name: "New Year",
    headline: "NEW YEAR.",
    subhead: "NEW CAR.",
    offerText: "Start the year fresh. Your old car is worth more than you think.",
    callText: "Scan for your fresh start",
    recommendedTheme: "navy",
  },
];

export const getTemplatesByCategory = (category: TemplateCategory): StickerTemplate[] =>
  STICKER_TEMPLATES.filter(t => t.category === category);

export const getTemplateById = (id: string): StickerTemplate | undefined =>
  STICKER_TEMPLATES.find(t => t.id === id);
