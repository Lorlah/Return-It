"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const frictionLines = [
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-light opacity-30 blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-light opacity-20 blur-3xl -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-6xl mx-auto section-padding pt-12 pb-16 lg:pt-24 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-2xl relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-text-primary text-balance leading-[1.1]">
                That return you keep meaning to post?{" "}
                <span className="text-primary relative whitespace-nowrap">
                  We&apos;ll come get it
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-primary-light -z-10"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="opacity-60"
                    />
                  </svg>
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg sm:text-xl text-text-secondary max-w-lg leading-relaxed"
            >
              Upload your return label. We pick it up from your door — or your office.
              Any retailer, any carrier. Zero trips.
            </motion.p>

            {/* Rotating friction lines */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 h-10 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-xl sm:text-2xl text-primary font-medium"
                >
                  {frictionLines[lineIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap gap-y-3 gap-x-6 text-body-sm font-medium text-text-primary"
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

          <div className="relative lg:h-[500px] flex items-center justify-center pointer-events-none select-none">
            {/* Animated Parcel Illustration */}
            <div className="relative w-full max-w-md aspect-square">
              {/* Abstract decorative circle behind */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-gradient-to-tr from-primary-light/50 to-transparent rounded-full blur-2xl transform scale-90"
              />

              {/* Floating Elements */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full h-full"
              >
                {/* Main Parcel Box */}
                <motion.div
                  animate={shouldReduceMotion ? { y: 0 } : { y: [0, -15, 0] }}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#FDF8F6] rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-border/60 overflow-hidden transform rotate-[-6deg]"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary/10" />
                  <div className="absolute top-8 left-8 right-8 h-2 bg-border-default/30 rounded-full w-2/3" />
                  <div className="absolute top-14 left-8 right-8 h-2 bg-border-default/30 rounded-full w-1/2" />

                  {/* Tape */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-primary/5 border-x border-primary/10" />

                  {/* Label */}
                  <div className="absolute bottom-8 right-8 w-16 h-16 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full" />
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements around */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { y: 0, rotate: 12 }
                      : { y: [0, 20, 0], rotate: [12, 15, 12] }
                  }
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }
                  }
                  className="absolute top-[10%] right-[15%] w-24 h-24 bg-white rounded-2xl shadow-xl border border-border flex items-center justify-center transform rotate-12"
                >
                  <TruckIcon className="text-primary w-10 h-10" />
                </motion.div>

                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { y: 0, rotate: -12 }
                      : { y: [0, -10, 0], rotate: [-12, -8, -12] }
                  }
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                  }
                  className="absolute bottom-[20%] left-[10%] w-20 h-20 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center transform -rotate-12"
                >
                  <span className="font-display font-bold text-lg leading-tight text-center">
                    Zero
                    <br />
                    trips
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
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
