import { EMPTY_DETECTED_RETURN } from "@/lib/parser/types";
import type { DetectedReturn, RawReturnDocument } from "@/lib/parser/types";
import { unwrapForwarded } from "@/lib/parser/forwarded";
import { identifyRetailer } from "@/lib/parser/retailers";
import { extractDeadline } from "@/lib/parser/deadline";
import {
  extractCarrier,
  extractOrderRef,
  extractReturnId,
} from "@/lib/parser/carrier";
import { detectLabel } from "@/lib/parser/label";
import { REVIEW_THRESHOLD, scoreConfidence } from "@/lib/parser/confidence";

export * from "@/lib/parser/types";
export { REVIEW_THRESHOLD } from "@/lib/parser/confidence";

/**
 * Turn a raw ingested document into a structured return.
 *
 * Pure: no I/O, no clock access. The current time, where needed, arrives as
 * `doc.receivedAt`. Never throws — an unparseable document returns a
 * low-confidence result flagged for review.
 */
export function parseReturnDocument(doc: RawReturnDocument): DetectedReturn {
  // A forwarded email's envelope sender is the forwarder, not the retailer,
  // so recover the original sender before identifying anything.
  const unwrapped = unwrapForwarded(doc.senderDomain, doc.body);
  const subject = unwrapped.subject ?? doc.subject;

  // Deadlines, carriers and references appear in either subject or body.
  // Both are searched: SHEIN names the carrier only in the subject line.
  const searchText = `${subject}\n${unwrapped.body}`;

  const retailer = identifyRetailer(unwrapped.senderDomain, searchText);
  const deadline = extractDeadline(searchText, doc.receivedAt);
  const carrier = extractCarrier(searchText);
  const orderRef = extractOrderRef(searchText);
  const returnId = extractReturnId(searchText);
  // Subject is searched too, not just body: carriers announce the label in
  // the subject line — a real InPost email reads "Your SHEIN return QR code
  // is ready" while its body only mentions a numeric "Send code".
  const labelType = detectLabel(searchText, doc.attachments);

  const confidence = scoreConfidence({
    hasRetailer: retailer !== null,
    hasDeadline: deadline !== null,
    deadlineConfidence: deadline?.confidence ?? 0,
    hasCarrier: carrier !== null,
    hasLabel: labelType !== "none",
    hasReference: orderRef !== null || returnId !== null,
  });

  return {
    ...EMPTY_DETECTED_RETURN,
    retailer: retailer?.slug ?? null,
    retailerDisplayName: retailer?.displayName ?? null,
    orderRef,
    returnId,
    deadline: deadline?.date ?? null,
    deadlineConfidence: deadline?.confidence ?? 0,
    carrier,
    labelType,
    confidence,
    needsReview: confidence < REVIEW_THRESHOLD,
  };
}
