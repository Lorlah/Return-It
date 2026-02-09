import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

/**
 * Shared email layout wrapper for all Return-It transactional emails.
 *
 * Provides: coral header bar, wordmark, trust footer, unsubscribe, consistent styling.
 * See BRAND-KIT.md §4 for full email design specifications.
 */
interface LayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Coral accent bar */}
          <Section style={accentBar} />

          {/* Header with wordmark */}
          <Section style={header}>
            <Text style={wordmark}>Return-It</Text>
          </Section>

          {/* Main content (provided by individual templates) */}
          <Section style={main}>{children}</Section>

          {/* Trust footer */}
          <Section style={trustFooter}>
            <Text style={trustText}>
              We&apos;re personally handling every pickup right now. Expect a
              text from a real human.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Return-It · Doorstep return pickup, any retailer
            </Text>
            <Text style={footerText}>
              <Link href="mailto:hello@return-it.co.uk" style={footerLink}>
                hello@return-it.co.uk
              </Link>
              {" · "}
              <Link href="#" style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
// Using inline styles for email compatibility (no CSS-in-JS or Tailwind).
// Colors from BRAND-KIT.md §2 Email-Safe Palette.

const body: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  fontFamily:
    '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const accentBar: React.CSSProperties = {
  backgroundColor: "#c75a3a",
  height: "4px",
  width: "100%",
};

const header: React.CSSProperties = {
  padding: "24px 32px 16px",
};

const wordmark: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "22px",
  fontWeight: 700,
  color: "#2d2926",
  margin: 0,
};

const main: React.CSSProperties = {
  padding: "0 32px 24px",
};

const trustFooter: React.CSSProperties = {
  padding: "16px 32px",
  backgroundColor: "#fdf0ec",
  borderRadius: "12px",
  margin: "0 32px 24px",
};

const trustText: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#6b5f56",
  margin: 0,
  textAlign: "center" as const,
};

const divider: React.CSSProperties = {
  borderTop: "1px solid #e5e0dc",
  margin: "0 32px",
};

const footer: React.CSSProperties = {
  padding: "20px 32px",
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#918780",
  margin: "0 0 4px",
  textAlign: "center" as const,
};

const footerLink: React.CSSProperties = {
  color: "#918780",
  textDecoration: "underline",
};
