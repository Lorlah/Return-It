import type { Attachment, LabelType } from "@/lib/parser/types";

const QR_MENTION = /\bqr\s*(?:code)?\b/i;
// No trailing \b: real return URLs pluralise and suffix the keyword
// ("returns.example.com", "/labels/…"), so only the leading boundary is
// required.
const LABEL_LINK = /https?:\/\/\S*\b(?:label|return|rma)\S*/i;
const LABEL_FILENAME = /\b(?:label|return|rma|qr)\b/i;

/**
 * Determine what kind of return label the document carries.
 *
 * Precedence is by usefulness to the user: a PDF they can print beats a QR
 * they must display, which beats a link they must follow.
 */
export function detectLabel(
  body: string,
  attachments: Attachment[],
): LabelType {
  if (attachments.some((a) => a.mimeType === "application/pdf")) {
    return "pdf";
  }

  const hasQrMention = QR_MENTION.test(body);

  // An image attachment only counts as a label if the body mentions a QR
  // code or the filename says so — otherwise it is a logo or a banner.
  const hasLabelImage = attachments.some(
    (a) =>
      a.mimeType.startsWith("image/") &&
      (hasQrMention || LABEL_FILENAME.test(a.filename)),
  );

  if (hasLabelImage || hasQrMention) return "qr";
  if (LABEL_LINK.test(body)) return "link";

  return "none";
}
