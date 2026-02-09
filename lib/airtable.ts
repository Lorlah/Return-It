import { ItemSize, PickupWindow } from "./pricing";

export interface PickupRequest {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
  itemSize: ItemSize;
  parcelCount: number;
  pickupWindow: PickupWindow;
  needsPrinting: boolean;
  labelUrl?: string;
  quoteMin: number;
  quoteMax: number;
  wouldPay: boolean | null;
}

interface AirtableRecord {
  fields: Record<string, unknown>;
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Pickup Requests";

export async function createPickupRequest(request: PickupRequest): Promise<{ id: string }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    // Demo mode: log the full request for manual processing
    console.log("📋 Pickup request (demo mode — Airtable not configured):", {
      ...request,
      timestamp: new Date().toISOString(),
    });
    return { id: `demo-${Date.now()}` };
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

  const record: AirtableRecord = {
    fields: {
      Name: request.name,
      Email: request.email,
      Phone: request.phone,
      Postcode: request.postcode,
      Address: request.address,
      "Item Size": formatItemSize(request.itemSize),
      "Parcel Count": request.parcelCount,
      "Pickup Window": formatPickupWindow(request.pickupWindow),
      "Needs Printing": request.needsPrinting,
      "Label URL": request.labelUrl || "",
      "Quote Min": request.quoteMin,
      "Quote Max": request.quoteMax,
      "Would Pay": request.wouldPay,
      "Bulk Discount": request.parcelCount >= 4,
      Status: "New",
      "Submitted At": new Date().toISOString(),
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [record] }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Airtable API error:", {
      status: response.status,
      error: errorText,
      postcode: request.postcode,
    });
    throw new Error(`Airtable error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const recordId = data.records?.[0]?.id ?? data.id;
  return { id: recordId };
}

function formatItemSize(size: ItemSize): string {
  const labels: Record<ItemSize, string> = {
    letter: "Letter",
    "large-letter": "Large Letter",
    "small-parcel": "Small Parcel",
    "medium-parcel": "Medium Parcel",
  };
  return labels[size];
}

function formatPickupWindow(window: PickupWindow): string {
  const labels: Record<PickupWindow, string> = {
    tomorrow: "Tomorrow",
    weekend: "Weekend",
    "next-week": "Next Week",
  };
  return labels[window];
}
