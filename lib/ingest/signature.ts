import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify an inbound webhook's HMAC-SHA256 signature.
 *
 * Fails closed in every ambiguous case, including a missing secret: the
 * inbound address is publicly reachable, so an unconfigured secret must
 * never be read as "accept everything".
 *
 * Comparison is timing-safe.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string | null,
): boolean {
  if (!secret || !signature) return false;

  const provided = signature.startsWith("sha256=")
    ? signature.slice("sha256=".length)
    : signature;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  // timingSafeEqual throws on length mismatch, so check first.
  if (provided.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(provided, "hex"), Buffer.from(expected, "hex"));
  } catch {
    // Non-hex input reaches here.
    return false;
  }
}

/**
 * Verify an `Authorization: Bearer <token>` header against a shared secret.
 *
 * Same posture as the signature check above: fails closed on a missing secret.
 * The endpoint this guards deletes data, so an unset `CRON_SECRET` reading as
 * "anyone may sweep" would be strictly worse than an unguarded read endpoint.
 *
 * Comparison is timing-safe.
 */
export function verifyBearerToken(
  header: string | null,
  secret: string | null,
): boolean {
  if (!secret || !header) return false;

  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return false;

  const provided = Buffer.from(match[1], "utf8");
  const expected = Buffer.from(secret, "utf8");

  // timingSafeEqual throws on length mismatch, so check first.
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
