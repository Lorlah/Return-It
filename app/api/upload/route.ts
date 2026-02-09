import { NextRequest, NextResponse } from "next/server";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const VALID_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    // Demo mode when Cloudinary is not configured
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.log("📎 Label upload (demo mode):", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)}KB`,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        url: `demo://return-label-${Date.now()}`,
        publicId: `demo-${Date.now()}`,
        format: file.type.split("/")[1] || "unknown",
      });
    }

    // Upload to Cloudinary
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("api_key", CLOUDINARY_API_KEY);
    cloudinaryFormData.append("timestamp", timestamp.toString());
    cloudinaryFormData.append("signature", signature);
    cloudinaryFormData.append("folder", "return-it/labels");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", {
        status: response.status,
        error: errorText,
        fileName: file.name,
      });
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();

    console.log("📎 Label uploaded:", {
      publicId: data.public_id,
      format: data.format,
      size: `${(file.size / 1024).toFixed(1)}KB`,
    });

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed unexpectedly. Please try again." },
      { status: 500 }
    );
  }
}

async function generateSignature(timestamp: number): Promise<string> {
  const str = `folder=return-it/labels&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  
  // Use Web Crypto API for signature
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  
  return hashHex;
}
