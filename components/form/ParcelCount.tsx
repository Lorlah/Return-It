"use client";

import { motion } from "framer-motion";

interface ParcelCountProps {
  value: number;
  onChange: (count: number) => void;
  max?: number;
}

export function ParcelCount({ value, onChange, max = 10 }: ParcelCountProps) {
  const decrease = () => {
    if (value > 1) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="w-full">
      <label className="block text-body-sm font-medium text-text-primary mb-3">
        How many parcels?
      </label>
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={decrease}
          disabled={value <= 1}
          whileTap={{ scale: 0.95 }}
          className={`
            w-12 h-12 rounded-xl border-2 flex items-center justify-center
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            ${value <= 1 ? "border-border text-text-muted cursor-not-allowed" : "border-border hover:border-border-strong text-text-primary"}
          `}
          aria-label="Decrease parcel count"
        >
          <MinusIcon />
        </motion.button>

        <div className="flex-1 text-center">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-md font-display text-text-primary"
          >
            {value}
          </motion.span>
          <p className="text-body-sm text-text-secondary">
            {value === 1 ? "parcel" : "parcels"}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={increase}
          disabled={value >= max}
          whileTap={{ scale: 0.95 }}
          className={`
            w-12 h-12 rounded-xl border-2 flex items-center justify-center
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            ${value >= max ? "border-border text-text-muted cursor-not-allowed" : "border-border hover:border-border-strong text-text-primary"}
          `}
          aria-label="Increase parcel count"
        >
          <PlusIcon />
        </motion.button>
      </div>
      {value >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="mt-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60">
            {/* Animated sparkle icon */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex-shrink-0"
            >
              <SparkleIcon />
            </motion.div>
            
            <div className="flex-1">
              <p className="text-body-sm font-semibold text-emerald-700">
                Bulk discount unlocked!
              </p>
              <p className="text-caption text-emerald-600/80">
                Save more when you send 4+ parcels together
              </p>
            </div>

            {/* Decorative badge */}
            <div className="flex-shrink-0 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-caption font-bold shadow-sm">
              −10%
            </div>
          </div>

          {/* Subtle shine effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
          />
        </motion.div>
      )}
    </div>
  );
}

function MinusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-emerald-500"
    >
      <path
        d="M12 2L13.09 8.26L19 7L14.74 11.91L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 11.91L5 7L10.91 8.26L12 2Z"
        fill="currentColor"
      />
      <path
        d="M5 2L5.5 4L7 3.5L5.5 5L5 7L4.5 5L3 5.5L4.5 4L5 2Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M19 17L19.5 19L21 18.5L19.5 20L19 22L18.5 20L17 20.5L18.5 19L19 17Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
