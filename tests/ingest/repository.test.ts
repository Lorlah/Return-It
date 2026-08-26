import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryIngestRepository } from "@/lib/ingest/repository";
import type { RawReturnDocument } from "@/lib/parser/types";

const doc: RawReturnDocument = {
  userId: "u1",
  source: "forward",
  receivedAt: new Date("2026-08-14T09:31:00Z"),
  senderDomain: "sheinnotice.com",
  subject: "Return label",
  body: "Order number: ABC123",
  attachments: [],
};

describe("InMemoryIngestRepository", () => {
  let repo: InMemoryIngestRepository;

  beforeEach(() => {
    repo = new InMemoryIngestRepository();
  });

  it("finds a user by their ingest address", async () => {
    repo.addUser({
      id: "u1",
      email: "lola@example.com",
      ingestAddress: "lola-4f2a@in.return-it.co.uk",
      ingestConsentAt: new Date(),
      ingestConsentRevokedAt: null,
    });

    const found = await repo.findUserByIngestAddress("lola-4f2a@in.return-it.co.uk");
    expect(found?.id).toBe("u1");
  });

  it("matches an ingest address case-insensitively", async () => {
    repo.addUser({
      id: "u1",
      email: "lola@example.com",
      ingestAddress: "lola-4f2a@in.return-it.co.uk",
      ingestConsentAt: new Date(),
      ingestConsentRevokedAt: null,
    });

    expect(
      (await repo.findUserByIngestAddress("LOLA-4F2A@IN.RETURN-IT.CO.UK"))?.id,
    ).toBe("u1");
  });

  it("returns null for an unknown address", async () => {
    expect(await repo.findUserByIngestAddress("nobody@in.return-it.co.uk")).toBeNull();
  });

  it("does not return a user who has revoked consent", async () => {
    repo.addUser({
      id: "u1",
      email: "lola@example.com",
      ingestAddress: "lola-4f2a@in.return-it.co.uk",
      ingestConsentAt: new Date("2026-01-01"),
      ingestConsentRevokedAt: new Date("2026-06-01"),
    });

    expect(await repo.findUserByIngestAddress("lola-4f2a@in.return-it.co.uk")).toBeNull();
  });

  it("stores a raw document and returns an id", async () => {
    const id = await repo.saveRawDocument(doc, "storage/key/1");
    expect(id).toBeTruthy();
    expect(repo.rawDocuments).toHaveLength(1);
    expect(repo.rawDocuments[0].rawStorageKey).toBe("storage/key/1");
  });

  it("sets a retention expiry on every stored document", async () => {
    await repo.saveRawDocument(doc, "k");
    const stored = repo.rawDocuments[0];
    expect(stored.retentionExpiresAt.getTime()).toBeGreaterThan(
      stored.receivedAt.getTime(),
    );
  });

  it("appends an event", async () => {
    await repo.appendEvent({
      actorType: "system",
      actorId: null,
      entityType: "raw_document",
      entityId: "r1",
      type: "ingested",
      payload: { source: "forward" },
    });
    expect(repo.events).toHaveLength(1);
    expect(repo.events[0].type).toBe("ingested");
  });
});
