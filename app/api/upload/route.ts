import { NextRequest, NextResponse } from "next/server";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or image." },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // If Cloudinary is not configured, return a demo response
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.log("Cloudinary not configured. Demo mode enabled.");
      return NextResponse.json({
        url: `demo://return-label-${Date.now()}`,
        publicId: `demo-${Date.now()}`,
        format: file.type.split("/")[1],
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
      const error = await response.text();
      console.error("Cloudinary error:", error);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
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
