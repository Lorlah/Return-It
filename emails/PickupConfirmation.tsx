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
  fontSize: "28px",
  fontWeight: 700,
  color: "#2d2926",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const bodyText: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#6b5f56",
  margin: "0 0 32px",
  textAlign: "center" as const,
};

const summaryCard: React.CSSProperties = {
  backgroundColor: "#faf9f7", // Light warm gray background
  border: "1px solid #e5e0dc",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "32px",
  position: "relative" as const,
};

const summaryTitle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#918780",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const summaryTable: React.CSSProperties = {
  width: "100%",
};

const summaryLabel: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b5f56",
  padding: "8px 0",
  verticalAlign: "top",
  width: "40%",
};

const summaryValue: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: "#2d2926",
  padding: "8px 0",
  verticalAlign: "top",
  textAlign: "right" as const,
};

const summaryDivider: React.CSSProperties = {
  borderTop: "2px dashed #d6d1cd", // Dashed line for receipt feel
  margin: "20px 0",
};

const priceText: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "24px",
  fontWeight: 700,
  color: "#c75a3a",
  margin: "0 0 4px",
  textAlign: "center" as const,
  display: "block",
};

const priceNote: React.CSSProperties = {
  fontSize: "13px",
  color: "#918780",
  margin: 0,
  textAlign: "center" as const,
  display: "block",
};

const sectionHeading: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "20px",
  fontWeight: 700,
  color: "#2d2926",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const stepsTable: React.CSSProperties = {
  width: "100%",
  marginBottom: "32px",
};

const stepNumber: React.CSSProperties = {
  width: "36px",
  height: "36px",
  backgroundColor: "#fdf0ec",
  color: "#c75a3a",
  fontSize: "16px",
  fontWeight: 700,
  textAlign: "center" as const,
  borderRadius: "50%",
  verticalAlign: "middle",
  padding: "0",
  lineHeight: "36px", // Vertically center text
};

const stepText: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.5",
  color: "#2d2926",
  paddingLeft: "16px",
  paddingBottom: "16px",
  verticalAlign: "middle",
  fontWeight: 500,
};

const ctaContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "16px 0 24px",
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#c75a3a",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 600,
  padding: "16px 48px",
  borderRadius: "50px", // Pill shape
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(199, 90, 58, 0.2)",
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
