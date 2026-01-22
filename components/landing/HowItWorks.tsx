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
    <section className="py-16 lg:py-24 bg-surface-elevated">
      <div className="max-w-6xl mx-auto section-padding">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-display-md text-text-primary"
        >
          How it works
        </motion.h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Connector line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border -translate-x-6" />
              )}

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
                  <step.icon />
                </div>
                <div className="pt-1">
                  <span className="text-caption font-medium text-primary uppercase tracking-wide">
                    Step {step.number}
                  </span>
                  <h3 className="mt-1 font-display text-display-md text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-body-md text-text-secondary">
                    {step.description}
                  </p>
                </div>
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
      width="28"
      height="28"
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
      width="28"
      height="28"
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
      />
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 14H8.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 14H12.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 14H16.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="28"
      height="28"
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
