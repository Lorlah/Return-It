"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ITEM_SIZES, ItemSize } from "@/lib/pricing";

export function QuickStartForm() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<ItemSize>("small-parcel");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/request?size=${selectedSize}`);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-elevated -skew-y-3 transform origin-top-right scale-110 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto section-padding relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-[2rem] border border-border/50 p-8 lg:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] ring-1 ring-border/50 backdrop-blur-sm">
            <h2 className="font-display text-display-md text-text-primary text-center">
              Get your return picked up
            </h2>
            <p className="mt-4 text-lg text-text-secondary text-center max-w-md mx-auto">
              Select your parcel size to get started. We&apos;ll handle the rest.
            </p>

            <form onSubmit={handleSubmit} className="mt-10">
              <fieldset>
                <legend className="sr-only">Select parcel size</legend>
                <div className="grid grid-cols-2 gap-4">
                  {ITEM_SIZES.map((size) => (
                    <SizeOption
                      key={size.value}
                      value={size.value}
                      label={size.label}
                      description={size.maxWeight}
                      selected={selectedSize === size.value}
                      onSelect={setSelectedSize}
                    />
                  ))}
                </div>
              </fieldset>

              <div className="mt-10">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full text-lg h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                >
                  Get it picked up
                  <ArrowRightIcon />
                </Button>
                
                <p className="mt-4 text-caption text-text-muted text-center flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Starting from £4.99 · No commitment until you confirm
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface SizeOptionProps {
  value: ItemSize;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (value: ItemSize) => void;
}

function SizeOption({
  value,
  label,
  description,
  selected,
  onSelect,
}: SizeOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(value)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-5 rounded-2xl text-left border-2
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          selected
            ? "border-primary bg-primary-light/30 shadow-sm"
            : "border-border/60 bg-surface-base hover:border-primary/30 hover:bg-white"
        }
      `}
      role="radio"
      aria-checked={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`font-semibold text-lg ${
              selected ? "text-primary" : "text-text-primary"
            }`}
          >
            {label}
          </p>
          <p className="mt-1 text-sm font-medium text-text-secondary">{description}</p>
        </div>
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
            ${selected ? "border-primary bg-primary" : "border-border-strong bg-white"}
          `}
        >
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-2.5 h-2.5 rounded-full bg-white"
            />
          )}
        </div>
      </div>
    </motion.button>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
