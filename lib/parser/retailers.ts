export interface RetailerMatch {
  slug: string;
  displayName: string;
  confidence: number;
}

// ── Registry ────────────────────────────────────────────────────────────────

// Keyed by registrable domain. Subdomains resolve by suffix match, so
// "orders.temu.com" matches "temu.com".
//
// Retailers routinely send transactional mail from a SEPARATE notification
// domain — SHEIN uses sheinnotice.com, not shein.com. Both are registered.
// Verified against real inbox samples; add new ones as fixtures reveal them.
//
// amazon.co.uk and amazon.com are separate entities: different returns
// addresses, different deadlines, different carriers.
const RETAILERS: Record<string, { slug: string; displayName: string }> = {
  "asos.com": { slug: "asos", displayName: "ASOS" },
  "sheinnotice.com": { slug: "shein", displayName: "SHEIN" },
  "temuemail.com": { slug: "temu", displayName: "Temu" },
  "currys.co.uk": { slug: "currys", displayName: "Currys" },
  "amazon.co.uk": { slug: "amazon-uk", displayName: "Amazon UK" },
  "amazon.com": { slug: "amazon-us", displayName: "Amazon" },
  "shein.com": { slug: "shein", displayName: "SHEIN" },
  "zara.com": { slug: "zara", displayName: "Zara" },
  "next.co.uk": { slug: "next", displayName: "Next" },
  "johnlewis.com": { slug: "john-lewis", displayName: "John Lewis" },
  "marksandspencer.com": { slug: "marks-spencer", displayName: "M&S" },
  "hm.com": { slug: "hm", displayName: "H&M" },
  "uniqlo.com": { slug: "uniqlo", displayName: "Uniqlo" },
  "nike.com": { slug: "nike", displayName: "Nike" },
  "boohoo.com": { slug: "boohoo", displayName: "boohoo" },
  "prettylittlething.com": { slug: "plt", displayName: "PrettyLittleThing" },
  "temu.com": { slug: "temu", displayName: "Temu" },
  "vinted.co.uk": { slug: "vinted", displayName: "Vinted" },
};

// Third-party returns platforms send on behalf of many retailers, so their
// domain identifies the PLATFORM, not the shop. For these we fall back to
// finding a brand name in the text. Verified: PrettyLittleThing returns
// arrive from no-reply@reboundreturns.com.
const RETURNS_PLATFORMS = new Set([
  "reboundreturns.com",
  "zigzag.global",
  "narvar.com",
  "returnly.com",
]);

// Brand names as they appear in subject lines and bodies. Longest first, so
// "PrettyLittleThing" is tested before any shorter substring.
const BRAND_MENTIONS: Array<[RegExp, string]> = [
  [/\bprettylittlething\b/i, "plt"],
  [/\bmarks\s*(?:&|and)\s*spencer\b/i, "marks-spencer"],
  [/\bjohn\s*lewis\b/i, "john-lewis"],
  [/\bshein\b/i, "shein"],
  [/\basos\b/i, "asos"],
  [/\bboohoo\b/i, "boohoo"],
  [/\buniqlo\b/i, "uniqlo"],
  [/\bzara\b/i, "zara"],
  [/\btemu\b/i, "temu"],
];

function lookupDomain(domain: string): RetailerMatch | null {
  for (const [known, meta] of Object.entries(RETAILERS)) {
    if (domain === known || domain.endsWith(`.${known}`)) {
      return { slug: meta.slug, displayName: meta.displayName, confidence: 1 };
    }
  }
  return null;
}

function displayNameFor(slug: string): string {
  const found = Object.values(RETAILERS).find((r) => r.slug === slug);
  return found ? found.displayName : slug;
}

/**
 * Resolve a sender domain to a known retailer.
 *
 * The domain is authoritative when it belongs to a retailer. When it belongs
 * to a returns platform that mails on behalf of many shops, fall back to a
 * brand mention in `text` — at reduced confidence, since a brand name in
 * prose is weaker evidence than a registered domain.
 *
 * `text` is deliberately ignored for non-platform domains: an InPost email
 * about a SHEIN return is from InPost, and treating it as a SHEIN email
 * would create a duplicate return.
 */
export function identifyRetailer(
  senderDomain: string,
  text = "",
): RetailerMatch | null {
  const domain = senderDomain.toLowerCase().trim();

  const byDomain = lookupDomain(domain);
  if (byDomain) return byDomain;

  if (RETURNS_PLATFORMS.has(domain)) {
    for (const [pattern, slug] of BRAND_MENTIONS) {
      if (pattern.test(text)) {
        return { slug, displayName: displayNameFor(slug), confidence: 0.7 };
      }
    }
  }

  return null;
}

/** Every registered slug. Used by the accuracy harness for coverage reporting. */
export function knownRetailerSlugs(): string[] {
  return Object.values(RETAILERS).map((r) => r.slug);
}
