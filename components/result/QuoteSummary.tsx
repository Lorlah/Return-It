"use client";

import { motion } from "framer-motion";
import { ITEM_SIZES, ItemSize, PickupWindow, PICKUP_WINDOWS } from "@/lib/pricing";

interface QuoteSummaryProps {
  itemSize: ItemSize;
  parcelCount: number;
  postcode: string;
  address: string;
  pickupWindow: PickupWindow;
  needsPrinting: boolean;
  fileName?: string;
}

export function QuoteSummary({
  itemSize,
  parcelCount,
  postcode,
  address,
  pickupWindow,
  needsPrinting,
  fileName,
}: QuoteSummaryProps) {
  const sizeInfo = ITEM_SIZES.find((s) => s.value === itemSize);
  const windowInfo = PICKUP_WINDOWS.find((w) => w.value === pickupWindow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl border border-border overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-display-md text-text-primary">Your pickup</h2>
      </div>

      <div className="divide-y divide-border">
        <SummaryRow
          icon={<ParcelIcon />}
          label="Item"
          value={
            <div>
              <p className="font-medium text-text-primary">
                {sizeInfo?.label} × {parcelCount}
              </p>
              <p className="text-body-sm text-text-secondary">{sizeInfo?.description}</p>
            </div>
          }
        />

        <SummaryRow
          icon={<LocationIcon />}
          label="Pickup from"
          value={
            <div>
              <p className="font-medium text-text-primary">{address}</p>
              <p className="text-body-sm text-text-secondary">{postcode}</p>
            </div>
          }
        />

        <SummaryRow
          icon={<CalendarIcon />}
          label="When"
          value={
            <div>
              <p className="font-medium text-text-primary">{windowInfo?.label}</p>
              <p className="text-body-sm text-text-secondary">{windowInfo?.description}</p>
            </div>
          }
        />

        {fileName && (
          <SummaryRow
            icon={<FileIcon />}
            label="Label"
            value={
              <p className="font-medium text-text-primary truncate max-w-[200px]">
                {fileName}
              </p>
            }
          />
        )}

        {needsPrinting && (
          <SummaryRow
            icon={<PrinterIcon />}
            label="Extras"
            value={
              <div className="flex items-center gap-2">
                <span className="inline-flex px-2 py-1 rounded-full bg-primary-light text-primary text-caption font-medium">
                  Label printing included
                </span>
              </div>
            }
          />
        )}
      </div>
    </motion.div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-4">
      <div className="w-10 h-10 rounded-lg bg-surface-base flex items-center justify-center text-text-secondary flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-caption text-text-muted uppercase tracking-wide mb-1">{label}</p>
        {value}
      </div>
    </div>
  );
}

function ParcelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44136 20 6.263L13 2.263C12.696 2.08449 12.3511 1.99082 12 1.99082C11.6489 1.99082 11.304 2.08449 11 2.263L4 6.263C3.69626 6.44136 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5586 4 17.737L11 21.737C11.304 21.9155 11.6489 22.0092 12 22.0092C12.3511 22.0092 12.696 21.9155 13 21.737L20 17.737C20.3037 17.5586 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 14H6V22H18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
