import { Resend } from "resend";

// ── Resend Client ───────────────────────────────────────────────────────────

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Return-It <hello@return-it.co.uk>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Whether email sending is configured (has API key).
 * When false, emails log to console (demo mode).
 */
export const isEmailConfigured = !!resend;

// ── Types ───────────────────────────────────────────────────────────────────

export interface PickupConfirmationData {
  name: string;
  email: string;
  postcode: string;
  address: string;
  itemSize: string;
  parcelCount: number;
  pickupWindow: string;
  needsPrinting: boolean;
  quoteMin: number;
  quoteMax: number;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ── Send Functions ──────────────────────────────────────────────────────────

/**
 * Send a pickup confirmation email.
 *
 * Non-blocking by design: call this with await but catch errors gracefully.
 * Email failure should NEVER prevent the form submission from succeeding.
 */
export async function sendConfirmationEmail(
  data: PickupConfirmationData
): Promise<SendEmailResult> {
  if (!resend) {
    // Demo mode: log the email details
    console.log("📧 Confirmation email (demo mode — Resend not configured):", {
      to: data.email,
      name: data.name,
      postcode: data.postcode,
      itemSize: data.itemSize,
      parcelCount: data.parcelCount,
      pickupWindow: data.pickupWindow,
      needsPrinting: data.needsPrinting,
      quoteRange: `£${data.quoteMin.toFixed(2)} – £${data.quoteMax.toFixed(2)}`,
      timestamp: new Date().toISOString(),
    });
    return { success: true, id: `demo-email-${Date.now()}` };
  }

  try {
    // Import the email template dynamically to avoid loading React Email
    // components unless we actually need to send
    const { PickupConfirmationEmail } = await import(
      "@/emails/PickupConfirmation"
    );
    const { render } = await import("@react-email/components");

    const html = await render(PickupConfirmationEmail(data));

    const { data: result, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: `Your Return-It pickup request — ${formatItemSize(data.itemSize)}`,
      html,
    });

    if (error) {
      console.error("📧 Resend API error:", error);
      return { success: false, error: error.message };
    }

    console.log("📧 Confirmation email sent:", {
      id: result?.id,
      to: data.email,
      timestamp: new Date().toISOString(),
    });

    return { success: true, id: result?.id };
  } catch (error) {
    console.error("📧 Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatItemSize(size: string): string {
  const labels: Record<string, string> = {
    letter: "Letter",
    "large-letter": "Large Letter",
    "small-parcel": "Small Parcel",
    "medium-parcel": "Medium Parcel",
  };
  return labels[size] || size;
}
