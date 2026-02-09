import { Hr, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/Layout";

/**
 * Pickup Confirmation Email
 *
 * Sent immediately after a user confirms their pickup request.
 * See BRAND-KIT.md §4 for design specs and tone guidelines.
 *
 * NOTE: This is a baseline template. Gemini (Task 06) will refine
 * the visual design, making it more branded and polished.
 */

interface PickupConfirmationProps {
  name: string;
  email?: string;
  postcode: string;
  address: string;
  itemSize: string;
  parcelCount: number;
  pickupWindow: string;
  needsPrinting: boolean;
  quoteMin: number;
  quoteMax: number;
}

export function PickupConfirmationEmail({
  name,
  postcode,
  itemSize,
  parcelCount,
  pickupWindow,
  needsPrinting,
  quoteMin,
  quoteMax,
}: PickupConfirmationProps) {
  const firstName = name.split(" ")[0];

  return (
    <EmailLayout
      preview={`Your Return-It pickup request is confirmed — ${formatItemSize(itemSize)}, ${formatPickupWindow(pickupWindow)}`}
    >
      {/* Greeting */}
      <Text style={greeting}>Hey {firstName},</Text>
      <Text style={bodyText}>
        We&apos;ve received your pickup request. Here&apos;s a summary of
        what we&apos;ll be collecting:
      </Text>

      {/* Pickup Summary Card */}
      <Section style={summaryCard}>
        <Text style={summaryTitle}>Pickup Summary</Text>

        <table style={summaryTable} cellPadding={0} cellSpacing={0}>
          <tbody>
            <SummaryRow label="Item size" value={formatItemSize(itemSize)} />
            <SummaryRow
              label="Parcels"
              value={parcelCount === 1 ? "1 parcel" : `${parcelCount} parcels`}
            />
            <SummaryRow label="Postcode" value={postcode.toUpperCase()} />
            <SummaryRow
              label="Pickup window"
              value={formatPickupWindow(pickupWindow)}
            />
            <SummaryRow
              label="Label printing"
              value={needsPrinting ? "Yes — we'll print it" : "No — I have it"}
            />
          </tbody>
        </table>

        <Hr style={summaryDivider} />

        <Text style={priceText}>
          Estimated price: £{quoteMin.toFixed(2)} – £{quoteMax.toFixed(2)}
        </Text>
        <Text style={priceNote}>
          Final price confirmed before collection. No payment required now.
        </Text>
      </Section>

      {/* What happens next */}
      <Text style={sectionHeading}>What happens next</Text>

      <table style={stepsTable} cellPadding={0} cellSpacing={0}>
        <tbody>
          <StepRow number="1" text="We'll text you within 2 hours to confirm your slot" />
          <StepRow number="2" text="Our courier will call 30 minutes before arrival" />
          <StepRow number="3" text="You'll receive proof of collection via text" />
        </tbody>
      </table>

      {/* CTA */}
      <Section style={ctaContainer}>
        <Link href="https://return-it.co.uk/return-it" style={ctaButton}>
          View your request
        </Link>
      </Section>
    </EmailLayout>
  );
}

// ── Sub-Components ──────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={summaryLabel}>{label}</td>
      <td style={summaryValue}>{value}</td>
    </tr>
  );
}

function StepRow({ number, text }: { number: string; text: string }) {
  return (
    <tr>
      <td style={stepNumber}>{number}</td>
      <td style={stepText}>{text}</td>
    </tr>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatItemSize(size: string): string {
  const labels: Record<string, string> = {
    letter: "Letter",
    "large-letter": "Large Letter",
    "small-parcel": "Small Parcel",
    "medium-parcel": "Medium Parcel",
  };
  return labels[size] || size;
}

function formatPickupWindow(window: string): string {
  const labels: Record<string, string> = {
    tomorrow: "Tomorrow",
    weekend: "This Weekend",
    "next-week": "Next Week",
  };
  return labels[window] || window;
}

// ── Styles ──────────────────────────────────────────────────────────────────

const greeting: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "24px",
  fontWeight: 700,
  color: "#2d2926",
  margin: "0 0 8px",
};

const bodyText: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#6b5f56",
  margin: "0 0 24px",
};

const summaryCard: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e0dc",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "24px",
};

const summaryTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#918780",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 16px",
};

const summaryTable: React.CSSProperties = {
  width: "100%",
};

const summaryLabel: React.CSSProperties = {
  fontSize: "14px",
  color: "#918780",
  padding: "6px 0",
  verticalAlign: "top",
  width: "40%",
};

const summaryValue: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 500,
  color: "#2d2926",
  padding: "6px 0",
  verticalAlign: "top",
  textAlign: "right" as const,
};

const summaryDivider: React.CSSProperties = {
  borderTop: "1px solid #e5e0dc",
  margin: "16px 0",
};

const priceText: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "20px",
  fontWeight: 700,
  color: "#c75a3a",
  margin: "0 0 4px",
};

const priceNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#918780",
  margin: 0,
};

const sectionHeading: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "18px",
  fontWeight: 700,
  color: "#2d2926",
  margin: "0 0 16px",
};

const stepsTable: React.CSSProperties = {
  width: "100%",
  marginBottom: "24px",
};

const stepNumber: React.CSSProperties = {
  width: "32px",
  height: "32px",
  backgroundColor: "#c75a3a",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  textAlign: "center" as const,
  borderRadius: "50%",
  verticalAlign: "top",
  padding: "6px 0",
};

const stepText: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.5",
  color: "#6b5f56",
  paddingLeft: "12px",
  paddingBottom: "12px",
  verticalAlign: "top",
};

const ctaContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "8px 0 16px",
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#c75a3a",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 600,
  padding: "14px 32px",
  borderRadius: "12px",
  textDecoration: "none",
};

// ── Default export for preview ──────────────────────────────────────────────

export default function PickupConfirmationPreview() {
  return (
    <PickupConfirmationEmail
      name="Sarah Johnson"
      email="sarah@example.com"
      postcode="SW1A 1AA"
      address="10 Downing Street"
      itemSize="small-parcel"
      parcelCount={2}
      pickupWindow="tomorrow"
      needsPrinting={true}
      quoteMin={8.99}
      quoteMax={10.99}
    />
  );
}
