"use client";

import { motion } from "framer-motion";

interface PrintingToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function PrintingToggle({ value, onChange }: PrintingToggleProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-body-sm font-medium text-text-primary">
          Label printing
        </span>
        <div className="text-caption text-text-secondary">+£1.50</div>
      </div>
      
      <motion.button
        type="button"
        onClick={() => onChange(!value)}
        whileTap={{ scale: 0.98 }}
        className="w-full p-4 rounded-xl border-2 border-border bg-white hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
        role="switch"
        aria-checked={value}
        aria-label="Label printing"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: value ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                value ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary"
              }`}
            >
              <PrinterIcon />
            </motion.div>
            <div className="text-left">
              <p className="font-medium text-text-primary">
                {value ? "We'll print your label" : "Print label for me"}
              </p>
              <p className="text-caption text-text-secondary mt-0.5">
                {value 
                  ? "Our courier will bring the printed label"
                  : "No printer? We'll handle it for you"
                }
              </p>
            </div>
          </div>
          
          <div
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
              value ? "bg-primary" : "bg-border"
            }`}
          >
            <motion.div
              animate={{ x: value ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
                transition-all duration-300
              `}
            />
            {value && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CheckIcon />
              </motion.div>
            )}
          </div>
        </div>
      </motion.button>
    </div>
  );
}

function PrinterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 17H18V21C18 21.5304 17.7893 22.0391 17.4142 22.4142C17.0391 22.7893 16.5304 23 16 23H8C7.46957 23 6.96086 22.7893 6.58579 22.4142C6.21071 22.0391 6 21.5304 6 21V17Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 10V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 10H5C5.53043 10 6.03914 9.78929 6.41421 9.41421C6.78929 9.03914 7 8.53043 7 8V7C7 6.46957 6.78929 5.96086 6.41421 5.58579C6.03914 5.21071 5.53043 5 5 5H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21 10H19C18.4696 10 17.9609 9.78929 17.5858 9.41421C17.2107 9.03914 17 8.53043 17 8V7C17 6.46957 16.7893 5.96086 16.4142 5.58579C16.0391 5.21071 15.5304 5 15 5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17L4 12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
