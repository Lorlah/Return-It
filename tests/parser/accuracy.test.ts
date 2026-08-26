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

function isoDate(d: Date | null): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
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
      const deadlineOk = isoDate(actual.deadline) === expected.deadline;

      if (retailerOk && deadlineOk) {
        correct += 1;
      } else {
        failures.push(
          `${name}: retailer ${retailerOk ? "ok" : `${actual.retailer} != ${expected.retailer}`}, ` +
            `deadline ${deadlineOk ? "ok" : `${isoDate(actual.deadline)} != ${expected.deadline}`}`,
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

  it("reports per-field accuracy across the corpus", () => {
    const fields = ["retailer", "orderRef", "returnId", "carrier", "labelType"] as const;
    const tally: Record<string, number> = {};

    for (const name of names) {
      const actual = parseReturnDocument(loadDocument(name));
      const expected = loadExpected(name);
      for (const f of fields) {
        if (actual[f] === expected[f]) tally[f] = (tally[f] ?? 0) + 1;
      }
      if (isoDate(actual.deadline) === expected.deadline) {
        tally.deadline = (tally.deadline ?? 0) + 1;
      }
    }

    const lines = [...fields, "deadline" as const].map(
      (f) => `    ${f.padEnd(12)} ${(((tally[f] ?? 0) / names.length) * 100).toFixed(0)}% (${tally[f] ?? 0}/${names.length})`,
    );
    console.log(`\n  Per-field accuracy:\n${lines.join("\n")}`);

    // Reporting only — the gate above is what blocks.
    expect(names.length).toBeGreaterThan(0);
  });

  it("never throws on any fixture", () => {
    for (const name of names) {
      expect(() => parseReturnDocument(loadDocument(name))).not.toThrow();
    }
  });
});
