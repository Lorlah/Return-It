"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-light opacity-40 blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-light opacity-30 blur-3xl -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-6xl mx-auto section-padding pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-display-xl text-text-primary text-balance"
          >
            We pick up your returns so you{" "}
            <span className="text-primary">don&apos;t have to queue</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-body-lg text-text-secondary max-w-xl"
          >
            Upload your return label, choose a pickup slot, and we&apos;ll collect it
            from your doorstep. Any retailer, any carrier.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex items-center gap-6 text-body-sm text-text-muted"
          >
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>60-second booking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>All retailers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Label printing available</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M13.5 4.5L6 12L2.5 8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
