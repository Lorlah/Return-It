import { NextRequest, NextResponse } from "next/server";
import { runRetentionSweep } from "@/lib/ingest/retention";
import { verifyBearerToken } from "@/lib/ingest/signature";
import {
  SupabaseIngestRepository,
  createServiceClient,
} from "@/lib/ingest/supabase-repository";
import { deleteLabel } from "@/lib/storage";

/**
 * Scheduled enforcement of the 90-day retention policy — F-3.
 *
 * POST only, and only with a bearer token matching `CRON_SECRET`. This
 * endpoint deletes data, so it fails closed when the secret is unset: an
 * unconfigured deployment must never expose an open deletion trigger.
 */
export async function POST(request: NextRequest) {
  if (
    !verifyBearerToken(
      request.headers.get("authorization"),
      process.env.CRON_SECRET ?? null,
    )
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repository = new SupabaseIngestRepository(createServiceClient());

    // The storage remover is chosen here, not inside the sweep, so the sweep
    // itself stays injectable and testable with no bucket in sight.
    const result = await runRetentionSweep({
      repository,
      deleteObject: (key) => deleteLabel(key),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Retention sweep failed:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Retention sweep failed." },
      { status: 500 },
    );
  }
}
