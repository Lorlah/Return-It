"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Upload your label",
    description: "Snap a photo or upload the PDF from your retailer",
    icon: UploadIcon,
  },
  {
    number: "2",
    title: "Choose your slot",
    description: "Pick a pickup time that works for you",
    icon: CalendarIcon,
  },
  {
    number: "3",
    title: "We collect it",
    description: "Our courier picks up from your doorstep",
    icon: TruckIcon,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-32 bg-surface-elevated relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50 -translate-y-1/2 hidden lg:block" />
      
      <div className="max-w-6xl mx-auto section-padding relative">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl lg:text-5xl text-text-primary mb-4"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-text-secondary"
          >
            Three simple steps to get your return sorted
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] -translate-x-8 -z-10">
                  <div className="absolute inset-0 bg-border" />
                  <motion.div 
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                    className="absolute inset-0 bg-primary/20" 
                  />
                </div>
              )}

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-white border border-border shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                  <step.icon />
                </div>
                
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white">
                  {step.number}
                </div>

                <h3 className="font-display text-2xl text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-body-md text-text-secondary max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UploadIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40"
      />
      <path
        d="M17 8L12 3L7 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-40"
      />
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" className="opacity-40" />
      <circle cx="12" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 3H1V16H16V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40"
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
      <path d="M4 10H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
