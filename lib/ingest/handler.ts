import { parseReturnDocument } from "@/lib/parser";
import { parseIngestAddress } from "@/lib/ingest/address";
import { extractRecipientAddress, parseInboundPayload } from "@/lib/ingest/inbound";
import { verifyWebhookSignature } from "@/lib/ingest/signature";
import type { IngestRepository } from "@/lib/ingest/repository";

export type IngestOutcome =
  | { status: "accepted"; rawDocumentId: string; detectedReturn: ReturnType<typeof parseReturnDocument> }
  | { status: "rejected"; reason: IngestRejection };

export type IngestRejection =
  | "bad_signature"
  | "malformed_payload"
  | "unknown_recipient"
  | "unknown_user";

export interface IngestDeps {
  repository: IngestRepository;
  secret: string | null;
  /** Persists raw bytes and returns the storage key. */
  storeRawBytes: (rawBody: string) => Promise<string>;
}

/**
 * Handle one inbound forwarded email, end to end.
 *
 * Ordered so the cheapest and most security-critical check runs first: an
 * unsigned request is rejected before any parsing, storage or database work
 * happens. The inbound address is publicly reachable, so this endpoint is a
 * standing invitation to send us arbitrary bytes.
 *
 * Every rejection is deliberately indistinguishable in cost and shape from
 * the others, so the endpoint cannot be used to enumerate valid addresses.
 */
export async function handleInboundEmail(
  rawBody: string,
  signature: string | null,
  deps: IngestDeps,
): Promise<IngestOutcome> {
  if (!verifyWebhookSignature(rawBody, signature, deps.secret)) {
    return { status: "rejected", reason: "bad_signature" };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { status: "rejected", reason: "malformed_payload" };
  }

  const recipient = extractRecipientAddress(payload);
  if (!recipient || !parseIngestAddress(recipient)) {
    return { status: "rejected", reason: "unknown_recipient" };
  }

  const user = await deps.repository.findUserByIngestAddress(recipient);
  if (!user) {
    // Also the path for a user who has revoked consent — the repository
    // treats them as absent, so ingestion stops immediately.
    return { status: "rejected", reason: "unknown_user" };
  }

  const doc = parseInboundPayload(payload, user.id);
  if (!doc) return { status: "rejected", reason: "malformed_payload" };

  const storageKey = await deps.storeRawBytes(rawBody);
  const rawDocumentId = await deps.repository.saveRawDocument(doc, storageKey);

  const detectedReturn = parseReturnDocument(doc);

  await deps.repository.appendEvent({
    actorType: "system",
    actorId: null,
    entityType: "raw_document",
    entityId: rawDocumentId,
    type: "ingested",
    payload: {
      source: doc.source,
      senderDomain: doc.senderDomain,
      retailer: detectedReturn.retailer,
      confidence: detectedReturn.confidence,
      needsReview: detectedReturn.needsReview,
    },
  });

  return { status: "accepted", rawDocumentId, detectedReturn };
}
