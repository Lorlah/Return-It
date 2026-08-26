# Parser Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure, fixture-tested parser that turns a raw return email into a structured `DetectedReturn`, and report a measured accuracy number.

**Architecture:** Layer 2 of the three-layer design — pure functions, zero I/O. Five independent extractors (retailer, deadline, carrier, label, confidence) composed by one orchestrator. Every extractor is separately testable and separately replaceable. Nothing in this plan touches the network, the database, or the filesystem at runtime.

**Tech Stack:** TypeScript (strict), Vitest, Node 24. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-08-26-core-product-v1-design.md` (§3 architecture, §4.3 `DetectedReturn`, §6 parser core, §10 testing)

## Global Constraints

- **TypeScript strict mode.** `tsconfig.json` sets `"strict": true`. No `any`, no non-null assertions (`!`) — use explicit narrowing.
- **Path alias:** `@/*` maps to the repo root. Import as `@/lib/parser/types`.
- **Pure functions only.** No `fetch`, no `fs`, no `Date.now()` inside extractors — the current time arrives as a parameter. This is what makes the parser deterministic and testable.
- **Code style:** match `lib/pricing.ts` — named exports, `interface` for object shapes, `type` for unions, section comments in the form `// ── Section Name ───────`.
- **UK conventions throughout.** Dates are day-first (`14/09/2026` is 14 September). Never parse a UK date as US month-first.
- **No new runtime dependencies.** Vitest is a devDependency only.
- **Confidence scores are `0.0`–`1.0` floats**, never percentages.
- **Every extractor returns `null` rather than throwing** when it cannot extract. Absence is a normal result, not an error.

---

## File structure

| File | Responsibility |
|---|---|
| `lib/parser/types.ts` | Shared types: `RawReturnDocument`, `DetectedReturn`, `Attachment`, enums |
| `lib/parser/retailers.ts` | Domain → retailer slug registry and lookup |
| `lib/parser/deadline.ts` | Deadline extraction (absolute and relative dates) |
| `lib/parser/carrier.ts` | Carrier and return-ID extraction |
| `lib/parser/label.ts` | Label type detection |
| `lib/parser/confidence.ts` | Confidence scoring |
| `lib/parser/index.ts` | `parseReturnDocument()` orchestrator + barrel export |
| `fixtures/emails/*.json` | Fixture corpus — one file per real return email |
| `fixtures/expected/*.json` | Expected `DetectedReturn` per fixture |
| `tests/parser/*.test.ts` | Unit tests per extractor |
| `tests/parser/accuracy.test.ts` | The accuracy gate |

---

### Task 1: Test infrastructure and fixture corpus

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `fixtures/emails/README.md`
- Create: `fixtures/emails/asos-001.json`

**Interfaces:**
- Consumes: nothing
- Produces: a working `pnpm test` command; the fixture JSON shape every later task reads

> **⚠️ Human step before Step 4.** The fixture corpus must come from real return emails. The files in `~/Downloads/` are PDFs and QR images, not email text — they are fixtures for a later OCR plan, not this one. Real email fixtures come from the founder's own inbox (search Gmail for `from:asos.com OR from:amazon.co.uk OR from:shein.com subject:return`) and must be **anonymised** before being committed: replace real names, addresses, order numbers and emails with fake values, preserving format and length exactly. Never commit an un-anonymised fixture.

- [ ] **Step 1: Install Vitest**

```bash
pnpm add -D vitest@^3.2.4
```

- [ ] **Step 2: Add the test scripts**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:accuracy": "vitest run tests/parser/accuracy.test.ts --reporter=verbose"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 4: Document the fixture format**

Create `fixtures/emails/README.md`:

```markdown
# Fixture corpus

One JSON file per real return email, anonymised.

Naming: `<retailer-slug>-<nnn>.json` (e.g. `asos-001.json`).

Shape — matches `RawReturnDocument` minus `userId`:

    {
      "source": "forward",
      "receivedAt": "2026-08-14T09:31:00Z",
      "senderDomain": "asos.com",
      "subject": "Your return is on its way",
      "body": "plain text body",
      "attachments": []
    }

## Anonymisation is mandatory

Before committing, replace every real name, street address, email address,
postcode and order number with a fake value of the SAME FORMAT AND LENGTH.
Format matters — the parser is being tested on shape, so `AB-123456789`
must not become `REDACTED`.

Never commit an un-anonymised fixture.
```

- [ ] **Step 5: Create the first fixture**

Create `fixtures/emails/asos-001.json`. Replace the body with a real anonymised ASOS return email:

```json
{
  "source": "forward",
  "receivedAt": "2026-08-14T09:31:00Z",
  "senderDomain": "asos.com",
  "subject": "Your ASOS return - what happens next",
  "body": "Hi Sam,\n\nThanks for letting us know you'd like to return something.\n\nOrder number: 401234567\nReturn ID: RTN-88213004\n\nPlease return your item by 11 September 2026. Returns received after this date may not be refunded.\n\nYour Evri return label is attached. Drop it at any ParcelShop.\n\nThe ASOS Team",
  "attachments": [
    { "filename": "return-label.pdf", "mimeType": "application/pdf", "sizeBytes": 48211 }
  ]
}
```

- [ ] **Step 6: Verify the runner works**

Run: `pnpm test`
Expected: exits 0 with "No test files found" — confirms Vitest resolves config without error.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts fixtures/
git commit -m "test: add Vitest and the parser fixture corpus format"
```

---

### Task 2: Core types

**Files:**
- Create: `lib/parser/types.ts`
- Test: `tests/parser/types.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `RawReturnDocument`, `DetectedReturn`, `Attachment`, `IngestionSource`, `LabelType`, `EMPTY_DETECTED_RETURN`

- [ ] **Step 1: Write the failing test**

Create `tests/parser/types.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { EMPTY_DETECTED_RETURN } from "@/lib/parser/types";

describe("EMPTY_DETECTED_RETURN", () => {
  it("has null extraction fields and zero confidence", () => {
    expect(EMPTY_DETECTED_RETURN.retailer).toBeNull();
    expect(EMPTY_DETECTED_RETURN.deadline).toBeNull();
    expect(EMPTY_DETECTED_RETURN.confidence).toBe(0);
  });

  it("defaults labelType to none and flags for review", () => {
    expect(EMPTY_DETECTED_RETURN.labelType).toBe("none");
    expect(EMPTY_DETECTED_RETURN.needsReview).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/parser/types.test.ts`
Expected: FAIL — cannot resolve `@/lib/parser/types`.

- [ ] **Step 3: Write the implementation**

Create `lib/parser/types.ts`:

```ts
export type IngestionSource = "forward" | "upload" | "outlook" | "gmail";

export type LabelType = "pdf" | "qr" | "link" | "none";

export interface Attachment {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string;
}

// ── Ingestion Input ─────────────────────────────────────────────────────────

/** The choke point every ingestion adapter narrows to. */
export interface RawReturnDocument {
  userId: string;
  source: IngestionSource;
  receivedAt: Date;
  senderDomain: string;
  subject: string;
  body: string;
  attachments: Attachment[];
}

// ── Parser Output ───────────────────────────────────────────────────────────

export interface DetectedReturn {
  retailer: string | null;
  retailerDisplayName: string | null;
  orderRef: string | null;
  returnId: string | null;
  deadline: Date | null;
  deadlineConfidence: number;
  carrier: string | null;
  labelType: LabelType;
  itemDescription: string | null;
  confidence: number;
  needsReview: boolean;
}

/** Baseline result. Extractors overlay onto this. */
export const EMPTY_DETECTED_RETURN: DetectedReturn = {
  retailer: null,
  retailerDisplayName: null,
  orderRef: null,
  returnId: null,
  deadline: null,
  deadlineConfidence: 0,
  carrier: null,
  labelType: "none",
  itemDescription: null,
  confidence: 0,
  needsReview: true,
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/parser/types.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/parser/types.ts tests/parser/types.test.ts
git commit -m "feat(parser): add core types"
```

---

### Task 3: Retailer identification

**Files:**
- Create: `lib/parser/retailers.ts`
- Test: `tests/parser/retailers.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `identifyRetailer(senderDomain: string): RetailerMatch | null` where `RetailerMatch = { slug: string; displayName: string; confidence: number }`

- [ ] **Step 1: Write the failing test**

Create `tests/parser/retailers.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { identifyRetailer } from "@/lib/parser/retailers";

describe("identifyRetailer", () => {
  it("matches a known domain exactly", () => {
    const match = identifyRetailer("asos.com");
    expect(match?.slug).toBe("asos");
    expect(match?.displayName).toBe("ASOS");
    expect(match?.confidence).toBe(1);
  });

  it("matches a subdomain of a known retailer", () => {
    expect(identifyRetailer("email.asos.com")?.slug).toBe("asos");
  });

  it("is case insensitive", () => {
    expect(identifyRetailer("ASOS.COM")?.slug).toBe("asos");
  });

  it("distinguishes amazon.co.uk from amazon.com", () => {
    expect(identifyRetailer("amazon.co.uk")?.slug).toBe("amazon-uk");
    expect(identifyRetailer("amazon.com")?.slug).toBe("amazon-us");
  });

  it("returns null for an unknown domain", () => {
    expect(identifyRetailer("some-random-shop.example")).toBeNull();
  });

  it("does not match a domain that merely contains a retailer name", () => {
    expect(identifyRetailer("notasos.com")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/parser/retailers.test.ts`
Expected: FAIL — cannot resolve `@/lib/parser/retailers`.

- [ ] **Step 3: Write the implementation**

Create `lib/parser/retailers.ts`:

```ts
export interface RetailerMatch {
  slug: string;
  displayName: string;
  confidence: number;
}

// ── Registry ────────────────────────────────────────────────────────────────

// Keyed by registrable domain. Subdomains resolve by suffix match.
// amazon.co.uk and amazon.com are separate entities: different returns
// addresses, different deadlines, different carriers.
const RETAILERS: Record<string, { slug: string; displayName: string }> = {
  "asos.com": { slug: "asos", displayName: "ASOS" },
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

/**
 * Resolve a sender domain to a known retailer.
 *
 * Matches the domain exactly, or as a suffix preceded by a dot so that
 * "email.asos.com" matches but "notasos.com" does not.
 */
export function identifyRetailer(senderDomain: string): RetailerMatch | null {
  const domain = senderDomain.toLowerCase().trim();

  for (const [known, meta] of Object.entries(RETAILERS)) {
    if (domain === known || domain.endsWith(`.${known}`)) {
      return { slug: meta.slug, displayName: meta.displayName, confidence: 1 };
    }
  }

  return null;
}

/** Every registered slug. Used by the accuracy harness for coverage reporting. */
export function knownRetailerSlugs(): string[] {
  return Object.values(RETAILERS).map((r) => r.slug);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/parser/retailers.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/parser/retailers.ts tests/parser/retailers.test.ts
git commit -m "feat(parser): add retailer identification"
```

---

### Task 4: Deadline extraction

**Files:**
- Create: `lib/parser/deadline.ts`
- Test: `tests/parser/deadline.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `extractDeadline(text: string, receivedAt: Date): DeadlineMatch | null` where `DeadlineMatch = { date: Date; confidence: number }`

This is the highest-stakes extractor: a wrong deadline is worse than no deadline, because the user acts on it. Confidence is scored separately from the overall parse for that reason.

- [ ] **Step 1: Write the failing test**

Create `tests/parser/deadline.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { extractDeadline } from "@/lib/parser/deadline";

const RECEIVED = new Date("2026-08-14T09:31:00Z");

describe("extractDeadline", () => {
  it("extracts a full written date", () => {
    const m = extractDeadline("Please return by 11 September 2026.", RECEIVED);
    expect(m?.date.toISOString().slice(0, 10)).toBe("2026-09-11");
    expect(m?.confidence).toBeGreaterThan(0.8);
  });

  it("extracts an abbreviated month", () => {
    const m = extractDeadline("Return by 3 Sept 2026", RECEIVED);
    expect(m?.date.toISOString().slice(0, 10)).toBe("2026-09-03");
  });

  it("parses a UK numeric date day-first", () => {
    const m = extractDeadline("Return by 09/09/2026", RECEIVED);
    expect(m?.date.toISOString().slice(0, 10)).toBe("2026-09-09");
  });

  it("parses an ambiguous UK numeric date day-first, never month-first", () => {
    // 04/09 is 4 September in the UK, not 9 April.
    const m = extractDeadline("Return by 04/09/2026", RECEIVED);
    expect(m?.date.toISOString().slice(0, 10)).toBe("2026-09-04");
  });

  it("resolves a relative window against receivedAt", () => {
    const m = extractDeadline("You have 28 days to return this item.", RECEIVED);
    expect(m?.date.toISOString().slice(0, 10)).toBe("2026-09-11");
    expect(m?.confidence).toBeLessThan(0.8);
  });

  it("infers the year when omitted, choosing the next future occurrence", () => {
    const m = extractDeadline("Return by 3 January", RECEIVED);
    expect(m?.date.toISOString().slice(0, 10)).toBe("2027-01-03");
  });

  it("prefers an explicit date over a relative window when both appear", () => {
    const m = extractDeadline(
      "You have 28 days. Please return by 1 September 2026.",
      RECEIVED,
    );
    expect(m?.date.toISOString().slice(0, 10)).toBe("2026-09-01");
  });

  it("returns null when no date is present", () => {
    expect(extractDeadline("Thanks for shopping with us.", RECEIVED)).toBeNull();
  });

  it("ignores a date more than a year past receipt as implausible", () => {
    expect(extractDeadline("Return by 11 September 2035", RECEIVED)).toBeNull();
  });

  it("ignores a date before receipt as implausible", () => {
    expect(extractDeadline("Return by 11 September 2020", RECEIVED)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/parser/deadline.test.ts`
Expected: FAIL — cannot resolve `@/lib/parser/deadline`.

- [ ] **Step 3: Write the implementation**

Create `lib/parser/deadline.ts`:

```ts
export interface DeadlineMatch {
  date: Date;
  confidence: number;
}

// ── Month Lookup ────────────────────────────────────────────────────────────

const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

const MONTH_NAMES = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|");

// "11 September 2026", "3 Sept", "1st October 2026"
const WRITTEN_DATE = new RegExp(
  `\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_NAMES})\\b(?:\\s+(\\d{4}))?`,
  "i",
);

// "09/09/2026", "9-9-26" — ALWAYS day-first (UK).
const NUMERIC_DATE = /\b(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})\b/;

// "28 days", "within 14 days"
const RELATIVE_WINDOW = /\b(?:within\s+)?(\d{1,3})\s+days?\b/i;

const MS_PER_DAY = 86_400_000;
const MAX_PLAUSIBLE_DAYS = 365;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** A deadline must fall after receipt and within a year of it. */
function isPlausible(date: Date, receivedAt: Date): boolean {
  const delta = date.getTime() - receivedAt.getTime();
  return delta >= 0 && delta <= MAX_PLAUSIBLE_DAYS * MS_PER_DAY;
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/** Expand a 2-digit year to 4 digits, assuming the 2000s. */
function normaliseYear(raw: number): number {
  return raw < 100 ? 2000 + raw : raw;
}

// ── Extraction ──────────────────────────────────────────────────────────────

function fromWritten(text: string, receivedAt: Date): Date | null {
  const m = WRITTEN_DATE.exec(text);
  if (!m) return null;

  const day = Number(m[1]);
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) return null;

  if (m[3]) return utcDate(Number(m[3]), month, day);

  // Year omitted: choose the next future occurrence.
  const thisYear = utcDate(receivedAt.getUTCFullYear(), month, day);
  return thisYear.getTime() >= receivedAt.getTime()
    ? thisYear
    : utcDate(receivedAt.getUTCFullYear() + 1, month, day);
}

function fromNumeric(text: string): Date | null {
  const m = NUMERIC_DATE.exec(text);
  if (!m) return null;

  const day = Number(m[1]);
  const month = Number(m[2]) - 1;
  if (day > 31 || month > 11) return null;

  return utcDate(normaliseYear(Number(m[3])), month, day);
}

function fromRelative(text: string, receivedAt: Date): Date | null {
  const m = RELATIVE_WINDOW.exec(text);
  if (!m) return null;
  return new Date(receivedAt.getTime() + Number(m[1]) * MS_PER_DAY);
}

/**
 * Extract a return deadline.
 *
 * Explicit dates outrank relative windows, because "return by 1 September"
 * is a statement and "you have 28 days" is an inference from receipt time —
 * which may not be when the clock actually started.
 */
export function extractDeadline(
  text: string,
  receivedAt: Date,
): DeadlineMatch | null {
  const candidates: Array<{ date: Date | null; confidence: number }> = [
    { date: fromWritten(text, receivedAt), confidence: 0.95 },
    { date: fromNumeric(text), confidence: 0.85 },
    { date: fromRelative(text, receivedAt), confidence: 0.6 },
  ];

  for (const c of candidates) {
    if (c.date && isPlausible(c.date, receivedAt)) {
      return { date: c.date, confidence: c.confidence };
    }
  }

  return null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/parser/deadline.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/parser/deadline.ts tests/parser/deadline.test.ts
git commit -m "feat(parser): add deadline extraction with UK date handling"
```

---

### Task 5: Carrier and reference extraction

**Files:**
- Create: `lib/parser/carrier.ts`
- Test: `tests/parser/carrier.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `extractCarrier(text: string): string | null`, `extractOrderRef(text: string): string | null`, `extractReturnId(text: string): string | null`

- [ ] **Step 1: Write the failing test**

Create `tests/parser/carrier.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  extractCarrier,
  extractOrderRef,
  extractReturnId,
} from "@/lib/parser/carrier";

describe("extractCarrier", () => {
  it("identifies Evri", () => {
    expect(extractCarrier("Your Evri return label is attached")).toBe("evri");
  });

  it("identifies Hermes as Evri", () => {
    expect(extractCarrier("Drop at your local Hermes ParcelShop")).toBe("evri");
  });

  it("identifies Royal Mail", () => {
    expect(extractCarrier("Take it to a Royal Mail postbox")).toBe("royal-mail");
  });

  it("identifies InPost", () => {
    expect(extractCarrier("Scan the QR at any InPost locker")).toBe("inpost");
  });

  it("is case insensitive", () => {
    expect(extractCarrier("YOUR DPD LABEL")).toBe("dpd");
  });

  it("returns null when no carrier is named", () => {
    expect(extractCarrier("Thanks for your order")).toBeNull();
  });
});

describe("extractOrderRef", () => {
  it("extracts a labelled order number", () => {
    expect(extractOrderRef("Order number: 401234567")).toBe("401234567");
  });

  it("handles the hash form", () => {
    expect(extractOrderRef("Order #AB-123456")).toBe("AB-123456");
  });

  it("returns null when absent", () => {
    expect(extractOrderRef("Thanks for shopping")).toBeNull();
  });
});

describe("reference tokens must contain a digit", () => {
  it("does not mistake a following word for a return ID", () => {
    // "return your item" must not yield "your" — a reference always has
    // at least one digit in it.
    expect(extractReturnId("Please return your item by Friday")).toBeNull();
  });

  it("does not mistake a following word for an order ref", () => {
    expect(extractOrderRef("Please order more soon")).toBeNull();
  });
});

describe("extractReturnId", () => {
  it("extracts a labelled return ID", () => {
    expect(extractReturnId("Return ID: RTN-88213004")).toBe("RTN-88213004");
  });

  it("handles the RMA phrasing", () => {
    expect(extractReturnId("RMA number: 55512")).toBe("55512");
  });

  it("returns null when absent", () => {
    expect(extractReturnId("Your parcel is on its way")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/parser/carrier.test.ts`
Expected: FAIL — cannot resolve `@/lib/parser/carrier`.

- [ ] **Step 3: Write the implementation**

Create `lib/parser/carrier.ts`:

```ts
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

const ORDER_REF = new RegExp(
  `\\border\\s*(?:number|no\\.?|ref(?:erence)?|#)?\\s*[:#]?\\s*${REF_TOKEN}`,
  "i",
);

const RETURN_ID = new RegExp(
  `\\b(?:return|rma)\\s*(?:id|number|no\\.?|ref(?:erence)?)?\\s*[:#]?\\s*${REF_TOKEN}`,
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/parser/carrier.test.ts`
Expected: PASS, 14 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/parser/carrier.ts tests/parser/carrier.test.ts
git commit -m "feat(parser): add carrier and reference extraction"
```

---

### Task 6: Label detection

**Files:**
- Create: `lib/parser/label.ts`
- Test: `tests/parser/label.test.ts`

**Interfaces:**
- Consumes: `Attachment`, `LabelType` from `@/lib/parser/types`
- Produces: `detectLabel(body: string, attachments: Attachment[]): LabelType`

- [ ] **Step 1: Write the failing test**

Create `tests/parser/label.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { detectLabel } from "@/lib/parser/label";
import type { Attachment } from "@/lib/parser/types";

const pdf: Attachment = {
  filename: "return-label.pdf",
  mimeType: "application/pdf",
  sizeBytes: 48211,
};

const image: Attachment = {
  filename: "qr-code.png",
  mimeType: "image/png",
  sizeBytes: 8100,
};

describe("detectLabel", () => {
  it("detects a PDF attachment", () => {
    expect(detectLabel("Your label is attached", [pdf])).toBe("pdf");
  });

  it("prefers a PDF attachment over a link in the body", () => {
    expect(
      detectLabel("Download at https://example.com/label", [pdf]),
    ).toBe("pdf");
  });

  it("detects a QR code from an image attachment", () => {
    expect(detectLabel("Scan this QR code at the locker", [image])).toBe("qr");
  });

  it("detects a QR mentioned in the body with no attachment", () => {
    expect(detectLabel("Show your QR code at any InPost locker", [])).toBe("qr");
  });

  it("detects a label link in the body", () => {
    expect(
      detectLabel("Print your label: https://returns.example.com/abc", []),
    ).toBe("link");
  });

  it("returns none when there is no label of any kind", () => {
    expect(detectLabel("Thanks for shopping with us", [])).toBe("none");
  });

  it("ignores a non-label image attachment", () => {
    const logo: Attachment = {
      filename: "logo.png",
      mimeType: "image/png",
      sizeBytes: 2100,
    };
    expect(detectLabel("Thanks for your order", [logo])).toBe("none");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/parser/label.test.ts`
Expected: FAIL — cannot resolve `@/lib/parser/label`.

- [ ] **Step 3: Write the implementation**

Create `lib/parser/label.ts`:

```ts
import type { Attachment, LabelType } from "@/lib/parser/types";

const QR_MENTION = /\bqr\s*(?:code)?\b/i;
const LABEL_LINK = /https?:\/\/\S*\b(?:label|return|rma)\b\S*/i;
const LABEL_FILENAME = /\b(?:label|return|rma|qr)\b/i;

/**
 * Determine what kind of return label the document carries.
 *
 * Precedence is by usefulness to the user: a PDF they can print beats a QR
 * they must display, which beats a link they must follow.
 */
export function detectLabel(
  body: string,
  attachments: Attachment[],
): LabelType {
  if (attachments.some((a) => a.mimeType === "application/pdf")) {
    return "pdf";
  }

  const hasQrMention = QR_MENTION.test(body);

  // An image attachment only counts as a label if the body mentions a QR
  // code or the filename says so — otherwise it is a logo or a banner.
  const hasLabelImage = attachments.some(
    (a) =>
      a.mimeType.startsWith("image/") &&
      (hasQrMention || LABEL_FILENAME.test(a.filename)),
  );

  if (hasLabelImage || hasQrMention) return "qr";
  if (LABEL_LINK.test(body)) return "link";

  return "none";
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/parser/label.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/parser/label.ts tests/parser/label.test.ts
git commit -m "feat(parser): add label type detection"
```

---

### Task 7: Confidence scoring and the orchestrator

**Files:**
- Create: `lib/parser/confidence.ts`
- Create: `lib/parser/index.ts`
- Test: `tests/parser/index.test.ts`

**Interfaces:**
- Consumes: every extractor from Tasks 3–6, and `RawReturnDocument`/`DetectedReturn`/`EMPTY_DETECTED_RETURN` from Task 2
- Produces: `scoreConfidence(partial): number`, `parseReturnDocument(doc: RawReturnDocument): DetectedReturn`

- [ ] **Step 1: Write the failing test**

Create `tests/parser/index.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseReturnDocument } from "@/lib/parser";
import type { RawReturnDocument } from "@/lib/parser/types";

const complete: RawReturnDocument = {
  userId: "u1",
  source: "forward",
  receivedAt: new Date("2026-08-14T09:31:00Z"),
  senderDomain: "asos.com",
  subject: "Your ASOS return - what happens next",
  body:
    "Order number: 401234567\nReturn ID: RTN-88213004\n" +
    "Please return your item by 11 September 2026.\n" +
    "Your Evri return label is attached.",
  attachments: [
    { filename: "return-label.pdf", mimeType: "application/pdf", sizeBytes: 48211 },
  ],
};

describe("parseReturnDocument", () => {
  it("extracts every field from a complete document", () => {
    const r = parseReturnDocument(complete);
    expect(r.retailer).toBe("asos");
    expect(r.retailerDisplayName).toBe("ASOS");
    expect(r.orderRef).toBe("401234567");
    expect(r.returnId).toBe("RTN-88213004");
    expect(r.deadline?.toISOString().slice(0, 10)).toBe("2026-09-11");
    expect(r.carrier).toBe("evri");
    expect(r.labelType).toBe("pdf");
  });

  it("scores a complete document as high confidence and not needing review", () => {
    const r = parseReturnDocument(complete);
    expect(r.confidence).toBeGreaterThanOrEqual(0.8);
    expect(r.needsReview).toBe(false);
  });

  it("searches the subject as well as the body", () => {
    const r = parseReturnDocument({
      ...complete,
      subject: "Return by 11 September 2026",
      body: "Thanks for shopping with us.",
    });
    expect(r.deadline?.toISOString().slice(0, 10)).toBe("2026-09-11");
  });

  it("flags a document with no deadline for review", () => {
    const r = parseReturnDocument({
      ...complete,
      subject: "Your order",
      body: "Order number: 401234567",
    });
    expect(r.deadline).toBeNull();
    expect(r.needsReview).toBe(true);
  });

  it("returns a low-confidence result for an unrelated email", () => {
    const r = parseReturnDocument({
      ...complete,
      senderDomain: "newsletter.example",
      subject: "Our summer sale is here",
      body: "Shop now for 20% off everything.",
      attachments: [],
    });
    expect(r.retailer).toBeNull();
    expect(r.confidence).toBeLessThan(0.3);
    expect(r.needsReview).toBe(true);
  });

  it("never throws on empty input", () => {
    expect(() =>
      parseReturnDocument({
        ...complete,
        senderDomain: "",
        subject: "",
        body: "",
        attachments: [],
      }),
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/parser/index.test.ts`
Expected: FAIL — cannot resolve `@/lib/parser`.

- [ ] **Step 3: Write the confidence scorer**

Create `lib/parser/confidence.ts`:

```ts
export interface ConfidenceInputs {
  hasRetailer: boolean;
  hasDeadline: boolean;
  deadlineConfidence: number;
  hasCarrier: boolean;
  hasLabel: boolean;
  hasReference: boolean;
}

// Weights sum to 1.0. Retailer and deadline dominate because they are what
// the dashboard needs to show a return at all — a return with no deadline
// cannot be triaged, which is the product's entire organising principle.
const WEIGHTS = {
  retailer: 0.3,
  deadline: 0.3,
  carrier: 0.15,
  label: 0.15,
  reference: 0.1,
} as const;

/** Auto-accept at or above this; below it, ask the user to confirm. */
export const REVIEW_THRESHOLD = 0.7;

export function scoreConfidence(inputs: ConfidenceInputs): number {
  let score = 0;

  if (inputs.hasRetailer) score += WEIGHTS.retailer;
  // The deadline contributes in proportion to how sure we are of it.
  if (inputs.hasDeadline) score += WEIGHTS.deadline * inputs.deadlineConfidence;
  if (inputs.hasCarrier) score += WEIGHTS.carrier;
  if (inputs.hasLabel) score += WEIGHTS.label;
  if (inputs.hasReference) score += WEIGHTS.reference;

  return Math.round(score * 100) / 100;
}
```

- [ ] **Step 4: Write the orchestrator**

Create `lib/parser/index.ts`:

```ts
import { EMPTY_DETECTED_RETURN } from "@/lib/parser/types";
import type { DetectedReturn, RawReturnDocument } from "@/lib/parser/types";
import { identifyRetailer } from "@/lib/parser/retailers";
import { extractDeadline } from "@/lib/parser/deadline";
import {
  extractCarrier,
  extractOrderRef,
  extractReturnId,
} from "@/lib/parser/carrier";
import { detectLabel } from "@/lib/parser/label";
import { REVIEW_THRESHOLD, scoreConfidence } from "@/lib/parser/confidence";

export * from "@/lib/parser/types";
export { REVIEW_THRESHOLD } from "@/lib/parser/confidence";

/**
 * Turn a raw ingested document into a structured return.
 *
 * Pure: no I/O, no clock access. The current time, where needed, arrives
 * as `doc.receivedAt`. Never throws — an unparseable document returns a
 * low-confidence result flagged for review.
 */
export function parseReturnDocument(doc: RawReturnDocument): DetectedReturn {
  // Deadlines and references appear in either the subject or the body.
  const searchText = `${doc.subject}\n${doc.body}`;

  const retailer = identifyRetailer(doc.senderDomain);
  const deadline = extractDeadline(searchText, doc.receivedAt);
  const carrier = extractCarrier(searchText);
  const orderRef = extractOrderRef(searchText);
  const returnId = extractReturnId(searchText);
  const labelType = detectLabel(doc.body, doc.attachments);

  const confidence = scoreConfidence({
    hasRetailer: retailer !== null,
    hasDeadline: deadline !== null,
    deadlineConfidence: deadline?.confidence ?? 0,
    hasCarrier: carrier !== null,
    hasLabel: labelType !== "none",
    hasReference: orderRef !== null || returnId !== null,
  });

  return {
    ...EMPTY_DETECTED_RETURN,
    retailer: retailer?.slug ?? null,
    retailerDisplayName: retailer?.displayName ?? null,
    orderRef,
    returnId,
    deadline: deadline?.date ?? null,
    deadlineConfidence: deadline?.confidence ?? 0,
    carrier,
    labelType,
    confidence,
    // A return with no deadline cannot be triaged, so it always needs a human.
    needsReview: confidence < REVIEW_THRESHOLD || deadline === null,
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test tests/parser/index.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 6: Run the whole suite**

Run: `pnpm test`
Expected: PASS, all 45 tests across 6 files.

- [ ] **Step 7: Commit**

```bash
git add lib/parser/confidence.ts lib/parser/index.ts tests/parser/index.test.ts
git commit -m "feat(parser): add confidence scoring and the parse orchestrator"
```

---

### Task 8: The accuracy gate

**Files:**
- Create: `fixtures/expected/asos-001.json`
- Create: `tests/parser/accuracy.test.ts`
- Modify: `docs/superpowers/specs/2026-08-26-core-product-v1-design.md` (record the measured number)

**Interfaces:**
- Consumes: `parseReturnDocument` from Task 7; the fixture corpus from Task 1
- Produces: a reported accuracy percentage; a regression gate

This is the task the whole plan exists for. The spec sets ≥85% on retailer + deadline as the gate for building anything downstream.

- [ ] **Step 1: Create the expected result for the first fixture**

Create `fixtures/expected/asos-001.json`:

```json
{
  "retailer": "asos",
  "orderRef": "401234567",
  "returnId": "RTN-88213004",
  "deadline": "2026-09-11",
  "carrier": "evri",
  "labelType": "pdf"
}
```

- [ ] **Step 2: Write the accuracy harness**

Create `tests/parser/accuracy.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseReturnDocument } from "@/lib/parser";
import type { RawReturnDocument } from "@/lib/parser/types";

const EMAILS_DIR = resolve(__dirname, "../../fixtures/emails");
const EXPECTED_DIR = resolve(__dirname, "../../fixtures/expected");

// The spec's gate: retailer and deadline are what the dashboard needs to
// triage a return at all.
const ACCURACY_THRESHOLD = 0.85;

interface Expected {
  retailer: string | null;
  orderRef: string | null;
  returnId: string | null;
  deadline: string | null;
  carrier: string | null;
  labelType: string;
}

function loadFixtureNames(): string[] {
  return readdirSync(EMAILS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

function loadDocument(name: string): RawReturnDocument {
  const raw = JSON.parse(
    readFileSync(resolve(EMAILS_DIR, `${name}.json`), "utf8"),
  );
  return { ...raw, userId: "fixture", receivedAt: new Date(raw.receivedAt) };
}

function loadExpected(name: string): Expected {
  return JSON.parse(readFileSync(resolve(EXPECTED_DIR, `${name}.json`), "utf8"));
}

describe("parser accuracy", () => {
  const names = loadFixtureNames();

  it("has a fixture corpus to measure against", () => {
    expect(names.length).toBeGreaterThan(0);
  });

  it(`extracts retailer and deadline correctly for >= ${ACCURACY_THRESHOLD * 100}% of fixtures`, () => {
    let correct = 0;
    const failures: string[] = [];

    for (const name of names) {
      const actual = parseReturnDocument(loadDocument(name));
      const expected = loadExpected(name);

      const retailerOk = actual.retailer === expected.retailer;
      const deadlineOk =
        (actual.deadline?.toISOString().slice(0, 10) ?? null) ===
        expected.deadline;

      if (retailerOk && deadlineOk) {
        correct += 1;
      } else {
        failures.push(
          `${name}: retailer ${retailerOk ? "ok" : `${actual.retailer} != ${expected.retailer}`}, ` +
            `deadline ${deadlineOk ? "ok" : `${actual.deadline?.toISOString().slice(0, 10) ?? "null"} != ${expected.deadline}`}`,
        );
      }
    }

    const accuracy = correct / names.length;

    console.log(
      `\n  Parser accuracy: ${(accuracy * 100).toFixed(1)}% (${correct}/${names.length})`,
    );
    if (failures.length > 0) {
      console.log(`  Failures:\n${failures.map((f) => `    - ${f}`).join("\n")}`);
    }

    expect(accuracy).toBeGreaterThanOrEqual(ACCURACY_THRESHOLD);
  });

  it("never throws on any fixture", () => {
    for (const name of names) {
      expect(() => parseReturnDocument(loadDocument(name))).not.toThrow();
    }
  });
});
```

- [ ] **Step 3: Run the accuracy harness**

Run: `pnpm test:accuracy`
Expected: PASS, with the accuracy percentage printed.

> **If it fails:** that is a legitimate outcome, not a blocked task. Record the number, note which fields failed and why, and report it. A low number here is the cheapest possible discovery — it is exactly what this plan was built to find out.

- [ ] **Step 4: Record the measured number in the spec**

In `docs/superpowers/specs/2026-08-26-core-product-v1-design.md`, under §1 Success criteria, replace the "Parser accuracy" target row's value with the measured result and the corpus size, e.g. `≥85% target — **measured 91% (10/11 fixtures, 2026-08-27)**`.

- [ ] **Step 5: Commit**

```bash
git add fixtures/expected tests/parser/accuracy.test.ts docs/superpowers/specs/
git commit -m "test(parser): add the accuracy gate and record the measured baseline"
```

---

## Definition of done

- [ ] `pnpm test` passes with all tests green
- [ ] `pnpm test:accuracy` reports a number, and that number is written into the spec
- [ ] The fixture corpus contains **at least 10 fixtures across at least 4 retailers** — fewer than that and the accuracy figure is noise
- [ ] Every fixture is anonymised
- [ ] `npx tsc --noEmit` passes with no errors

## Explicitly out of scope

Deferred to later plans, listed so they don't creep in:

- **PDF and image parsing / OCR.** The `~/Downloads/` artifacts (`Amazon return.pdf`, `Shein return.png`, `return_label.png`) belong to that plan, not this one. `detectLabel` only classifies label *type*; it never reads label *content*.
- Supabase schema and the Airtable migration
- Ingestion adapters (`ForwardAdapter`, `UploadAdapter`)
- The dashboard
- `user_corrections` persistence — the field exists on `DetectedReturn` in the spec, but storing patches requires the database

## Next plan

`ForwardAdapter` + inbound webhook, once the accuracy number justifies building on top of the parser.
