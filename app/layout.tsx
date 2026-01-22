import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { AgentationWrapper } from "@/components/AgentationWrapper";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Return-It | Doorstep Return Pickup",
  description:
    "We pick up your returns so you don't have to queue. Upload your return label, get a pickup scheduled in 60 seconds.",
  keywords: [
    "return pickup",
    "parcel returns",
    "doorstep collection",
    "UK returns",
    "courier pickup",
  ],
  openGraph: {
    title: "Return-It | Doorstep Return Pickup",
    description:
      "We pick up your returns so you don't have to queue. Any retailer, any carrier.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="min-h-screen">
        {children}
        {process.env.NODE_ENV === "development" && <AgentationWrapper />}
      </body>
    </html>
  );
}
