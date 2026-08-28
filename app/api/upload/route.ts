import { NextRequest, NextResponse } from "next/server";
import { MAX_FILE_SIZE, VALID_MIME_TYPES, resolveExtension } from "@/lib/label-file";
import { isLabelStorageConfigured, uploadLabel } from "@/lib/storage";

/**
 * Until accounts exist, every label lands under one owner prefix. Replace with
 * the authenticated user id the moment auth ships — the key layout already
 * expects it.
 */
const ANONYMOUS_OWNER = "anonymous";

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid form data. Please send a multipart form with a file field." },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please include a 'file' field." },
        { status: 400 }
      );
    }

    if (!VALID_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Accepted formats: PDF, JPEG, PNG, WebP.",
          received: file.type,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`,
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "File is empty. Please upload a valid file." },
        { status: 400 }
      );
    }

    // Demo mode when Supabase Storage is not configured
    if (!isLabelStorageConfigured()) {
      console.log("📎 Label upload (demo mode):", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)}KB`,
        timestamp: new Date().toISOString(),
      });

      const extension = resolveExtension(file.name, file.type);
      return NextResponse.json({
        storageKey: `demo/return-label-${Date.now()}.${extension}`,
      });
    }

    // Upload to the private Supabase bucket. Only the object key comes back:
    // a label carries the user's home address, so no durable URL is minted.
    let storageKey: string;
    try {
      ({ storageKey } = await uploadLabel(file, ANONYMOUS_OWNER));
    } catch (error) {
      console.error("Label upload failed:", {
        error: error instanceof Error ? error.message : String(error),
        fileName: file.name,
      });
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 502 }
      );
    }

    // Never log the key alongside anything that identifies the user.
    console.log("📎 Label uploaded:", {
      size: `${(file.size / 1024).toFixed(1)}KB`,
      type: file.type,
    });

    return NextResponse.json({ storageKey });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed unexpectedly. Please try again." },
      { status: 500 }
    );
  }
}
