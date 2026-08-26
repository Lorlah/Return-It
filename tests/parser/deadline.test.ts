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
