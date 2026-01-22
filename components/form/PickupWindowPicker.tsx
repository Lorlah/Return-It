"use client";

import { motion } from "framer-motion";
import { PICKUP_WINDOWS, PickupWindow } from "@/lib/pricing";

interface PickupWindowPickerProps {
  value: PickupWindow;
  onChange: (window: PickupWindow) => void;
}

export function PickupWindowPicker({ value, onChange }: PickupWindowPickerProps) {
  return (
    <div className="w-full">
      <label className="block text-body-sm font-medium text-text-primary mb-3">
        When should we collect?
      </label>
      <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Pickup window">
        {PICKUP_WINDOWS.map((window, index) => (
          <motion.button
            key={window.value}
            type="button"
            onClick={() => onChange(window.value)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-xl border-2 text-center
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              ${
                value === window.value
                  ? "border-primary bg-primary-light"
                  : "border-border bg-white hover:border-border-strong"
              }
            `}
            role="radio"
            aria-checked={value === window.value}
          >
            <WindowIcon type={window.value} selected={value === window.value} />
            <p
              className={`mt-2 font-medium ${value === window.value ? "text-primary" : "text-text-primary"}`}
            >
              {window.label}
            </p>
            <p className="mt-0.5 text-caption text-text-secondary">{window.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function WindowIcon({ type, selected }: { type: PickupWindow; selected: boolean }) {
  const color = selected ? "text-primary" : "text-text-secondary";

  if (type === "tomorrow") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={`mx-auto ${color}`}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "weekend") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={`mx-auto ${color}`}>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="4" height="4" rx="0.5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={`mx-auto ${color}`}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
      <path d="M8 14L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
