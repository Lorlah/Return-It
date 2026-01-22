"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, getZoneName, Zone } from "@/lib/pricing";

interface PriceEstimateProps {
  min: number;
  max: number;
  breakdown: {
    base: number;
    extraParcels: number;
    printing: number;
  };
  zone: Zone;
}

export function PriceEstimate({ min, max, breakdown, zone }: PriceEstimateProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 -translate-x-1/3 translate-y-1/3" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-body-sm">Estimated price</p>
            <p className="text-display-xl font-display mt-1">
              {formatPrice(min)} – {formatPrice(max)}
            </p>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-expanded={showBreakdown}
            aria-label={showBreakdown ? "Hide price breakdown" : "Show price breakdown"}
          >
            <InfoIcon />
          </button>
        </div>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                <BreakdownRow
                  label={`Base price (${getZoneName(zone)})`}
                  value={formatPrice(breakdown.base)}
                />
                {breakdown.extraParcels > 0 && (
                  <BreakdownRow
                    label="Additional parcels"
                    value={formatPrice(breakdown.extraParcels)}
                  />
                )}
                {breakdown.printing > 0 && (
                  <BreakdownRow label="Label printing" value={formatPrice(breakdown.printing)} />
                )}
                <div className="pt-2 border-t border-white/20">
                  <BreakdownRow
                    label="Range buffer"
                    value={`+${formatPrice(max - min)}`}
                    muted
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-4 text-body-sm text-white/70">
          Final price confirmed after we verify the label and pickup location.
        </p>
      </div>
    </motion.div>
  );
}

function BreakdownRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-white/50" : "text-white/80"}>{label}</span>
      <span className={muted ? "text-white/50" : "text-white font-medium"}>{value}</span>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}
