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

  it("still yields a usable return when no deadline is stated", () => {
    // Verified real case: SHEIN return emails carry no deadline at all.
    // A missing deadline must not by itself force manual review, or every
    // SHEIN return lands in the review queue.
    const r = parseReturnDocument({
      ...complete,
      senderDomain: "sheinnotice.com",
      subject: "You have received a EVRI return label from SHEIN",
      body:
        "Order number：GSO187019000B2Y Return ID: UR18P3E0MBHX\n" +
        "Please print the attached return label.",
    });
    expect(r.deadline).toBeNull();
    expect(r.retailer).toBe("shein");
    expect(r.carrier).toBe("evri");
    expect(r.needsReview).toBe(false);
  });

  it("recovers the retailer from a forwarded email", () => {
    const r = parseReturnDocument({
      ...complete,
      senderDomain: "gmail.com",
      subject: "Fwd: Your PrettyLittleThing return",
      body:
        "---------- Forwarded message ---------\n" +
        "From: PLT <no-reply@reboundreturns.com>\n" +
        "Subject: Your PrettyLittleThing return\n\n" +
        "Order number: LUK700001710054\nPlease send within 7 days.",
      attachments: [],
    });
    expect(r.retailer).toBe("plt");
    expect(r.orderRef).toBe("LUK700001710054");
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

  it("does not detect a return in an investment newsletter", () => {
    // Real false-positive risk: finance mail is full of the word "returns".
    const r = parseReturnDocument({
      ...complete,
      senderDomain: "fundrise.com",
      subject: "14.00% Fixed Returns in Northern Virginia Real Estate",
      body: "Explore fixed-return real estate investments in high-growth markets.",
      attachments: [],
    });
    expect(r.retailer).toBeNull();
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

describe("label detection reads the subject", () => {
  it("detects a QR announced only in the subject line", () => {
    // Real InPost email: the subject says "QR code", the body says only
    // "Send code 885 802 275".
    const r = parseReturnDocument({
      ...complete,
      senderDomain: "inpost.co.uk",
      subject: "Your SHEIN return QR code is ready",
      body: "Drop your parcel off at any of our lockers with the code below.\nSend code 885 802 275",
      attachments: [],
    });
    expect(r.labelType).toBe("qr");
  });
});
