import posthog from "posthog-js";

// ── Event Types ─────────────────────────────────────────────────────────────

/**
 * Typed analytics events for the Return-It funnel.
 *
 * CRITICAL: No PII (email, name, phone, address) in any event properties.
 * Only behavioral data + zone/size/count.
 */
export type AnalyticsEvent =
  | { event: "landing_cta_clicked"; properties: { size_selected: string } }
  | { event: "form_started"; properties: { source: "landing" | "direct" } }
  | {
      event: "form_step_completed";
      properties: {
        step: 1 | 2 | 3;
        item_size?: string;
        parcel_count?: number;
      };
    }
  | { event: "form_step_back"; properties: { from_step: number; to_step: number } }
  | {
      event: "quote_viewed";
      properties: {
        quote_min: number;
        quote_max: number;
        zone: string;
        has_bulk_discount: boolean;
      };
    }
  | {
      event: "willingness_survey_responded";
      properties: { would_pay: boolean };
    }
  | {
      event: "pickup_confirmed";
      properties: {
        zone: string;
        item_size: string;
        parcel_count: number;
        needs_printing: boolean;
      };
    };

// ── Track Function ──────────────────────────────────────────────────────────

/**
 * Track an analytics event. Sends to PostHog if configured, otherwise no-op.
 *
 * Usage:
 *   trackEvent({ event: "landing_cta_clicked", properties: { size_selected: "small-parcel" } });
 */
export function trackEvent({ event, properties }: AnalyticsEvent): void {
  try {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture(event, properties);
    }
  } catch {
    // Analytics should never break the app
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 Analytics event: ${event}`, properties);
    }
  }
}

// ── Server-Side Event (for API routes) ──────────────────────────────────────

/**
 * Log a server-side analytics event. These are logged to console and can be
 * picked up by log aggregation services. PostHog server-side SDK is not used
 * in the MVP to keep dependencies minimal.
 */
export function trackServerEvent(
  event: string,
  properties: Record<string, unknown>
): void {
  console.log(`📊 [server] ${event}:`, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}
