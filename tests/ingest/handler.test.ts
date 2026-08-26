import { describe, it, expect, beforeEach } from "vitest";
import { createHmac } from "node:crypto";
import { handleInboundEmail } from "@/lib/ingest/handler";
import { InMemoryIngestRepository } from "@/lib/ingest/repository";

const SECRET = "test-secret";
const ADDRESS = "lola-4f2a@in.return-it.co.uk";

function sign(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("hex");
}

function payload(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    to: ADDRESS,
    from: "SHEIN <noreply@sheinnotice.com>",
    subject: "You have received a EVRI return label from SHEIN",
    text: "Order number：GSO187019000B2Y Return ID: UR18P3E0MBHX\nPlease print the attached return label.",
    receivedAt: "2026-08-14T09:31:00Z",
    attachments: [
      { filename: "label.pdf", contentType: "application/pdf", size: 48211 },
    ],
    ...overrides,
  });
}

describe("handleInboundEmail", () => {
  let repo: InMemoryIngestRepository;
  let deps: Parameters<typeof handleInboundEmail>[2];

  beforeEach(() => {
    repo = new InMemoryIngestRepository();
    repo.addUser({
      id: "u1",
      email: "lola@example.com",
      ingestAddress: ADDRESS,
      ingestConsentAt: new Date("2026-01-01"),
      ingestConsentRevokedAt: null,
    });
    deps = {
      repository: repo,
      secret: SECRET,
      storeRawBytes: async () => "storage/key/1",
    };
  });

  it("accepts a correctly signed email and parses the return", async () => {
    const body = payload();
    const result = await handleInboundEmail(body, sign(body), deps);

    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") return;
    expect(result.detectedReturn.retailer).toBe("shein");
    expect(result.detectedReturn.carrier).toBe("evri");
    expect(result.detectedReturn.orderRef).toBe("GSO187019000B2Y");
  });

  it("stores the raw document and appends exactly one event", async () => {
    const body = payload();
    await handleInboundEmail(body, sign(body), deps);

    expect(repo.rawDocuments).toHaveLength(1);
    expect(repo.rawDocuments[0].rawStorageKey).toBe("storage/key/1");
    expect(repo.events).toHaveLength(1);
    expect(repo.events[0].type).toBe("ingested");
  });

  it("rejects an unsigned request before doing any work", async () => {
    const body = payload();
    const result = await handleInboundEmail(body, null, deps);

    expect(result).toEqual({ status: "rejected", reason: "bad_signature" });
    // Nothing was stored: the signature check runs first.
    expect(repo.rawDocuments).toHaveLength(0);
    expect(repo.events).toHaveLength(0);
  });

  it("rejects a request signed with the wrong secret", async () => {
    const body = payload();
    const wrong = createHmac("sha256", "attacker").update(body).digest("hex");
    const result = await handleInboundEmail(body, wrong, deps);

    expect(result).toEqual({ status: "rejected", reason: "bad_signature" });
  });

  it("rejects a signed request whose body has been tampered with", async () => {
    const original = payload();
    const tampered = payload({ to: "someone-else@in.return-it.co.uk" });
    const result = await handleInboundEmail(tampered, sign(original), deps);

    expect(result).toEqual({ status: "rejected", reason: "bad_signature" });
  });

  it("rejects invalid JSON", async () => {
    const body = "not json";
    const result = await handleInboundEmail(body, sign(body), deps);

    expect(result).toEqual({ status: "rejected", reason: "malformed_payload" });
  });

  it("rejects an address at a domain we do not own", async () => {
    const body = payload({ to: "lola-4f2a@evil.example" });
    const result = await handleInboundEmail(body, sign(body), deps);

    expect(result).toEqual({ status: "rejected", reason: "unknown_recipient" });
  });

  it("rejects an unknown recipient without storing anything", async () => {
    const body = payload({ to: "nobody-9999@in.return-it.co.uk" });
    const result = await handleInboundEmail(body, sign(body), deps);

    expect(result).toEqual({ status: "rejected", reason: "unknown_user" });
    expect(repo.rawDocuments).toHaveLength(0);
  });

  it("stops ingesting for a user who has revoked consent", async () => {
    repo.users[0].ingestConsentRevokedAt = new Date("2026-06-01");
    const body = payload();
    const result = await handleInboundEmail(body, sign(body), deps);

    expect(result).toEqual({ status: "rejected", reason: "unknown_user" });
    expect(repo.rawDocuments).toHaveLength(0);
  });

  it("fails closed when no secret is configured", async () => {
    const body = payload();
    const result = await handleInboundEmail(body, sign(body), {
      ...deps,
      secret: null,
    });

    expect(result).toEqual({ status: "rejected", reason: "bad_signature" });
  });

  it("handles a forwarded email, recovering the true retailer", async () => {
    const body = payload({
      from: "Lola <lola@gmail.com>",
      subject: "Fwd: Your PrettyLittleThing return",
      text:
        "---------- Forwarded message ---------\n" +
        "From: PLT <no-reply@reboundreturns.com>\n" +
        "Subject: Your PrettyLittleThing return\n\n" +
        "Order number: LUK700001710054\nPlease send within 7 days.",
      attachments: [],
    });
    const result = await handleInboundEmail(body, sign(body), deps);

    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") return;
    expect(result.detectedReturn.retailer).toBe("plt");
    expect(result.detectedReturn.orderRef).toBe("LUK700001710054");
  });
});
