// ── Carrier Detection ───────────────────────────────────────────────────────

// Ordered: longer and more specific aliases first, so "royal mail" is
// tested before any shorter substring could mislead.
const CARRIER_ALIASES: Array<[RegExp, string]> = [
  [/\broyal\s*mail\b/i, "royal-mail"],
  [/\bparcelforce\b/i, "parcelforce"],
  [/\b(?:evri|hermes)\b/i, "evri"],
  [/\binpost\b/i, "inpost"],
  [/\bcollect\+?\b/i, "collect-plus"],
  [/\byodel\b/i, "yodel"],
  [/\bdpd\b/i, "dpd"],
  [/\bdhl\b/i, "dhl"],
  [/\bups\b/i, "ups"],
  [/\bfedex\b/i, "fedex"],
];

/** Identify the carrier named in the text, if any. */
export function extractCarrier(text: string): string | null {
  for (const [pattern, slug] of CARRIER_ALIASES) {
    if (pattern.test(text)) return slug;
  }
  return null;
}

// ── Reference Extraction ────────────────────────────────────────────────────

// Retailer references are alphanumeric with optional dashes: "401234567",
// "AB-123456", "RTN-88213004".
//
// The lookahead requiring a digit is load-bearing. These patterns run with
// the /i flag, so [A-Z0-9] also matches lowercase — without it, "Please
// return your item" would yield a return ID of "your". Every real reference
// contains at least one digit; no English word does.
const REF_TOKEN = "((?=[A-Z0-9-]*\\d)[A-Z0-9][A-Z0-9-]{3,})";

// Separator class covers the ASCII colon, the FULLWIDTH COLON (U+FF1A) and
// the hash. SHEIN's UK emails use the fullwidth form — "Order number：GSO18…"
// — because their templates are authored CJK-side. Verified against a real
// SHEIN return email; an ASCII-only class silently misses every one.
const SEP = "[:\\uFF1A#]?";

// "id" is in the alternation because Temu writes "Order ID:", not "Order
// number:". Verified against a real Temu return email — without it the
// pattern matches nothing at all on that template.
const ORDER_REF = new RegExp(
  `\\border\\s*(?:id|number|no\\.?|ref(?:erence)?|#)?\\s*${SEP}\\s*${REF_TOKEN}`,
  "i",
);

const RETURN_ID = new RegExp(
  `\\b(?:return|rma)\\s*(?:id|number|no\\.?|ref(?:erence)?)?\\s*${SEP}\\s*${REF_TOKEN}`,
  "i",
);

export function extractOrderRef(text: string): string | null {
  const m = ORDER_REF.exec(text);
  return m ? m[1] : null;
}

export function extractReturnId(text: string): string | null {
  const m = RETURN_ID.exec(text);
  return m ? m[1] : null;
}
