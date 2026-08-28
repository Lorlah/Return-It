import type { IngestRepository } from "@/lib/ingest/repository";

/**
 * Enforcement of the 90-day retention policy for `raw_documents`.
 *
 * The expiry itself is written on every row at ingestion time; this is the job
 * that acts on it. A declared-but-unenforced retention policy is worse than
 * none — the stated policy is what we would be held to under UK GDPR, and data
 * kept past it cannot be un-retained. See F-3 in docs/compliance-register.md.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface RetentionResult {
  /** Rows removed from `raw_documents`. */
  deletedCount: number;
  /** Storage objects successfully removed. */
  objectsDeleted: number;
  /**
   * One entry per object that could not be deleted, as `<key>: <reason>`.
   *
   * The key is kept because a failure is an orphaned object that still holds
   * personal data past its retention date — without the key there is nothing
   * to retry, and the sweep would silently leave data behind.
   */
  failures: string[];
}

export interface RetentionDeps {
  repository: IngestRepository;
  /** Removes one stored object by key. Injected so this stays free of I/O choices. */
  deleteObject: (key: string) => Promise<void>;
  /** Overridable for tests; defaults to the wall clock. */
  now?: Date;
}

// ── Sweep ───────────────────────────────────────────────────────────────────

/**
 * Deletes every expired raw document and the bytes it referenced.
 *
 * Rows go first, then objects: if the process dies midway the surviving state
 * is an orphaned object rather than a row pointing at bytes that are already
 * gone. Neither is good, but an orphan is recoverable — the key is in the
 * audit event — while a dangling row is a broken record.
 *
 * Individual object deletions are allowed to fail without aborting the sweep.
 * One unreachable object must not stop the other ninety from being erased; the
 * failures are collected and reported instead.
 */
export async function runRetentionSweep(
  deps: RetentionDeps,
): Promise<RetentionResult> {
  const now = deps.now ?? new Date();

  const { deletedCount, storageKeys } =
    await deps.repository.deleteExpiredDocuments(now);

  const failures: string[] = [];
  let objectsDeleted = 0;

  for (const key of storageKeys) {
    try {
      await deps.deleteObject(key);
      objectsDeleted += 1;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      failures.push(`${key}: ${reason}`);
    }
  }

  // The events table is the audit log, and a deletion sweep is exactly what
  // must be auditable. One event per sweep, written even when nothing expired:
  // "the job ran and found nothing" is the evidence that the control is live.
  await deps.repository.appendEvent({
    actorType: "system",
    actorId: null,
    entityType: "retention",
    entityId: crypto.randomUUID(),
    type: "sweep_completed",
    payload: {
      sweptAt: now.toISOString(),
      deletedCount,
      objectsDeleted,
      failureCount: failures.length,
      failures,
    },
  });

  return { deletedCount, objectsDeleted, failures };
}
