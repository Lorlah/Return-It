"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RadioCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function RadioCard({
  value,
  label,
  description,
  icon,
  selected,
  onSelect,
  disabled = false,
}: RadioCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onSelect(value)}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative w-full p-4 rounded-xl border-2 text-left
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          selected
            ? "border-primary bg-primary-light"
            : "border-border bg-white hover:border-border-strong"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={`
              flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
              ${selected ? "bg-primary text-white" : "bg-surface-base text-text-secondary"}
            `}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium ${selected ? "text-primary" : "text-text-primary"}`}
          >
            {label}
          </p>
          {description && (
            <p className="text-body-sm text-text-secondary mt-0.5">
              {description}
            </p>
          )}
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
