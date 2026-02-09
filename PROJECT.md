# Return-It — Project Brief

> **Read this file first.** This is the single source of truth for all agents working on this project.

## What is Return-It?

A UK doorstep parcel return pickup service. Users upload their return label, choose a pickup slot, and a courier collects the parcel from their door. Think "Uber for returns." Currently an MVP landing page + request flow + quote/confirmation page.

**Target user**: UK online shoppers who hate queuing at the Post Office to return items.

## Tech Stack

| Layer         | Tech                                       |
|---------------|-------------------------------------------|
| Framework     | Next.js 14 (App Router, `app/` directory)  |
| Language      | TypeScript (strict)                        |
| Styling       | Tailwind CSS 3.4 + CSS custom properties   |
| Animation     | Framer Motion 12                           |
| Fonts         | Plus Jakarta Sans (body) + Fraunces (display) via `next/font/google` |
| Backend       | Next.js API Routes (Airtable + Cloudinary) |
| Deployment    | Vercel (basePath: `/return-it`)            |

## Design System

### Colors (oklch-based, defined in `globals.css`)
- **Primary**: Deep coral `oklch(55% 0.18 25)` — used for CTAs, active states, branding
- **Surfaces**: Warm off-white base `oklch(98% 0.005 60)`, pure white elevated
- **Text**: Warm-tinted neutrals (primary `oklch(20%)`, secondary `oklch(45%)`, muted `oklch(60%)`)
- **Borders**: Subtle warm grays (`oklch(90%)` default, `oklch(80%)` strong)
- **Semantic**: Success green `oklch(55% 0.15 145)`, Error coral `oklch(55% 0.2 25)`

### Typography
- Display sizes use `clamp()` for fluid scaling
- `font-display` = Fraunces (serif, for headings)
- `font-body` = Plus Jakarta Sans (sans-serif, for everything else)
- Size tokens: `display-xl`, `display-lg`, `display-md`, `body-lg`, `body-md`, `body-sm`, `caption`

### Component Patterns
- Rounded corners: `rounded-xl` (inputs/buttons), `rounded-2xl` (cards), `rounded-3xl` (hero cards)
- All interactive elements have `focus-visible:ring-2 focus-visible:ring-primary`
- Animations use `ease: [0.16, 1, 0.3, 1]` (expo out) as the standard easing
- Motion reduced for `prefers-reduced-motion: reduce`
- Cards use `border border-border` with white background

### Tailwind Custom Tokens (see `tailwind.config.ts`)
Colors, fonts, and sizes are all driven by CSS custom properties mapped through Tailwind. When styling, use the token names (`text-primary`, `bg-surface-base`, `border-border`, etc.), never raw oklch values.

## Architecture & File Map

```
app/
├── page.tsx                  # Landing page (composes landing components)
├── layout.tsx                # Root layout (fonts, metadata, viewport)
├── globals.css               # CSS custom properties + Tailwind layers
├── request/page.tsx          # 3-step form (item → pickup → contact)
├── result/page.tsx           # Quote display + confirmation + success state
├── api/
│   ├── submit/route.ts       # POST: saves pickup request to Airtable
│   └── upload/route.ts       # POST: uploads label file to Cloudinary

components/
├── landing/                  # Landing page sections
│   ├── HeroSection.tsx       # Hero with headline + value props
│   ├── QuickStartForm.tsx    # Size selector card → navigates to /request
│   ├── HowItWorks.tsx        # 3-step explainer with icons
│   ├── TrustBadges.tsx       # 4 trust signals grid
│   └── index.ts              # Barrel export
├── form/                     # Request form components
│   ├── FileUpload.tsx        # Drag-and-drop label upload
│   ├── SizeSelector.tsx      # 2×2 radio grid for parcel sizes
│   ├── PickupWindowPicker.tsx # 3-column pickup time selector
│   ├── ParcelCount.tsx       # Stepper with bulk discount badge
│   ├── PrintingToggle.tsx    # Toggle switch for label printing
│   └── index.ts              # Barrel export
├── result/                   # Result/quote page components
│   ├── PriceEstimate.tsx     # Coral price card with expandable breakdown
│   ├── QuoteSummary.tsx      # Summary rows (item, address, time, extras)
│   ├── WillingnessSurvey.tsx # Thumbs up/down price validation
│   └── index.ts              # Barrel export
├── ui/                       # Shared primitives
│   ├── Button.tsx            # Primary/secondary/ghost variants + loading
│   ├── Input.tsx             # Labeled input with error/hint states
│   ├── Card.tsx              # Default/elevated/outlined card wrapper
│   ├── RadioCard.tsx         # Selectable card with radio indicator
│   └── index.ts              # Barrel export
└── AgentationWrapper.tsx     # Dev-only analytics widget

lib/
├── pricing.ts                # Zone-based pricing engine + types + constants
├── airtable.ts               # Airtable API client (falls back to demo mode)
└── cloudinary.ts             # Cloudinary upload client (falls back to demo mode)
```

## Data Flow

1. User selects size on landing → navigates to `/request?size=small-parcel`
2. 3-step form collects: file upload, size, count, postcode, address, pickup window, printing, name, email, phone
3. Form calculates price via `calculatePrice()` from `lib/pricing.ts`
4. On submit, stores to `sessionStorage` → navigates to `/result`
5. Result page reads from `sessionStorage`, shows quote + summary + willingness survey
6. Confirm → POSTs to `/api/submit` → Airtable (or console.log in demo mode)

## Pricing Logic (`lib/pricing.ts`)

- 3 zones: A (London), B (Major UK cities), C (Other)
- 4 sizes: Letter, Large Letter, Small Parcel, Medium Parcel
- Base prices: £4.99–£11.99 depending on zone + size
- Extras: +£2.50/additional parcel, +£1.50 for label printing
- Quote shows range: `total` to `total + £2.00` buffer

## Conventions

- All components are `"use client"` unless purely static
- Barrel exports via `index.ts` in each component directory
- Framer Motion for all animations (no CSS keyframe animations in components)
- SVG icons are inline functions within the component file that uses them
- Forms use controlled components with `useState`
- Errors cleared on field update
- UK postcode validation: `/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i`
- API routes validate server-side + log for ops

## Current State

- **Working**: Full landing page, 3-step request form, result/quote page, API routes
- **Not configured**: Airtable and Cloudinary (runs in demo/mock mode)
- **Not installed**: `node_modules` — run `npm install` first
- **basePath**: Set to `/return-it` in `next.config.js`

## What's Next (Backlog)

These are the areas that need work. See `.cursor/tasks/` for specific assignments.

1. **UI/Design polish** — Landing page could be more visually striking, animations more delightful
2. **Mobile experience** — Test and optimize for small screens
3. **Request form UX** — Step transitions could use animations, better error states
4. **Result page** — Success state could be more celebratory
5. **Accessibility audit** — ARIA attributes exist but need screen reader testing
6. **Performance** — Image optimization, bundle size, Core Web Vitals
7. **SEO** — Structured data, OG images, meta tags
8. **Error handling** — Better error states, retry logic, offline support
9. **Testing** — Unit tests for pricing logic, E2E tests for form flow
10. **Analytics** — Track form abandonment, conversion, willingness-to-pay data

---

## Agent Collaboration Protocol

### How This Works

Multiple AI agents work on this project simultaneously. Each agent reads this file first, then picks up task specs from `.cursor/tasks/`.

### Agents & Roles

| Agent   | Role                    | Strengths                          | How it works |
|---------|------------------------|------------------------------------|-------------|
| Claude  | Lead engineer / PM      | Architecture, logic, integration, planning | Cursor IDE (this workspace) |
| Gemini  | Design engineer         | UI polish, visual design, animations, CSS | Cursor IDE (switch model) |
| Kimi    | Design engineer         | UI polish, visual design, animations, CSS | Cursor IDE (switch model) |
| Codex   | Staff engineer (review + fixes) | Code review, best practices, bug fixes | OpenAI Codex on GitHub — works on `agent/codex/*` branches, pushes directly |

### Rules

1. **Read `PROJECT.md` first** — every agent, every time
2. **Check your task spec** — your assignment is in `.cursor/tasks/`
3. **Stay in your lane** — only edit files listed in your task spec
4. **Don't edit files owned by another agent** — if your task says "DO NOT TOUCH", don't
5. **Work on your branch** — never commit directly to main
6. **Update your task status** — mark done when finished
7. **Commit and push** — especially Codex: commit your changes and `git push` so Claude can pull them

### Branch Naming

```
agent/<agent-name>/<task-slug>
```

Examples:
- `agent/gemini/landing-redesign`
- `agent/claude/pricing-v2`
- `agent/codex/review-form-logic`
