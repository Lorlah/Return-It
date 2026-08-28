/**
 * Pure helpers describing what counts as an acceptable label file.
 *
 * Deliberately free of environment access and of any storage client, so the
 * browser form and the server route can share one definition of "valid"
 * without the client bundle pulling in a service-role Supabase client.
 */

// ── Accepted files ──────────────────────────────────────────────────────────

export const VALID_MIME_TYPES: ReadonlySet<string> = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function isValidFileType(file: File): boolean {
  return VALID_MIME_TYPES.has(file.type);
}

// ── Display ─────────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Extensions ──────────────────────────────────────────────────────────────

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const KNOWN_EXTENSIONS: ReadonlySet<string> = new Set([
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

/** Fallback used when neither the file name nor the MIME type tells us more. */
export const FALLBACK_EXTENSION = "bin";

/**
 * Extension for a stored object, lowercase and without a dot.
 *
 * The uploaded file name wins when it ends in an extension we accept; the MIME
 * type is the fallback. Anything else becomes `bin`, so no user-chosen text
 * ever reaches a storage key.
 */
export function resolveExtension(
  fileName: string | undefined,
  contentType: string | undefined,
): string {
  const parts = fileName?.toLowerCase().split(".") ?? [];
  const fromName = parts.length > 1 ? parts[parts.length - 1] : "";
  if (KNOWN_EXTENSIONS.has(fromName)) return fromName;

  const fromType = contentType
    ? EXTENSION_BY_MIME_TYPE[contentType.toLowerCase()]
    : undefined;

  return fromType ?? FALLBACK_EXTENSION;
}
