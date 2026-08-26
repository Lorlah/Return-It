import { describe, it, expect } from "vitest";
import { parseInboundPayload, extractRecipientAddress } from "@/lib/ingest/inbound";

const valid = {
  to: "lola-4f2a@in.return-it.co.uk",
  from: "SHEIN <noreply@sheinnotice.com>",
  subject: "You have received a EVRI return label from SHEIN",
  text: "Order number: GSO187019000B2Y",
  receivedAt: "2026-08-14T09:31:00Z",
  attachments: [
    { filename: "label.pdf", contentType: "application/pdf", size: 48211 },
  ],
};

describe("parseInboundPayload", () => {
  it("builds a RawReturnDocument from a valid payload", () => {
    const doc = parseInboundPayload(valid, "user-1");
    expect(doc?.userId).toBe("user-1");
    expect(doc?.source).toBe("forward");
    expect(doc?.senderDomain).toBe("sheinnotice.com");
    expect(doc?.subject).toBe(valid.subject);
    expect(doc?.body).toBe(valid.text);
  });

  it("extracts the sender domain from a bare address", () => {
    const doc = parseInboundPayload({ ...valid, from: "noreply@asos.com" }, "u");
    expect(doc?.senderDomain).toBe("asos.com");
  });

  it("lowercases the sender domain", () => {
    const doc = parseInboundPayload({ ...valid, from: "X <a@ASOS.COM>" }, "u");
    expect(doc?.senderDomain).toBe("asos.com");
  });

  it("maps attachments to the parser's shape", () => {
    const doc = parseInboundPayload(valid, "u");
    expect(doc?.attachments).toEqual([
      { filename: "label.pdf", mimeType: "application/pdf", sizeBytes: 48211 },
    ]);
  });

  it("tolerates a missing attachments array", () => {
    const { attachments, ...withoutAttachments } = valid;
    expect(parseInboundPayload(withoutAttachments, "u")?.attachments).toEqual([]);
  });

  it("falls back to the html field when text is absent", () => {
    const { text, ...rest } = valid;
    const doc = parseInboundPayload({ ...rest, html: "<p>Hello</p>" }, "u");
    expect(doc?.body).toContain("Hello");
  });

  it("strips HTML tags from an html-only body", () => {
    const { text, ...rest } = valid;
    const doc = parseInboundPayload({ ...rest, html: "<p>Order <b>123</b></p>" }, "u");
    expect(doc?.body).not.toContain("<");
  });

  it("returns null when the payload is not an object", () => {
    expect(parseInboundPayload(null, "u")).toBeNull();
    expect(parseInboundPayload("string", "u")).toBeNull();
    expect(parseInboundPayload(42, "u")).toBeNull();
  });

  it("returns null when there is no sender", () => {
    const { from, ...rest } = valid;
    expect(parseInboundPayload(rest, "u")).toBeNull();
  });

  it("returns null when there is no body of any kind", () => {
    const { text, ...rest } = valid;
    expect(parseInboundPayload(rest, "u")).toBeNull();
  });

  it("defaults receivedAt to now when absent or unparseable", () => {
    const { receivedAt, ...rest } = valid;
    const doc = parseInboundPayload(rest, "u");
    expect(doc?.receivedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(doc?.receivedAt.getTime())).toBe(false);
  });

  it("ignores attachment entries that are not objects", () => {
    const doc = parseInboundPayload({ ...valid, attachments: [null, "x", 1] }, "u");
    expect(doc?.attachments).toEqual([]);
  });

  it("does not throw on a deeply malformed payload", () => {
    expect(() =>
      parseInboundPayload({ from: 1, subject: [], text: {}, attachments: "no" }, "u"),
    ).not.toThrow();
  });
});

describe("extractRecipientAddress", () => {
  it("reads the to field", () => {
    expect(extractRecipientAddress(valid)).toBe("lola-4f2a@in.return-it.co.uk");
  });

  it("unwraps a display-name form", () => {
    expect(
      extractRecipientAddress({ to: "Lola <lola-4f2a@in.return-it.co.uk>" }),
    ).toBe("lola-4f2a@in.return-it.co.uk");
  });

  it("takes the first of several recipients", () => {
    expect(
      extractRecipientAddress({ to: "lola-4f2a@in.return-it.co.uk, x@y.com" }),
    ).toBe("lola-4f2a@in.return-it.co.uk");
  });

  it("returns null when absent or malformed", () => {
    expect(extractRecipientAddress({})).toBeNull();
    expect(extractRecipientAddress(null)).toBeNull();
  });
});
