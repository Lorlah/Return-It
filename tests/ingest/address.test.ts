import { describe, it, expect } from "vitest";
import {
  generateIngestAddress,
  parseIngestAddress,
  INGEST_DOMAIN,
} from "@/lib/ingest/address";

describe("generateIngestAddress", () => {
  it("builds a slug-nonce address at the ingest domain", () => {
    expect(generateIngestAddress("Lola", "4f2a")).toBe(`lola-4f2a@${INGEST_DOMAIN}`);
  });

  it("lowercases and strips unsafe characters from the name", () => {
    // The space becomes a hyphen; the apostrophe and bang are dropped.
    expect(generateIngestAddress("Lola O'Salehu!", "abcd")).toBe(
      `lola-osalehu-abcd@${INGEST_DOMAIN}`,
    );
  });

  it("round-trips a multi-part slug unambiguously", () => {
    // "lola-osalehu-abcd" must split as slug "lola-osalehu" + nonce "abcd",
    // not greedily consume the nonce into the slug.
    const addr = generateIngestAddress("Lola O'Salehu!", "abcd");
    expect(parseIngestAddress(addr)).toEqual({
      slug: "lola-osalehu",
      nonce: "abcd",
    });
  });

  it("collapses whitespace to a single hyphen", () => {
    expect(generateIngestAddress("Mary  Jane", "abcd")).toBe(
      `mary-jane-abcd@${INGEST_DOMAIN}`,
    );
  });

  it("falls back to a generic slug when the name has no usable characters", () => {
    expect(generateIngestAddress("!!!", "abcd")).toBe(`user-abcd@${INGEST_DOMAIN}`);
  });

  it("truncates a very long name", () => {
    const addr = generateIngestAddress("a".repeat(100), "abcd");
    expect(addr.split("@")[0].length).toBeLessThanOrEqual(37);
  });
});

describe("parseIngestAddress", () => {
  it("round-trips a generated address", () => {
    const addr = generateIngestAddress("Lola", "4f2a");
    expect(parseIngestAddress(addr)).toEqual({ slug: "lola", nonce: "4f2a" });
  });

  it("is case insensitive", () => {
    expect(parseIngestAddress(`LOLA-4F2A@${INGEST_DOMAIN}`)).toEqual({
      slug: "lola",
      nonce: "4f2a",
    });
  });

  it("handles a hyphenated slug", () => {
    expect(parseIngestAddress(`mary-jane-abcd@${INGEST_DOMAIN}`)).toEqual({
      slug: "mary-jane",
      nonce: "abcd",
    });
  });

  it("rejects an address at the wrong domain", () => {
    expect(parseIngestAddress("lola-4f2a@example.com")).toBeNull();
  });

  it("rejects an address with no nonce", () => {
    expect(parseIngestAddress(`lola@${INGEST_DOMAIN}`)).toBeNull();
  });

  it("rejects malformed input without throwing", () => {
    expect(parseIngestAddress("not-an-address")).toBeNull();
    expect(parseIngestAddress("")).toBeNull();
  });
});
