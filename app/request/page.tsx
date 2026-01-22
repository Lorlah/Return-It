"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FileUpload,
  SizeSelector,
  PickupWindowPicker,
  ParcelCount,
  PrintingToggle,
} from "@/components/form";
import { ItemSize, PickupWindow, calculatePrice, formatPrice } from "@/lib/pricing";
import { uploadToCloudinary } from "@/lib/cloudinary";

type FormStep = 1 | 2 | 3;

interface FormData {
  // Step 1: Item details
  file: File | null;
  fileUrl: string | null;
  itemSize: ItemSize;
  parcelCount: number;
  // Step 2: Pickup details
  postcode: string;
  address: string;
  pickupWindow: PickupWindow;
  needsPrinting: boolean;
  // Step 3: Contact
  name: string;
  email: string;
  phone: string;
}

function RequestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<FormStep>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [formData, setFormData] = useState<FormData>({
    file: null,
    fileUrl: null,
    itemSize: (searchParams.get("size") as ItemSize) || "small-parcel",
    parcelCount: 1,
    postcode: "",
    address: "",
    pickupWindow: "tomorrow",
    needsPrinting: false,
    name: "",
    email: "",
    phone: "",
  });

  // Calculate price estimate
  const priceEstimate = formData.postcode
    ? calculatePrice(
        formData.postcode,
        formData.itemSize,
        formData.parcelCount,
        formData.needsPrinting
      )
    : null;

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when field is updated
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleFileSelect = async (file: File) => {
    updateFormData("file", file);
    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      updateFormData("fileUrl", result.url);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrors((prev) => ({ ...prev, file: "Upload failed. Please try again." }));
    } finally {
      setIsUploading(false);
    }
  };

  const validateStep = (currentStep: FormStep): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (currentStep === 1) {
      // File is optional for MVP
    }

    if (currentStep === 2) {
      if (!formData.postcode.trim()) {
        newErrors.postcode = "Please enter your postcode";
      } else if (!/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(formData.postcode.trim())) {
        newErrors.postcode = "Please enter a valid UK postcode";
      }
      if (!formData.address.trim()) {
        newErrors.address = "Please enter your address";
      }
    }

    if (currentStep === 3) {
      if (!formData.name.trim()) {
        newErrors.name = "Please enter your name";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Please enter your email";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Please enter your phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3) as FormStep);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1) as FormStep);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    // Store form data in sessionStorage for result page
    const quote = priceEstimate || calculatePrice(formData.postcode, formData.itemSize, formData.parcelCount, formData.needsPrinting);
    
    sessionStorage.setItem(
      "pickupRequest",
      JSON.stringify({
        ...formData,
        file: formData.file?.name || null,
        quoteMin: quote.min,
        quoteMax: quote.max,
        zone: quote.zone,
      })
    );

    // Navigate to result page
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto section-padding py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors">
              <BackIcon />
              <span className="text-body-sm font-medium">Back</span>
            </Link>
            <ProgressIndicator step={step} />
            {priceEstimate && (
              <div className="text-right">
                <p className="text-caption text-text-muted">Estimate</p>
                <p className="font-medium text-primary">
                  {formatPrice(priceEstimate.min)}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto section-padding py-8">
        {step === 1 && (
          <div key="step1">
            <h1 className="font-display text-display-lg text-text-primary mb-8">About your item</h1>
            <div className="space-y-6">
              <FileUpload
                onFileSelect={handleFileSelect}
                file={formData.file}
                isUploading={isUploading}
                error={errors.file}
              />
              <SizeSelector
                value={formData.itemSize}
                onChange={(size) => updateFormData("itemSize", size)}
              />
              <ParcelCount
                value={formData.parcelCount}
                onChange={(count) => updateFormData("parcelCount", count)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div key="step2">
            <h1 className="font-display text-display-lg text-text-primary mb-8">Pickup details</h1>
            <div className="space-y-6">
              <Input
                label="Postcode"
                placeholder="e.g. SW1A 1AA"
                value={formData.postcode}
                onChange={(e) => updateFormData("postcode", e.target.value.toUpperCase())}
                error={errors.postcode}
                autoComplete="postal-code"
              />
              <Input
                label="Full address"
                placeholder="House number and street name"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                error={errors.address}
                autoComplete="street-address"
              />
              <PickupWindowPicker
                value={formData.pickupWindow}
                onChange={(window) => updateFormData("pickupWindow", window)}
              />
              <PrintingToggle
                value={formData.needsPrinting}
                onChange={(value) => updateFormData("needsPrinting", value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="step3">
            <h1 className="font-display text-display-lg text-text-primary mb-8">Your details</h1>
            <div className="space-y-6">
              <Input
                label="Name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                error={errors.name}
                autoComplete="name"
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                error={errors.email}
                autoComplete="email"
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="07XXX XXXXXX"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                error={errors.phone}
                hint="We'll text you to confirm the pickup"
                autoComplete="tel"
              />

              {priceEstimate && (
                <div className="p-4 rounded-xl bg-primary-light border border-primary/20">
                  <p className="text-body-sm text-text-secondary">Your quote</p>
                  <p className="text-display-md font-display text-primary">
                    {formatPrice(priceEstimate.min)} – {formatPrice(priceEstimate.max)}
                  </p>
                  <p className="mt-1 text-caption text-text-muted">
                    Final price confirmed after pickup
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button variant="primary" onClick={handleNext} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="flex-1"
            >
              Get my quote
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <RequestFormContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center">
      <div className="animate-pulse text-text-muted">Loading...</div>
    </div>
  );
}


function ProgressIndicator({ step }: { step: FormStep }) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${s === step ? "w-6 bg-primary" : s < step ? "bg-primary" : "bg-border"}
          `}
        />
      ))}
    </div>
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
