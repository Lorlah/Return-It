export type Zone = "A" | "B" | "C";

export type ItemSize = "letter" | "large-letter" | "small-parcel" | "medium-parcel";

export interface PriceEstimate {
  min: number;
  max: number;
  breakdown: {
    base: number;
    extraParcels: number;
    printing: number;
  };
  zone: Zone;
}

// London postcodes
const ZONE_A_PREFIXES = [
  "E", "EC", "N", "NW", "SE", "SW", "W", "WC",
];

// Major UK cities
const ZONE_B_PREFIXES = [
  "B", "BS", "CB", "CF", "CV", "EH", "G", "L", "LS",
  "M", "NE", "NG", "OX", "PO", "RG", "S", "SO",
];

const BASE_PRICES: Record<Zone, Record<ItemSize, number>> = {
  A: { letter: 4.99, "large-letter": 5.49, "small-parcel": 5.99, "medium-parcel": 7.99 },
  B: { letter: 5.99, "large-letter": 6.49, "small-parcel": 7.99, "medium-parcel": 9.99 },
  C: { letter: 7.99, "large-letter": 8.49, "small-parcel": 9.99, "medium-parcel": 11.99 },
};

const PER_EXTRA_PARCEL = 2.50;
const PRINTING_FEE = 1.50;
const PRICE_RANGE_BUFFER = 2.00;

export function getZone(postcode: string): Zone {
  const prefix = postcode.toUpperCase().replace(/[0-9]/g, "").trim();
  
  if (ZONE_A_PREFIXES.includes(prefix)) return "A";
  if (ZONE_B_PREFIXES.some((p) => prefix.startsWith(p))) return "B";
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

  const total = base + extraParcels + printing;

  return {
    min: total,
    max: total + PRICE_RANGE_BUFFER,
    breakdown: {
      base,
      extraParcels,
      printing,
    },
    zone,
  };
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
