import type { RawReturnDocument } from "@/lib/parser/types";

export interface StoredUser {
  id: string;
  email: string;
  ingestAddress: string;
  ingestConsentAt: Date | null;
  ingestConsentRevokedAt: Date | null;
}

export interface StoredRawDocument {
  id: string;
  userId: string;
  source: RawReturnDocument["source"];
  receivedAt: Date;
  senderDomain: string;
  subject: string;
  rawStorageKey: string;
  retentionExpiresAt: Date;
}

export interface EventInput {
  actorType: string;
  actorId: string | null;
  entityType: string;
  entityId: string;
  type: string;
  payload?: Record<string, unknown>;
}

export interface StoredEvent extends EventInput {
  id: string;
  at: Date;
}

/**
 * Storage seam for the ingestion path.
 *
 * Everything upstream depends on this interface rather than on Postgres, so
 * the whole path is testable with no database. The Supabase implementation
 * satisfies the same contract.
 */
export interface IngestRepository {
  findUserByIngestAddress(address: string): Promise<StoredUser | null>;
  saveRawDocument(doc: RawReturnDocument, storageKey: string): Promise<string>;
  appendEvent(event: EventInput): Promise<void>;
  deleteExpiredDocuments(now: Date): Promise<DeletedDocuments>;
}

/**
 * What a retention delete removed.
 *
 * The keys come back with the count because deleting the row is only half the
 * erasure: the raw bytes it points at live outside the database and would
 * otherwise survive as orphans. The caller cannot ask for them afterwards —
 * the rows that named them are gone — so they must be returned here.
 */
export interface DeletedDocuments {
  deletedCount: number;
  storageKeys: string[];
}

// ── In-memory implementation ────────────────────────────────────────────────

const RETENTION_DAYS = 90;
const MS_PER_DAY = 86_400_000;

export class InMemoryIngestRepository implements IngestRepository {
  readonly users: StoredUser[] = [];
  readonly rawDocuments: StoredRawDocument[] = [];
  readonly events: StoredEvent[] = [];

  private counter = 0;

  private nextId(prefix: string): string {
    this.counter += 1;
    return `${prefix}-${this.counter}`;
  }

  addUser(user: StoredUser): void {
    this.users.push(user);
  }

  async findUserByIngestAddress(address: string): Promise<StoredUser | null> {
    const wanted = address.trim().toLowerCase();
    const found = this.users.find(
      (u) => u.ingestAddress.toLowerCase() === wanted,
    );

    // A user who has revoked consent is treated as absent: revocation must
    // stop ingestion immediately, per the PRD.
    if (!found || found.ingestConsentRevokedAt !== null) return null;
    return found;
  }

  async saveRawDocument(
    doc: RawReturnDocument,
    storageKey: string,
  ): Promise<string> {
    const id = this.nextId("raw");
    this.rawDocuments.push({
      id,
      userId: doc.userId,
      source: doc.source,
      receivedAt: doc.receivedAt,
      senderDomain: doc.senderDomain,
      subject: doc.subject,
      rawStorageKey: storageKey,
      retentionExpiresAt: new Date(
        doc.receivedAt.getTime() + RETENTION_DAYS * MS_PER_DAY,
      ),
    });
    return id;
  }

  async appendEvent(event: EventInput): Promise<void> {
    this.events.push({ ...event, id: this.nextId("evt"), at: new Date() });
  }

  async deleteExpiredDocuments(now: Date): Promise<DeletedDocuments> {
    const expired = this.rawDocuments.filter(
      (d) => d.retentionExpiresAt.getTime() <= now.getTime(),
    );

    // Mutate in place: `rawDocuments` is the array tests hold a reference to.
    for (const doc of expired) {
      this.rawDocuments.splice(this.rawDocuments.indexOf(doc), 1);
    }

    return {
      deletedCount: expired.length,
      storageKeys: expired.map((d) => d.rawStorageKey),
    };
  }
}
