import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "@/lib/ingest/signature";

const SECRET = "test-secret";
const BODY = '{"from":"a@b.com"}';

function sign(body: string, secret = SECRET): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyWebhookSignature", () => {
  it("accepts a correct signature", () => {
    expect(verifyWebhookSignature(BODY, sign(BODY), SECRET)).toBe(true);
  });

  it("accepts a signature with a sha256= prefix", () => {
    expect(verifyWebhookSignature(BODY, `sha256=${sign(BODY)}`, SECRET)).toBe(true);
  });

  it("rejects a signature over different content", () => {
    expect(verifyWebhookSignature(BODY, sign("other"), SECRET)).toBe(false);
  });

  it("rejects a signature made with a different secret", () => {
    expect(verifyWebhookSignature(BODY, sign(BODY, "wrong"), SECRET)).toBe(false);
  });

  it("rejects a missing signature", () => {
    expect(verifyWebhookSignature(BODY, null, SECRET)).toBe(false);
  });

  it("rejects a malformed signature without throwing", () => {
    expect(verifyWebhookSignature(BODY, "not-hex", SECRET)).toBe(false);
    expect(verifyWebhookSignature(BODY, "", SECRET)).toBe(false);
  });

  it("fails closed when no secret is configured", () => {
    // An unset secret must never mean "accept everything" — the inbound
    // address is publicly reachable.
    expect(verifyWebhookSignature(BODY, sign(BODY), null)).toBe(false);
  });
});
