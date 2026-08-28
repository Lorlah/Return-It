import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/ingest/supabase-repository";
import { resolveExtension } from "@/lib/label-file";

/**
 * Return-label storage.
 *
 * A return label carries the user's full home address, so a label file is
 * personal data of the most locatable kind. It therefore lives in a PRIVATE
 * Supabase bucket and is only ever referenced by its object key. No public URL
 * is minted, stored, or logged anywhere — see F-1 in docs/compliance-register.md.
 */

// ── Configuration ───────────────────────────────────────────────────────────

export const LABEL_BUCKET = "return-labels";

/**
 * Default signed-URL lifetime, in seconds.
 *
 * Five minutes is long enough to open or print a label and short enough that a
 * leaked link — forwarded in an email, captured in a proxy log, pasted into a
 * support ticket — is dead by the time anyone else reaches it. The permanence
 * of the old Cloudinary URLs was the whole finding; a short TTL is the control
 * that replaces it, so raise this only with a reason.
 */
export const DEFAULT_SIGNED_URL_TTL_SECONDS = 300;

const DEFAULT_CONTENT_TYPE = "application/octet-stream";

// ── Storage seam ────────────────────────────────────────────────────────────

/** What this module needs from a bucket. Narrow on purpose, so it can be faked. */
export interface LabelStorageBucket {
  upload(path: string, body: File | Buffer, contentType: string): Promise<void>;
  createSignedUrl(path: string, expiresInSeconds: number): Promise<string>;
  remove(path: string): Promise<void>;
}

/**
 * Adapts the Supabase client's bucket API to the seam above, turning its
 * `{ data, error }` results into thrown errors at a single point.
 */
export function supabaseLabelBucket(client: SupabaseClient): LabelStorageBucket {
  const bucket = client.storage.from(LABEL_BUCKET);

  return {
    async upload(path, body, contentType) {
      const { error } = await bucket.upload(path, body, {
        contentType,
        upsert: false,
      });
      if (error) throw new Error(`Label upload failed: ${error.message}`);
    },

    async createSignedUrl(path, expiresInSeconds) {
      const { data, error } = await bucket.createSignedUrl(path, expiresInSeconds);
      if (error) throw new Error(`Signed label URL failed: ${error.message}`);
      if (!data) throw new Error("Signed label URL failed: no URL returned");
      return data.signedUrl;
    },

    async remove(path) {
      const { error } = await bucket.remove([path]);
      if (error) throw new Error(`Label deletion failed: ${error.message}`);
    },
  };
}

function defaultBucket(): LabelStorageBucket {
  return supabaseLabelBucket(createServiceClient());
}

/** Whether the server is configured to store labels for real. */
export function isLabelStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

// ── Keys ────────────────────────────────────────────────────────────────────

/**
 * Builds the object key for a label: `<userId>/<uuid>.<ext>`.
 *
 * The user prefix keeps one user's labels enumerable as a group (needed for
 * erasure) while the random name keeps them unguessable. Neither the original
 * file name nor anything else user-supplied reaches the key.
 */
export function buildLabelStorageKey(userId: string, extension: string): string {
  const owner = userId.trim();
  if (!owner || owner.includes("/") || owner.includes("..")) {
    throw new Error("Invalid userId for a label storage key");
  }
  return `${owner}/${crypto.randomUUID()}.${extension}`;
}

// ── Operations ──────────────────────────────────────────────────────────────

export interface UploadLabelOptions {
  /** Only used to derive the stored extension. Required for `Buffer` input. */
  fileName?: string;
  contentType?: string;
  /** Injectable for tests; defaults to the service-role Supabase bucket. */
  bucket?: LabelStorageBucket;
}

/**
 * Uploads a label to the private bucket and returns its object key.
 *
 * Returns the key and nothing else — callers must not be handed a URL they
 * could persist, because a persisted URL is exactly the failure being fixed.
 */
export async function uploadLabel(
  file: File | Buffer,
  userId: string,
  options: UploadLabelOptions = {},
): Promise<{ storageKey: string }> {
  const isFile = typeof File !== "undefined" && file instanceof File;
  const fileName = options.fileName ?? (isFile ? file.name : undefined);
  const contentType =
    options.contentType ?? (isFile ? file.type : undefined) ?? DEFAULT_CONTENT_TYPE;

  const storageKey = buildLabelStorageKey(
    userId,
    resolveExtension(fileName, contentType),
  );

  const bucket = options.bucket ?? defaultBucket();
  await bucket.upload(storageKey, file, contentType);

  return { storageKey };
}

/**
 * Mints a short-lived signed URL for a stored label.
 *
 * Every read of a label goes through here, so revocation is real: stop issuing
 * URLs and access ends within `expiresInSeconds`.
 */
export async function createSignedLabelUrl(
  storageKey: string,
  expiresInSeconds: number = DEFAULT_SIGNED_URL_TTL_SECONDS,
  bucket: LabelStorageBucket = defaultBucket(),
): Promise<string> {
  if (!storageKey.trim()) {
    throw new Error("Cannot sign an empty label storage key");
  }
  return bucket.createSignedUrl(storageKey, expiresInSeconds);
}

/** Permanently deletes a stored label — the erasure right, and retention. */
export async function deleteLabel(
  storageKey: string,
  bucket: LabelStorageBucket = defaultBucket(),
): Promise<void> {
  if (!storageKey.trim()) {
    throw new Error("Cannot delete an empty label storage key");
  }
  await bucket.remove(storageKey);
}
