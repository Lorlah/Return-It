import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RawReturnDocument } from "@/lib/parser/types";
import type {
  DeletedDocuments,
  EventInput,
  IngestRepository,
  StoredUser,
} from "@/lib/ingest/repository";

// ── Configuration ───────────────────────────────────────────────────────────

const RETENTION_DAYS = 90;
const MS_PER_DAY = 86_400_000;

/**
 * Server-side Supabase client.
 *
 * Uses the service-role key, which BYPASSES row-level security — so this
 * module must never be imported into client code. RLS still protects every
 * path that goes through the browser; this one is trusted because it only
 * runs in route handlers we control.
 */
export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ── Repository ──────────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  email: string;
  ingest_address: string | null;
  ingest_consent_at: string | null;
  ingest_consent_revoked_at: string | null;
}

/**
 * Postgres-backed implementation of the ingestion storage seam.
 *
 * Satisfies exactly the same contract as `InMemoryIngestRepository`, which is
 * what the unit tests run against — so swapping between them changes one
 * binding and nothing else.
 */
export class SupabaseIngestRepository implements IngestRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findUserByIngestAddress(address: string): Promise<StoredUser | null> {
    const wanted = address.trim().toLowerCase();

    const { data, error } = await this.client
      .from("app_users")
      .select("id, email, ingest_address, ingest_consent_at, ingest_consent_revoked_at")
      .eq("ingest_address", wanted)
      .maybeSingle<UserRow>();

    if (error) {
      throw new Error(`findUserByIngestAddress failed: ${error.message}`);
    }
    if (!data || !data.ingest_address) return null;

    // A user who has revoked consent is treated as absent: revocation must
    // stop ingestion immediately, per the PRD's privacy requirements.
    if (data.ingest_consent_revoked_at !== null) return null;

    return {
      id: data.id,
      email: data.email,
      ingestAddress: data.ingest_address,
      ingestConsentAt: data.ingest_consent_at
        ? new Date(data.ingest_consent_at)
        : null,
      ingestConsentRevokedAt: null,
    };
  }

  async saveRawDocument(
    doc: RawReturnDocument,
    storageKey: string,
  ): Promise<string> {
    const { data, error } = await this.client
      .from("raw_documents")
      .insert({
        user_id: doc.userId,
        source: doc.source,
        received_at: doc.receivedAt.toISOString(),
        sender_domain: doc.senderDomain,
        subject: doc.subject,
        raw_storage_key: storageKey,
        retention_expires_at: new Date(
          doc.receivedAt.getTime() + RETENTION_DAYS * MS_PER_DAY,
        ).toISOString(),
      })
      .select("id")
      .single<{ id: string }>();

    if (error) throw new Error(`saveRawDocument failed: ${error.message}`);
    return data.id;
  }

  async appendEvent(event: EventInput): Promise<void> {
    const { error } = await this.client.from("events").insert({
      actor_type: event.actorType,
      actor_id: event.actorId,
      entity_type: event.entityType,
      entity_id: event.entityId,
      type: event.type,
      payload: event.payload ?? null,
    });

    if (error) throw new Error(`appendEvent failed: ${error.message}`);
  }

  /**
   * Deletes every raw document whose retention has expired, returning the
   * storage keys the deleted rows referenced.
   *
   * The delete returns the rows it removed in the same statement, so there is
   * no read-then-delete window in which a row could be inserted or updated
   * between the two and have its key go unclaimed.
   */
  async deleteExpiredDocuments(now: Date): Promise<DeletedDocuments> {
    const { data, error } = await this.client
      .from("raw_documents")
      .delete()
      .lte("retention_expires_at", now.toISOString())
      .select("raw_storage_key")
      .returns<{ raw_storage_key: string }[]>();

    if (error) {
      throw new Error(`deleteExpiredDocuments failed: ${error.message}`);
    }

    const rows = data ?? [];
    return {
      deletedCount: rows.length,
      storageKeys: rows.map((row) => row.raw_storage_key),
    };
  }
}
