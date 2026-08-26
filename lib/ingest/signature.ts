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
