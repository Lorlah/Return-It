import { NextRequest, NextResponse } from "next/server";
import { createPickupRequest, PickupRequest } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "postcode",
      "address",
      "itemSize",
      "parcelCount",
      "pickupWindow",
      "quoteMin",
      "quoteMax",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate UK postcode format
    const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
    if (!postcodeRegex.test(body.postcode)) {
      return NextResponse.json(
        { error: "Invalid UK postcode" },
        { status: 400 }
      );
    }

    // Create the pickup request
    const pickupRequest: PickupRequest = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      postcode: body.postcode.toUpperCase(),
      address: body.address,
      itemSize: body.itemSize,
      parcelCount: body.parcelCount,
      pickupWindow: body.pickupWindow,
      needsPrinting: body.needsPrinting || false,
      labelUrl: body.fileUrl || undefined,
      quoteMin: body.quoteMin,
      quoteMax: body.quoteMax,
      wouldPay: body.wouldPay,
    };

    // Save to Airtable (or log in demo mode)
    const result = await createPickupRequest(pickupRequest);

    // Log the submission for ops awareness
    console.log("New pickup request:", {
      id: result.id,
      name: pickupRequest.name,
      email: pickupRequest.email,
      postcode: pickupRequest.postcode,
      itemSize: pickupRequest.itemSize,
      parcelCount: pickupRequest.parcelCount,
      pickupWindow: pickupRequest.pickupWindow,
      quoteRange: `£${pickupRequest.quoteMin.toFixed(2)} - £${pickupRequest.quoteMax.toFixed(2)}`,
      wouldPay: pickupRequest.wouldPay,
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
