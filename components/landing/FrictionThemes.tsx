"use client";

import { motion } from "framer-motion";

const themes = [
  {
    scenario:
      "You bought it 27 days ago. The return window closes in 3 days. The post office closes at 5:30.",
    resolution: "We pick up evenings & weekends.",
    icon: ClockIcon,
    label: "Deadline dread",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1080",
    badge: "Driver arriving 18:30—19:30",
  },
  {
    scenario:
      "No printer at home. It's a trip to the print shop, then a separate trip to the post office.",
    resolution: "We bring the label to you.",
    icon: PrinterIcon,
    label: "The two-trip trap",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1080",
    badge: "Label printed by driver",
  },
  {
    scenario:
      "A heavy dehumidifier or large furniture box. Can't fit it on a bike or carry it to the shop.",
    resolution: "We handle heavy & bulky items.",
    icon: WeightIcon,
    label: "The heavy haul",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1080",
    badge: "Large item pickup confirmed",
  },
  {
    scenario:
      "Three items, three retailers, three different labels. Your Saturday becomes a logistics tour.",
    resolution: "One pickup for everything.",
    icon: StackIcon,
    label: "Multi-return madness",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1080",
    badge: "3 parcels collected",
  },
  {
    scenario:
      "That dress is still in the bag on the floor. It's not the money — it's the guilt of inaction.",
    resolution: "The guilt leaves with the parcel.",
    icon: HeartIcon,
    label: "\"Stuck with it\"",
    image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=1080",
    badge: "Refund processed",
  },
];

export function FrictionThemes() {
  return (
    <section className="py-24 lg:py-32 bg-surface-elevated overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-24 max-w-2xl">
          <p className="text-secondary font-medium text-sm tracking-widest uppercase mb-4">
            Sound familiar?
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-[1.1] tracking-tight">
            The friction is real. <br />
            <span className="text-secondary">The solution is simple.</span>
          </h2>
        </div>

        <div className="space-y-32 lg:space-y-40">
          {themes.map((theme, index) => (
            <div
              key={theme.label}
              className={`flex flex-col lg:flex-row gap-12 lg:gap-24 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
            >
              {/* Image / Layered Reality Side */}
              <div className="w-full lg:w-1/2 relative group">
                <div
                  className={`absolute inset-0 bg-secondary/5 rounded-3xl transform ${index % 2 === 0 ? "-rotate-3" : "rotate-3"
                    } scale-105 transition-transform duration-700 group-hover:rotate-0`}
                />

                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] transform transition-transform duration-700 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <img
                    src={theme.image}
                    alt={theme.label}
                    className="object-cover w-full h-full transform scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />

                  {/* Floating UI Overlay - The "Solution" */}
                  <div className={`absolute ${index % 2 === 0 ? "bottom-8 right-8" : "bottom-8 left-8"} z-20`}>
                    <div className="bg-white/95 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-4 max-w-[280px] transform transition-all duration-500 hover:-translate-y-2">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                        <theme.icon />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-0.5">
                          Return-It Solution
                        </p>
                        <p className="text-sm font-medium text-text-primary leading-tight">
                          {theme.badge}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-secondary"></div>
                  <span className="text-secondary font-medium tracking-wide uppercase text-sm">
                    {theme.label}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display text-text-primary mb-6 leading-tight">
                  {theme.scenario}
                </h3>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-base">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {theme.resolution}
                </div>
              </div>
            </div>
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
