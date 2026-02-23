import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { PickupConfirmationEmail } from "@/emails/PickupConfirmation";

/**
 * Email preview route — renders the pickup confirmation email as HTML.
 * Visit /return-it/api/email-preview to see the email in the browser.
 *
 * Only available in development mode.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const html = await render(
    PickupConfirmationEmail({
      name: "Sarah Johnson",
      email: "sarah@example.com",
      postcode: "SW1A 1AA",
      address: "10 Downing Street",
      itemSize: "small-parcel",
      parcelCount: 2,
      pickupWindow: "tomorrow",
      needsPrinting: true,
      quoteMin: 8.99,
      quoteMax: 10.99,
    })
  );

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
