export interface UnwrappedEmail {
  senderDomain: string;
  subject: string | null;
  body: string;
}

// Gmail, Outlook and Apple Mail all emit some variant of a dashed
// "Forwarded message" banner followed by RFC-822-style headers.
const FORWARD_BANNER = /^-{2,}\s*(?:Forwarded message|Original Message)\s*-{2,}\s*$/im;

const FROM_HEADER = /^From:\s*(?:"?[^"<\n]*"?\s*)?<?([^\s<>@]+@([^\s<>]+?))>?\s*$/im;
const SUBJECT_HEADER = /^Subject:\s*(.+)$/im;

// The header block ends at the first blank line.
const HEADER_BLOCK_END = /\n\s*\n/;

/**
 * Recover the original sender and subject from a forwarded email.
 *
 * A forwarded email's envelope sender is whoever forwarded it, so the
 * retailer must be read from the embedded header block instead. Returns the
 * inputs unchanged when the body is not a forward.
 */
export function unwrapForwarded(
  senderDomain: string,
  body: string,
): UnwrappedEmail {
  const banner = FORWARD_BANNER.exec(body);
  if (!banner) return { senderDomain, subject: null, body };

  const afterBanner = body.slice(banner.index + banner[0].length);
  const split = HEADER_BLOCK_END.exec(afterBanner);

  // Without a blank line there is no header block to read.
  if (!split) return { senderDomain, subject: null, body };

  const headers = afterBanner.slice(0, split.index);
  const rest = afterBanner.slice(split.index + split[0].length);

  const from = FROM_HEADER.exec(headers);
  const subject = SUBJECT_HEADER.exec(headers);

  return {
    senderDomain: from ? from[2].toLowerCase() : senderDomain,
    subject: subject ? subject[1].trim() : null,
    body: rest.trim(),
  };
}
