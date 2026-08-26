export const INGEST_DOMAIN = "in.return-it.co.uk";

// A 4+ character hex nonce. Without it, addresses would be guessable from a
// user's name alone, and anyone could post mail into another user's inbox.
const NONCE_PATTERN = "[a-f0-9]{4,}";

const ADDRESS_PATTERN = new RegExp(
  `^([a-z0-9]+(?:-[a-z0-9]+)*)-(${NONCE_PATTERN})@${INGEST_DOMAIN.replace(/\./g, "\\.")}$`,
  "i",
);

const MAX_SLUG_LENGTH = 32;

// ── Generation ──────────────────────────────────────────────────────────────

function slugify(displayName: string): string {
  const slug = displayName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-$/, "");

  return slug.length > 0 ? slug : "user";
}

/**
 * Build a user's unique inbound address.
 *
 * The nonce is what makes the address unguessable — the slug alone is
 * derivable from a display name.
 */
export function generateIngestAddress(displayName: string, nonce: string): string {
  return `${slugify(displayName)}-${nonce.toLowerCase()}@${INGEST_DOMAIN}`;
}

// ── Parsing ─────────────────────────────────────────────────────────────────

/**
 * Split an inbound address back into slug and nonce.
 *
 * Returns null for anything not matching our own address format — including
 * addresses at other domains. Never throws: this runs on untrusted input.
 */
export function parseIngestAddress(
  address: string,
): { slug: string; nonce: string } | null {
  const m = ADDRESS_PATTERN.exec(address.trim());
  if (!m) return null;
  return { slug: m[1].toLowerCase(), nonce: m[2].toLowerCase() };
}
