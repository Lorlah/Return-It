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
