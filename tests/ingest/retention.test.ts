import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryIngestRepository } from "@/lib/ingest/repository";
import { runRetentionSweep } from "@/lib/ingest/retention";
import type { RawReturnDocument } from "@/lib/parser/types";

const NOW = new Date("2026-08-28T12:00:00Z");
const MS_PER_DAY = 86_400_000;

/** A document received `daysAgo` before NOW — so it expires 90 days after that. */
function docReceivedDaysAgo(daysAgo: number, userId = "u1"): RawReturnDocument {
  return {
    userId,
    source: "forward",
    receivedAt: new Date(NOW.getTime() - daysAgo * MS_PER_DAY),
    senderDomain: "sheinnotice.com",
    subject: "Return label",
    body: "Order number: ABC123",
    attachments: [],
  };
}

/** Records the keys it was asked to delete; optionally throws for some of them. */
function fakeDeleteObject(failOn: string[] = []) {
  const deleted: string[] = [];
  const deleteObject = async (key: string): Promise<void> => {
    if (failOn.includes(key)) {
      throw new Error("object not found");
    }
    deleted.push(key);
  };
  return { deleted, deleteObject };
}

describe("runRetentionSweep", () => {
  let repo: InMemoryIngestRepository;

  beforeEach(() => {
    repo = new InMemoryIngestRepository();
  });

  it("deletes rows past their expiry and leaves unexpired rows alone", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(120), "raw/expired-1");
    await repo.saveRawDocument(docReceivedDaysAgo(91), "raw/expired-2");
    await repo.saveRawDocument(docReceivedDaysAgo(30), "raw/fresh");

    const { deleteObject } = fakeDeleteObject();
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(result.deletedCount).toBe(2);
    expect(repo.rawDocuments).toHaveLength(1);
    expect(repo.rawDocuments[0].rawStorageKey).toBe("raw/fresh");
  });

  it("keeps a document that is one day short of its expiry", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(89), "raw/almost");

    const { deleteObject } = fakeDeleteObject();
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(result.deletedCount).toBe(0);
    expect(repo.rawDocuments).toHaveLength(1);
  });

  it("deletes the storage object behind every deleted row", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(120), "raw/expired-1");
    await repo.saveRawDocument(docReceivedDaysAgo(100), "raw/expired-2");

    const { deleted, deleteObject } = fakeDeleteObject();
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(deleted).toEqual(["raw/expired-1", "raw/expired-2"]);
    expect(result.objectsDeleted).toBe(2);
    expect(result.failures).toEqual([]);
  });

  it("continues the sweep when one storage deletion fails", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(120), "raw/ok-1");
    await repo.saveRawDocument(docReceivedDaysAgo(110), "raw/unreachable");
    await repo.saveRawDocument(docReceivedDaysAgo(100), "raw/ok-2");

    const { deleted, deleteObject } = fakeDeleteObject(["raw/unreachable"]);
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    // The failure must not stop the objects after it from being deleted.
    expect(deleted).toEqual(["raw/ok-1", "raw/ok-2"]);
    expect(result.deletedCount).toBe(3);
    expect(result.objectsDeleted).toBe(2);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain("raw/unreachable");
  });

  it("reports every failure when no object can be deleted", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(120), "raw/a");
    await repo.saveRawDocument(docReceivedDaysAgo(110), "raw/b");

    const { deleteObject } = fakeDeleteObject(["raw/a", "raw/b"]);
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(result.objectsDeleted).toBe(0);
    expect(result.failures).toHaveLength(2);
    // The rows are still gone — the database is the record we are held to.
    expect(repo.rawDocuments).toHaveLength(0);
  });

  it("appends exactly one audit event summarising the sweep", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(120), "raw/expired-1");
    await repo.saveRawDocument(docReceivedDaysAgo(110), "raw/expired-2");

    const { deleteObject } = fakeDeleteObject(["raw/expired-2"]);
    await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(repo.events).toHaveLength(1);
    const event = repo.events[0];
    expect(event.entityType).toBe("retention");
    expect(event.type).toBe("sweep_completed");
    expect(event.actorType).toBe("system");
    expect(event.actorId).toBeNull();
    expect(event.payload).toMatchObject({
      deletedCount: 2,
      objectsDeleted: 1,
      failureCount: 1,
      sweptAt: NOW.toISOString(),
    });
  });

  it("succeeds as a no-op when nothing has expired", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(10), "raw/fresh");

    const { deleted, deleteObject } = fakeDeleteObject();
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(result).toEqual({ deletedCount: 0, objectsDeleted: 0, failures: [] });
    expect(deleted).toEqual([]);
    expect(repo.rawDocuments).toHaveLength(1);
    // Still audited: "the job ran and found nothing" is the evidence the
    // control is live, not just declared.
    expect(repo.events).toHaveLength(1);
  });

  it("succeeds on a completely empty store", async () => {
    const { deleteObject } = fakeDeleteObject();
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(result.deletedCount).toBe(0);
    expect(repo.events).toHaveLength(1);
  });

  it("defaults to the wall clock when no `now` is supplied", async () => {
    // Received far enough in the past that it is expired under any real clock.
    await repo.saveRawDocument(docReceivedDaysAgo(400), "raw/ancient");

    const { deleted, deleteObject } = fakeDeleteObject();
    const result = await runRetentionSweep({ repository: repo, deleteObject });

    expect(result.deletedCount).toBe(1);
    expect(deleted).toEqual(["raw/ancient"]);
  });

  it("deletes across users in a single sweep", async () => {
    await repo.saveRawDocument(docReceivedDaysAgo(120, "u1"), "u1/expired");
    await repo.saveRawDocument(docReceivedDaysAgo(120, "u2"), "u2/expired");

    const { deleted, deleteObject } = fakeDeleteObject();
    const result = await runRetentionSweep({ repository: repo, deleteObject, now: NOW });

    expect(result.deletedCount).toBe(2);
    expect(deleted).toEqual(["u1/expired", "u2/expired"]);
  });
});

describe("InMemoryIngestRepository.deleteExpiredDocuments", () => {
  it("returns the storage keys of the rows it removed", async () => {
    const repo = new InMemoryIngestRepository();
    await repo.saveRawDocument(docReceivedDaysAgo(120), "raw/expired");
    await repo.saveRawDocument(docReceivedDaysAgo(1), "raw/fresh");

    const { deletedCount, storageKeys } = await repo.deleteExpiredDocuments(NOW);

    expect(deletedCount).toBe(1);
    expect(storageKeys).toEqual(["raw/expired"]);
  });

  it("deletes a document exactly at its expiry instant", async () => {
    const repo = new InMemoryIngestRepository();
    await repo.saveRawDocument(docReceivedDaysAgo(90), "raw/on-the-boundary");

    // Retention is 90 days from receipt, so at exactly +90 days it has expired.
    const { deletedCount } = await repo.deleteExpiredDocuments(NOW);
    expect(deletedCount).toBe(1);
  });
});
