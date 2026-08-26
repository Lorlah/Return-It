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
