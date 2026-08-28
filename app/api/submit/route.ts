import { NextRequest, NextResponse } from "next/server";
import { createPickupRequest, PickupRequest } from "@/lib/airtable";
import { sendConfirmationEmail } from "@/lib/email";
import { trackServerEvent } from "@/lib/analytics";

const VALID_ITEM_SIZES = ["letter", "large-letter", "small-parcel", "medium-parcel"];
const VALID_PICKUP_WINDOWS = ["tomorrow", "weekend", "next-week"];
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PARCEL_COUNT = 20;

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      "name", "email", "phone", "postcode", "address",
      "itemSize", "parcelCount", "pickupWindow", "quoteMin", "quoteMax",
    ];

    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined || body[field] === null || body[field] === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Type + format validation
    const errors: string[] = [];

    if (typeof body.name !== "string" || body.name.trim().length < 1) {
      errors.push("Name must be a non-empty string");
    }

    if (typeof body.email !== "string" || !EMAIL_REGEX.test(body.email)) {
      errors.push("Invalid email address");
    }

    if (typeof body.phone !== "string" || body.phone.trim().length < 5) {
      errors.push("Phone number must be at least 5 characters");
    }

    if (typeof body.postcode !== "string" || !UK_POSTCODE_REGEX.test(body.postcode)) {
      errors.push("Invalid UK postcode format");
    }

    if (typeof body.address !== "string" || body.address.trim().length < 3) {
      errors.push("Address must be at least 3 characters");
    }

    if (!VALID_ITEM_SIZES.includes(body.itemSize as string)) {
      errors.push(`Invalid item size. Must be one of: ${VALID_ITEM_SIZES.join(", ")}`);
    }

    if (typeof body.parcelCount !== "number" || body.parcelCount < 1 || body.parcelCount > MAX_PARCEL_COUNT) {
      errors.push(`Parcel count must be between 1 and ${MAX_PARCEL_COUNT}`);
    }

    if (!VALID_PICKUP_WINDOWS.includes(body.pickupWindow as string)) {
      errors.push(`Invalid pickup window. Must be one of: ${VALID_PICKUP_WINDOWS.join(", ")}`);
    }

    if (typeof body.quoteMin !== "number" || body.quoteMin < 0) {
      errors.push("Quote minimum must be a positive number");
    }

    if (typeof body.quoteMax !== "number" || body.quoteMax < 0) {
      errors.push("Quote maximum must be a positive number");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // Build the pickup request
    const pickupRequest: PickupRequest = {
      name: (body.name as string).trim(),
      email: (body.email as string).trim().toLowerCase(),
      phone: (body.phone as string).trim(),
      postcode: (body.postcode as string).toUpperCase().trim(),
      address: (body.address as string).trim(),
      itemSize: body.itemSize as PickupRequest["itemSize"],
      parcelCount: body.parcelCount as number,
      pickupWindow: body.pickupWindow as PickupRequest["pickupWindow"],
      needsPrinting: Boolean(body.needsPrinting),
      labelStorageKey: (body.labelStorageKey as string) || undefined,
      quoteMin: body.quoteMin as number,
      quoteMax: body.quoteMax as number,
      wouldPay: body.wouldPay === true ? true : body.wouldPay === false ? false : null,
    };

    // Save to Airtable (or log in demo mode)
    const result = await createPickupRequest(pickupRequest);

    // Log for ops awareness
    console.log("📦 New pickup request:", {
      id: result.id,
      name: pickupRequest.name,
      email: pickupRequest.email,
      postcode: pickupRequest.postcode,
      itemSize: pickupRequest.itemSize,
      parcelCount: pickupRequest.parcelCount,
      pickupWindow: pickupRequest.pickupWindow,
      quoteRange: `£${pickupRequest.quoteMin.toFixed(2)} – £${pickupRequest.quoteMax.toFixed(2)}`,
      wouldPay: pickupRequest.wouldPay,
      timestamp: new Date().toISOString(),
    });

    // Send confirmation email (non-blocking — email failure must NOT fail the submission)
    sendConfirmationEmail({
      name: pickupRequest.name,
      email: pickupRequest.email,
      postcode: pickupRequest.postcode,
      address: pickupRequest.address,
      itemSize: pickupRequest.itemSize,
      parcelCount: pickupRequest.parcelCount,
      pickupWindow: pickupRequest.pickupWindow,
      needsPrinting: pickupRequest.needsPrinting,
      quoteMin: pickupRequest.quoteMin,
      quoteMax: pickupRequest.quoteMax,
    })
      .then((emailResult) => {
        trackServerEvent("confirmation_email_sent", {
          success: emailResult.success,
          emailId: emailResult.id,
        });
      })
      .catch((error) => {
        console.error("📧 Email send failed (non-blocking):", error);
        trackServerEvent("confirmation_email_sent", { success: false });
      });

    return NextResponse.json({
      success: true,
      id: result.id,
      message: "Pickup request received! We'll be in touch within 2 hours.",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
