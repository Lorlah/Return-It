import type { Attachment, RawReturnDocument } from "@/lib/parser/types";

export interface InboundEmailPayload {
  to?: unknown;
  from?: unknown;
  subject?: unknown;
  text?: unknown;
  html?: unknown;
  receivedAt?: unknown;
  attachments?: unknown;
}

// ── Guards ──────────────────────────────────────────────────────────────────

// Everything arriving here is attacker-controlled: the inbound address is
// publicly reachable, so shape is validated before any field is trusted.

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

// ── Address handling ────────────────────────────────────────────────────────

const ANGLE_ADDRESS = /<([^<>@\s]+@[^<>\s]+)>/;
const BARE_ADDRESS = /([^<>@\s,]+@[^<>\s,]+)/;

/** Pull a plain email address out of a header value. */
function firstAddress(header: string): string | null {
  const angled = ANGLE_ADDRESS.exec(header);
  if (angled) return angled[1].trim();

  const bare = BARE_ADDRESS.exec(header);
  return bare ? bare[1].trim() : null;
}

/** The address the mail was sent TO — identifies which user owns it. */
export function extractRecipientAddress(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const to = asString(payload.to);
  return to ? firstAddress(to) : null;
}

function senderDomain(from: string): string | null {
  const address = firstAddress(from);
  if (!address) return null;
  const at = address.lastIndexOf("@");
  return at === -1 ? null : address.slice(at + 1).toLowerCase();
}

// ── Body handling ───────────────────────────────────────────────────────────

/**
 * Reduce an HTML body to readable text.
 *
 * Deliberately crude — the parser works on prose, not markup, and pulling in
 * a full HTML parser for this would be a runtime dependency we don't need.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

// ── Attachments ─────────────────────────────────────────────────────────────

function toAttachments(raw: unknown): Attachment[] {
  if (!Array.isArray(raw)) return [];

  const out: Attachment[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const filename = asString(item.filename) ?? asString(item.name);
    const mimeType = asString(item.contentType) ?? asString(item.mimeType);
    if (!filename || !mimeType) continue;
    out.push({
      filename,
      mimeType: mimeType.toLowerCase(),
      sizeBytes: typeof item.size === "number" ? item.size : 0,
    });
  }
  return out;
}

// ── Entry point ─────────────────────────────────────────────────────────────

/**
 * Turn an inbound-email webhook payload into a `RawReturnDocument`.
 *
 * Returns null rather than throwing when the payload is unusable — a
 * malformed inbound email is an expected event, not an exceptional one.
 */
export function parseInboundPayload(
  payload: unknown,
  userId: string,
): RawReturnDocument | null {
  if (!isRecord(payload)) return null;

  const from = asString(payload.from);
  if (!from) return null;

  const domain = senderDomain(from);
  if (!domain) return null;

  const text = asString(payload.text);
  const html = asString(payload.html);
  const body = text ?? (html ? htmlToText(html) : null);
  if (!body) return null;

  const receivedRaw = asString(payload.receivedAt);
  const received = receivedRaw ? new Date(receivedRaw) : new Date();

  return {
    userId,
    source: "forward",
    receivedAt: Number.isNaN(received.getTime()) ? new Date() : received,
    senderDomain: domain,
    subject: asString(payload.subject) ?? "",
    body,
    attachments: toAttachments(payload.attachments),
  };
}
