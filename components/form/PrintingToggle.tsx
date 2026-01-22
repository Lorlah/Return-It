"use client";

import { motion } from "framer-motion";

interface PrintingToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function PrintingToggle({ value, onChange }: PrintingToggleProps) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`
          w-full p-4 rounded-xl border-2 text-left
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          ${value ? "border-primary bg-primary-light" : "border-border bg-white hover:border-border-strong"}
        `}
        role="switch"
        aria-checked={value}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${value ? "bg-primary text-white" : "bg-surface-base text-text-secondary"}
              `}
            >
              <PrinterIcon />
            </div>
            <div>
              <p className={`font-medium ${value ? "text-primary" : "text-text-primary"}`}>
                Print my label
              </p>
              <p className="text-body-sm text-text-secondary">
                We&apos;ll print and attach it (+£1.50)
              </p>
            </div>
          </div>

          <div
            className={`
              relative w-12 h-7 rounded-full transition-colors duration-200
              ${value ? "bg-primary" : "bg-border"}
            `}
          >
            <motion.div
              animate={{ x: value ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
            />
          </div>
        </div>
      </button>
      <p className="mt-2 text-caption text-text-muted">
        No printer? No problem. We&apos;ll handle it for you.
      </p>
    </div>
  );
}

function PrinterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9V2H18V9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 14H6V22H18V14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
