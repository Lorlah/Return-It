export type IngestionSource = "forward" | "upload" | "outlook" | "gmail";

export type LabelType = "pdf" | "qr" | "link" | "none";

export interface Attachment {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string;
}

// ── Ingestion Input ─────────────────────────────────────────────────────────

/** The choke point every ingestion adapter narrows to. */
export interface RawReturnDocument {
  userId: string;
  source: IngestionSource;
  receivedAt: Date;
  senderDomain: string;
  subject: string;
  body: string;
  attachments: Attachment[];
}

// ── Parser Output ───────────────────────────────────────────────────────────

export interface DetectedReturn {
  retailer: string | null;
  retailerDisplayName: string | null;
  orderRef: string | null;
  returnId: string | null;
  deadline: Date | null;
  deadlineConfidence: number;
  carrier: string | null;
  labelType: LabelType;
  itemDescription: string | null;
  confidence: number;
  needsReview: boolean;
}

/** Baseline result. Extractors overlay onto this. */
export const EMPTY_DETECTED_RETURN: DetectedReturn = {
  retailer: null,
  retailerDisplayName: null,
  orderRef: null,
  returnId: null,
  deadline: null,
  deadlineConfidence: 0,
  carrier: null,
  labelType: "none",
  itemDescription: null,
  confidence: 0,
  needsReview: true,
};
