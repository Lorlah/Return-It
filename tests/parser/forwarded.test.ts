import { describe, it, expect } from "vitest";
import { unwrapForwarded } from "@/lib/parser/forwarded";

const FORWARDED = `---------- Forwarded message ---------
From: PLT <no-reply@reboundreturns.com>
Date: Thu, Jun 4, 2026 at 7:56 PM
Subject: Your PrettyLittleThing return
To: <shopper@example.com>

Your return has been successfully generated.
Order number: LUK700001710054`;

describe("unwrapForwarded", () => {
  it("recovers the original sender domain", () => {
    const r = unwrapForwarded("gmail.com", FORWARDED);
    expect(r.senderDomain).toBe("reboundreturns.com");
  });

  it("recovers the original subject", () => {
    expect(unwrapForwarded("gmail.com", FORWARDED).subject).toBe(
      "Your PrettyLittleThing return",
    );
  });

  it("strips the forwarded header from the body", () => {
    const r = unwrapForwarded("gmail.com", FORWARDED);
    expect(r.body).not.toContain("Forwarded message");
    expect(r.body).toContain("Order number: LUK700001710054");
  });

  it("handles a bare email address with no display name", () => {
    const body = `---------- Forwarded message ---------
From: no-reply@asos.com
Subject: Your return

Body here`;
    expect(unwrapForwarded("gmail.com", body).senderDomain).toBe("asos.com");
  });

  it("passes a non-forwarded email through untouched", () => {
    const r = unwrapForwarded("asos.com", "Just a normal email body");
    expect(r.senderDomain).toBe("asos.com");
    expect(r.subject).toBeNull();
    expect(r.body).toBe("Just a normal email body");
  });
});
