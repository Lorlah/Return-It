"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, getZoneName, Zone, PriceBreakdown } from "@/lib/pricing";

interface PriceEstimateProps {
  min: number;
  max: number;
  breakdown: PriceBreakdown;
  zone: Zone;
  hasBulkDiscount?: boolean;
}

export function PriceEstimate({ min, max, breakdown, zone, hasBulkDiscount = false }: PriceEstimateProps) {
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
            {hasBulkDiscount && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-body-sm font-medium text-white/90 flex items-center gap-1.5"
              >
                <DiscountIcon />
                10% bulk discount applied
              </motion.p>
            )}
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
                {breakdown.bulkDiscount > 0 && (
                  <BreakdownRow
                    label="Bulk discount (10%)"
                    value={`-${formatPrice(breakdown.bulkDiscount)}`}
                    highlight
                  />
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
  highlight = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  highlight?: boolean;
}) {
  const labelColor = highlight
    ? "text-white font-medium"
    : muted
      ? "text-white/50"
      : "text-white/80";
  const valueColor = highlight
    ? "text-white font-bold"
    : muted
      ? "text-white/50"
      : "text-white font-medium";

  return (
    <div className="flex items-center justify-between">
      <span className={labelColor}>{label}</span>
      <span className={valueColor}>{value}</span>
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

function DiscountIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.09 8.26L19 7L14.74 11.91L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 11.91L5 7L10.91 8.26L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
