export type Zone = "A" | "B" | "C";

export type ItemSize = "letter" | "large-letter" | "small-parcel" | "medium-parcel";

export interface PriceBreakdown {
  base: number;
  extraParcels: number;
  printing: number;
  bulkDiscount: number;
  subtotalBeforeDiscount: number;
}

export interface PriceEstimate {
  min: number;
  max: number;
  breakdown: PriceBreakdown;
  zone: Zone;
  hasBulkDiscount: boolean;
}

// ── Zone Detection ──────────────────────────────────────────────────────────

// London postcodes (Zone A) — exact area codes
const ZONE_A_PREFIXES = new Set([
  "E", "EC", "N", "NW", "SE", "SW", "W", "WC",
]);

// Major UK cities (Zone B) — city/region prefixes
// Sorted by specificity: longer prefixes first so "BS" matches before "B"
const ZONE_B_PREFIXES = [
  "BS", "CB", "CF", "CV", "EH",   // Bristol, Cambridge, Cardiff, Coventry, Edinburgh
  "LS", "NE", "NG", "OX", "PO",   // Leeds, Newcastle, Nottingham, Oxford, Portsmouth
  "RG", "SO",                       // Reading, Southampton
  "B", "G", "L", "M", "S",         // Birmingham, Glasgow, Liverpool, Manchester, Sheffield
];

// ── Pricing Constants ───────────────────────────────────────────────────────

const BASE_PRICES: Record<Zone, Record<ItemSize, number>> = {
  A: { letter: 4.99, "large-letter": 5.49, "small-parcel": 5.99, "medium-parcel": 7.99 },
  B: { letter: 5.99, "large-letter": 6.49, "small-parcel": 7.99, "medium-parcel": 9.99 },
  C: { letter: 7.99, "large-letter": 8.49, "small-parcel": 9.99, "medium-parcel": 11.99 },
};

const PER_EXTRA_PARCEL = 2.50;
const PRINTING_FEE = 1.50;
const PRICE_RANGE_BUFFER = 2.00;
const BULK_DISCOUNT_THRESHOLD = 4;
const BULK_DISCOUNT_RATE = 0.10; // 10% off

// ── Zone Logic ──────────────────────────────────────────────────────────────

/**
 * Extract the alpha prefix from a UK postcode.
 * e.g. "SW1A 1AA" → "SW", "EC2A 3BP" → "EC", "M1 1AE" → "M"
 */
function extractPostcodePrefix(postcode: string): string {
  const cleaned = postcode.toUpperCase().trim();
  // UK postcodes start with 1-2 letters, then a digit
  const match = cleaned.match(/^([A-Z]{1,2})/);
  return match ? match[1] : "";
}

export function getZone(postcode: string): Zone {
  const prefix = extractPostcodePrefix(postcode);

  if (!prefix) return "C";

  if (ZONE_A_PREFIXES.has(prefix)) return "A";

  // Check Zone B — longer prefixes are listed first, so "BS" matches Bristol
  // before "B" matches Birmingham
  for (const zonePrefix of ZONE_B_PREFIXES) {
    if (prefix === zonePrefix || prefix.startsWith(zonePrefix)) return "B";
  }

  return "C";
}

export function getZoneName(zone: Zone): string {
  switch (zone) {
    case "A":
      return "London";
    case "B":
      return "Major City";
    case "C":
      return "Other Areas";
  }
}

// ── Pricing Logic ───────────────────────────────────────────────────────────

/**
 * Calculate the price estimate for a pickup request.
 *
 * Pricing rules:
 * - Base price depends on zone + item size
 * - Each additional parcel adds a flat fee
 * - Label printing is an optional add-on
 * - 4+ parcels unlocks a 10% bulk discount on the total
 * - Quote shows a range: total to total + £2 buffer
 */
export function calculatePrice(
  postcode: string,
  itemSize: ItemSize,
  parcelCount: number,
  needsPrinting: boolean
): PriceEstimate {
  const zone = getZone(postcode);
  const base = BASE_PRICES[zone][itemSize];
  const extraParcels = Math.max(0, parcelCount - 1) * PER_EXTRA_PARCEL;
  const printing = needsPrinting ? PRINTING_FEE : 0;

  const subtotalBeforeDiscount = base + extraParcels + printing;

  // Bulk discount: 10% off when sending 4+ parcels
  const hasBulkDiscount = parcelCount >= BULK_DISCOUNT_THRESHOLD;
  const bulkDiscount = hasBulkDiscount
    ? roundPrice(subtotalBeforeDiscount * BULK_DISCOUNT_RATE)
    : 0;

  const total = roundPrice(subtotalBeforeDiscount - bulkDiscount);

  return {
    min: total,
    max: roundPrice(total + PRICE_RANGE_BUFFER),
    breakdown: {
      base,
      extraParcels,
      printing,
      bulkDiscount,
      subtotalBeforeDiscount,
    },
    zone,
    hasBulkDiscount,
  };
}

/** Round to 2 decimal places to avoid floating point drift */
function roundPrice(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatPrice(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export const ITEM_SIZES: { value: ItemSize; label: string; description: string; maxWeight: string }[] = [
  { value: "letter", label: "Letter", description: "Up to 24 × 16.5 × 0.5 cm", maxWeight: "100g" },
  { value: "large-letter", label: "Large Letter", description: "Up to 35.3 × 25 × 2.5 cm", maxWeight: "750g" },
  { value: "small-parcel", label: "Small Parcel", description: "Up to 45 × 35 × 16 cm", maxWeight: "2kg" },
  { value: "medium-parcel", label: "Medium Parcel", description: "Up to 61 × 46 × 46 cm", maxWeight: "20kg" },
];

export const PICKUP_WINDOWS = [
  { value: "tomorrow", label: "Tomorrow", description: "Next available slot" },
  { value: "weekend", label: "This Weekend", description: "Saturday or Sunday" },
  { value: "next-week", label: "Next Week", description: "Choose your day" },
] as const;

export type PickupWindow = (typeof PICKUP_WINDOWS)[number]["value"];
