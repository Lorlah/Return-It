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
    <section className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl border border-border p-8 lg:p-10 shadow-lg">
            <h2 className="font-display text-display-md text-text-primary text-center">
              Get your return picked up
            </h2>
            <p className="mt-3 text-body-md text-text-secondary text-center">
              Select your parcel size to get started
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <fieldset>
                <legend className="sr-only">Select parcel size</legend>
                <div className="grid grid-cols-2 gap-3">
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-8"
              >
                Get it picked up
                <ArrowRightIcon />
              </Button>

              <p className="mt-4 text-caption text-text-muted text-center">
                Starting from £4.99 · No commitment until you confirm
              </p>
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
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-4 rounded-xl border-2 text-left
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          selected
            ? "border-primary bg-primary-light"
            : "border-border bg-white hover:border-border-strong"
        }
      `}
      role="radio"
      aria-checked={selected}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`font-medium ${selected ? "text-primary" : "text-text-primary"}`}
          >
            {label}
          </p>
          <p className="text-body-sm text-text-secondary">{description}</p>
        </div>
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
            ${selected ? "border-primary bg-primary" : "border-border"}
          `}
        >
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-white"
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
