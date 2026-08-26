import { describe, it, expect } from "vitest";
import { unwrapForwarded } from "@/lib/parser/forwarded";
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

  // Verified against real emails: retailers send from notification domains
  // that are NOT their shopping domain.
  it("matches SHEIN's notification domain", () => {
    expect(identifyRetailer("sheinnotice.com")?.slug).toBe("shein");
  });

  it("matches Temu's order domain", () => {
    expect(identifyRetailer("orders.temu.com")?.slug).toBe("temu");
  });

  it("falls back to a brand mention in the text for a returns platform", () => {
    // reboundreturns.com is ReBound, a platform serving many retailers.
    // The domain identifies the platform; the retailer is in the text.
    const m = identifyRetailer("reboundreturns.com", "Your PrettyLittleThing return");
    expect(m?.slug).toBe("plt");
    expect(m?.confidence).toBeLessThan(1);
  });

  it("returns null for a platform domain with no identifiable brand", () => {
    expect(identifyRetailer("reboundreturns.com", "Your return is ready")).toBeNull();
  });

  it("ignores brand text when the domain already identifies the retailer", () => {
    // A carrier email about a SHEIN return is still from the carrier.
    const m = identifyRetailer("inpost.co.uk", "Your SHEIN return QR code is ready");
    expect(m).toBeNull();
  });
});
