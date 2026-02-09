"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * PostHog analytics provider. Wraps the app to enable analytics tracking.
 *
 * When NEXT_PUBLIC_POSTHOG_KEY is not set, renders children without
 * initializing PostHog (graceful no-op for demo/development mode).
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "📊 PostHog not configured (no NEXT_PUBLIC_POSTHOG_KEY). Analytics disabled."
        );
      }
      return;
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      // Respect user privacy preferences
      respect_dnt: true,
      // Don't capture sensitive form data
      autocapture: {
        dom_event_allowlist: ["click"],
        element_allowlist: ["a", "button"],
      },
    });
  }, []);

  if (!POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
