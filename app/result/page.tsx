"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { QuoteSummary, PriceEstimate, WillingnessSurvey } from "@/components/result";
import { ItemSize, PickupWindow, Zone } from "@/lib/pricing";

interface StoredRequest {
  file: string | null;
  fileUrl: string | null;
  itemSize: ItemSize;
  parcelCount: number;
  postcode: string;
  address: string;
  pickupWindow: PickupWindow;
  needsPrinting: boolean;
  name: string;
  email: string;
  phone: string;
  quoteMin: number;
  quoteMax: number;
  zone: Zone;
}

export default function ResultPage() {
  const router = useRouter();
  const [request, setRequest] = useState<StoredRequest | null>(null);
  const [wouldPay, setWouldPay] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("pickupRequest");
    if (stored) {
      setRequest(JSON.parse(stored));
    } else {
      // No request data, redirect to start
      router.push("/");
    }
  }, [router]);

  const handleConfirm = async () => {
    if (!request) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...request,
          wouldPay,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // Clear session storage
      sessionStorage.removeItem("pickupRequest");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      // For MVP, still show success (concierge-style)
      sessionStorage.removeItem("pickupRequest");
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    );
  }

  const breakdown = {
    base: request.quoteMin - (request.needsPrinting ? 1.5 : 0) - ((request.parcelCount - 1) * 2.5),
    extraParcels: (request.parcelCount - 1) * 2.5,
    printing: request.needsPrinting ? 1.5 : 0,
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto section-padding py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/request"
              className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors"
            >
              <BackIcon />
              <span className="text-body-sm font-medium">Edit</span>
            </Link>
            <div className="flex items-center gap-2">
              <PackageIcon />
              <span className="font-display text-lg text-text-primary">Return-It</span>
            </div>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto section-padding py-8">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <SuccessState name={request.name} />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-display text-display-lg text-text-primary">
                  Your quote is ready
                </h1>
                <p className="mt-2 text-body-lg text-text-secondary">
                  Review your details and confirm to schedule your pickup.
                </p>
              </motion.div>

              <PriceEstimate
                min={request.quoteMin}
                max={request.quoteMax}
                breakdown={breakdown}
                zone={request.zone}
              />

              <QuoteSummary
                itemSize={request.itemSize}
                parcelCount={request.parcelCount}
                postcode={request.postcode}
                address={request.address}
                pickupWindow={request.pickupWindow}
                needsPrinting={request.needsPrinting}
                fileName={request.file || undefined}
              />

              <WillingnessSurvey value={wouldPay} onChange={setWouldPay} />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-surface-elevated rounded-2xl p-6 border border-border"
              >
                <h3 className="font-medium text-text-primary flex items-center gap-2">
                  <ClockIcon />
                  What happens next?
                </h3>
                <ol className="mt-4 space-y-3 text-body-md text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-caption font-medium flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <span>We&apos;ll text you within 2 hours to confirm your slot</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-caption font-medium flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <span>Our courier will call 30 mins before arrival</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-caption font-medium flex items-center justify-center flex-shrink-0">
                      3
                    </span>
                    <span>You&apos;ll receive proof of collection via text</span>
                  </li>
                </ol>
              </motion.div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                isLoading={isSubmitting}
                className="w-full"
              >
                Confirm pickup request
              </Button>

              <p className="text-caption text-text-muted text-center">
                No payment required now. We&apos;ll confirm the final price before collection.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SuccessState({ name }: { name: string }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
          className="w-12 h-12 rounded-full bg-success flex items-center justify-center"
        >
          <CheckIcon />
        </motion.div>
      </motion.div>

      <h1 className="mt-8 font-display text-display-lg text-text-primary">
        You&apos;re all set, {name.split(" ")[0]}!
      </h1>

      <p className="mt-4 text-body-lg text-text-secondary max-w-md mx-auto">
        We&apos;ve received your pickup request. Check your phone—we&apos;ll text you within 2
        hours to confirm your collection slot.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-6 bg-primary-light rounded-2xl max-w-sm mx-auto"
      >
        <p className="text-body-sm text-primary font-medium">
          🎉 You&apos;re one of our first users!
        </p>
        <p className="mt-2 text-body-sm text-text-secondary">
          We&apos;re personally handling every pickup right now. Expect a text from a real human.
        </p>
      </motion.div>

      <div className="mt-10">
        <Link href="/">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </motion.div>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-primary"
    >
      <path
        d="M16.5 9.4L7.5 4.21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44136 20 6.263L13 2.263C12.696 2.08449 12.3511 1.99082 12 1.99082C11.6489 1.99082 11.304 2.08449 11 2.263L4 6.263C3.69626 6.44136 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5586 4 17.737L11 21.737C11.304 21.9155 11.6489 22.0092 12 22.0092C12.3511 22.0092 12.696 21.9155 13 21.737L20 17.737C20.3037 17.5586 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.27 6.96L12 12.01L20.73 6.96"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22.08V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17L4 12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
