"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ParcelCountProps {
  value: number;
  onChange: (count: number) => void;
}

export function ParcelCount({ value, onChange }: ParcelCountProps) {
  const [prevValue, setPrevValue] = useState(value);
  
  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  const decrement = () => {
    const newValue = Math.max(1, value - 1);
    onChange(newValue);
  };

  const increment = () => {
    const newValue = Math.min(10, value + 1);
    onChange(newValue);
  };

  const hasBulkDiscount = value >= 3;
  const animationDirection = value > prevValue ? 1 : -1;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-body-sm font-medium text-text-primary">
          How many parcels?
        </label>
        {hasBulkDiscount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="px-2 py-1 rounded-lg bg-success-light border border-success/20 text-success text-caption font-medium"
          >
            Bulk discount
          </motion.div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={decrement}
          disabled={value <= 1}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: !value ? 1 : 1.05 }}
          className={`
            w-12 h-12 rounded-xl border-2 flex items-center justify-center
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            ${
              value <= 1
                ? "border-border bg-surface-base text-text-muted cursor-not-allowed"
                : "border-border bg-white hover:border-border-strong hover:bg-primary-light"
            }
          `}
          aria-label="Decrease parcel count"
        >
          <MinusIcon />
        </motion.button>
        
        <div className="relative w-16 h-12 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={value}
              initial={{ 
                opacity: 0, 
                y: animationDirection * 20,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                y: -animationDirection * 20,
                scale: 0.8
              }}
              transition={{ 
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-display-md font-display text-text-primary"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <motion.button
          type="button"
          onClick={increment}
          disabled={value >= 10}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className={`
            w-12 h-12 rounded-xl border-2 flex items-center justify-center
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            ${
              value >= 10
                ? "border-border bg-surface-base text-text-muted cursor-not-allowed"
                : "border-border bg-white hover:border-border-strong hover:bg-primary-light"
            }
          `}
          aria-label="Increase parcel count"
        >
          <PlusIcon />
        </motion.button>
      </div>
    </div>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}