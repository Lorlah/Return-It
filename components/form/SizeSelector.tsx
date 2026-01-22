"use client";

import { motion } from "framer-motion";
import { ITEM_SIZES, ItemSize } from "@/lib/pricing";

interface SizeSelectorProps {
  value: ItemSize;
  onChange: (size: ItemSize) => void;
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-body-sm font-medium text-text-primary mb-3">
        Parcel size
      </label>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Parcel size">
        {ITEM_SIZES.map((size, index) => (
          <motion.button
            key={size.value}
            type="button"
            onClick={() => onChange(size.value)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-xl border-2 text-left
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              ${
                value === size.value
                  ? "border-primary bg-primary-light"
                  : "border-border bg-white hover:border-border-strong"
              }
            `}
            role="radio"
            aria-checked={value === size.value}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <ParcelIcon size={size.value} selected={value === size.value} />
                  <span
                    className={`font-medium ${value === size.value ? "text-primary" : "text-text-primary"}`}
                  >
                    {size.label}
                  </span>
                </div>
                <p className="mt-1 text-caption text-text-secondary">{size.description}</p>
                <p className="mt-0.5 text-caption text-text-muted">Up to {size.maxWeight}</p>
              </div>
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                  ${value === size.value ? "border-primary bg-primary" : "border-border"}
                `}
              >
                {value === size.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ParcelIcon({ size, selected }: { size: ItemSize; selected: boolean }) {
  const iconSize = {
    letter: 16,
    "large-letter": 18,
    "small-parcel": 20,
    "medium-parcel": 22,
  }[size];

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      className={selected ? "text-primary" : "text-text-secondary"}
    >
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
