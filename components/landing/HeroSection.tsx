"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { QuickStartForm } from "./QuickStartForm";

const frictionLines = [
  "We'll handle it.",
  "No printer? No problem.",
  "Post office closed? We come to you.",
  "Too heavy to carry? We handle it.",
  "Multiple returns? One pickup.",
  "Missed the deadline? Never again.",
];

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % frictionLines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <section className="relative overflow-hidden bg-surface-base">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] rounded-full bg-primary-light opacity-30 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-secondary-light/20 blur-[80px] translate-y-1/3" />
      </div>

      <div className="max-w-4xl mx-auto section-padding pt-16 pb-20 lg:pt-28 lg:pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text-primary text-balance leading-[1.2]">
            That return you keep meaning to post?{" "}
            <span className="text-primary relative grid items-start justify-center mt-2 w-full max-w-2xl mx-auto min-h-[1.5em]">
              {frictionLines.map((line, idx) => (
                <AnimatePresence key={idx}>
                  {lineIndex === idx && (
                    <motion.span
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="col-start-1 row-start-1 block whitespace-normal"
                    >
                      {line}
                    </motion.span>
                  )}
                </AnimatePresence>
              ))}
              <motion.div
                layout
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 sm:-bottom-2 left-1/2 w-full max-w-xs sm:max-w-md h-3 sm:h-4 text-primary opacity-30 -z-10 -translate-x-1/2"
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed text-balance"
        >
          Upload your return label. We pick it up from your door — or your office.
          Any retailer, any carrier. Zero trips.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-12 w-full"
        >
          <QuickStartForm compact />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap justify-center gap-y-4 gap-x-8 text-body-sm font-medium text-text-primary"
        >
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>From £4.99</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>We print your label</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Evening &amp; weekend pickups</span>
          </div>
        </motion.div>
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

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 3H1V16H16V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8H20L23 11V16H16V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
