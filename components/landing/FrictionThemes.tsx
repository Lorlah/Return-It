"use client";

import { motion } from "framer-motion";

const themes = [
  {
    scenario:
      "You bought it 27 days ago. The return window closes in 3 days. The post office closes at 5:30. You finish work at 6.",
    resolution: "We pick up evenings, weekends, and from your office.",
    icon: ClockIcon,
    label: "Deadline dread",
  },
  {
    scenario:
      "No printer at home. So it's a trip to the print shop, then a trip to the post office. Two separate trips to return one item.",
    resolution: "We print the label and pick up the parcel. Zero trips.",
    icon: PrinterIcon,
    label: "The two-trip trap",
  },
  {
    scenario:
      "A dehumidifier or a dishwasher. Can't fit it on a bike. Can't carry it to the post office. And you still need to print the label first.",
    resolution: "We handle heavy and bulky items. You don't even carry it out.",
    icon: WeightIcon,
    label: "The heavy haul",
  },
  {
    scenario:
      "Three items, three retailers, three different labels, three different drop-off points. Your Saturday morning becomes a logistics tour.",
    resolution: "One pickup, all your returns, sorted.",
    icon: StackIcon,
    label: "Multi-return madness",
  },
  {
    scenario:
      "That dress you never wore is still in the bag on the floor. It's been 4 months. You've accepted the £60 loss.",
    resolution: "The guilt leaves with the parcel.",
    icon: HeartIcon,
    label: "\"Stuck with it\"",
  },
];

export function FrictionThemes() {
  return (
    <section className="py-20 lg:py-28 bg-surface-elevated relative">
      <div className="max-w-5xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-primary font-medium text-body-sm tracking-wide uppercase mb-3">
            Sound familiar?
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-text-primary max-w-2xl leading-[1.15]">
            Returns shouldn&apos;t be this hard
          </h2>
        </motion.div>

        <div className="space-y-6">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="group relative bg-white rounded-2xl border border-border/60 p-6 sm:p-8 hover:border-primary/20 transition-colors duration-300">
                <div className="flex gap-5 sm:gap-8">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface-base flex items-center justify-center text-text-muted group-hover:bg-primary-light group-hover:text-primary transition-colors duration-300">
                    <theme.icon />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-caption font-medium text-text-muted uppercase tracking-wide mb-2">
                      {theme.label}
                    </p>
                    <p className="text-text-secondary text-body-md leading-relaxed">
                      {theme.scenario}
                    </p>
                    <p className="mt-3 text-primary font-medium text-body-md">
                      {theme.resolution}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Icons ───────────────────────────────────────────────────────────────────
// 2px stroke, rounded caps/joins, 24x24 viewBox — matching brand kit iconography

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

function WeightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
