# Return-It — Project Brief

> **Read this file first.** This is the single source of truth for all agents working on this project.

## What is Return-It?

A UK doorstep parcel return pickup service. Users connect their email (or upload a return label manually), and Return-It detects pending returns, aggregates them in a dashboard, schedules a pickup, and handles the rest — including label printing if needed. Think "Uber for returns."

**Target user**: UK online shoppers who hate queuing at the Post Office to return items.

**Core promise**: Your returns, handled — from doorstep to done.

**Product principles**:
- Fast to schedule (under 60 seconds from "I have a label" to booked pickup)
- Trust & transparency (clear pricing, tracking, proof of handover)
- Retailer-agnostic (works with Amazon, Shein, ASOS, etc.)
- Carrier-flexible (supports many carriers; doesn't rely on any single one)

---

## Product Vision (Finished Product)

### Two Entry Paths

Users always have two ways in — neither should dominate:

1. **Email Integration** (power path): Connect Gmail/Outlook → Return-It auto-detects return approvals, extracts labels, deadlines, and retailer info → populates a "Pending Returns" dashboard
2. **Manual Upload** (instant path): Upload a return label (PDF/photo), forward the email, or paste a return link — no account required to start

### Core User Journey

1. User initiates a return on a retailer site (e.g., Shein, Amazon, ASOS)
2. Retailer approves return and provides label + deadline
3. User opens Return-It → either connects email (auto-detect) or uploads label (manual)
4. Return-It shows detected returns in "Pending Returns" dashboard
5. User selects returns → confirms address, parcel count, label method (printed / need printing / QR)
6. Return-It offers pickup options: carrier-direct (cheap) or concierge (universal)
7. User pays → receives confirmation + calendar invite + reminders (T-24h, T-2h, "driver en route")
8. Parcel collected with proof-of-collection → dropped off at correct location
9. User tracks status: Scheduled → Collected → Dropped off → In transit → Completed

### Two Fulfillment Paths

| Path | When | What Happens | Ops Weight |
|------|------|-------------|-----------|
| **A: Carrier-direct** | Label's carrier supports pickup (e.g., Royal Mail) | Return-It schedules via carrier API, sends reminders, captures proof | Light |
| **B: Concierge pickup** | Carrier doesn't offer pickup, or user wants "just take it" | Return-It driver collects, prints label if needed, drops at correct location | Heavy |

### Key Features

| Feature | Description | Status |
|---------|------------|--------|
| Landing page + request flow | Marketing site + 3-step pickup form | Built (MVP) |
| Email integration | Gmail/Outlook scanning for return confirmations | Planned |
| Pending Returns dashboard | Aggregated view of all detected returns | Planned |
| Manual label upload | PDF/photo upload, email forward, link paste | Built (MVP) |
| Label printing service | Driver prints label on arrival, or QR fallback | Planned |
| Two-mode pricing | Carrier-direct (from £1.99) + Concierge (from £8.99) | Designed |
| Tracking timeline | Scheduled → Collected → Dropped off → Completed | Planned |
| Proof of collection | Photo + scan + timestamp at pickup | Planned |
| Multi-return bundling | Multiple parcels/retailers in one pickup | Planned |
| Reminder system | T-24h, T-2h email reminders via Vercel Cron + Resend | Planned |
| Return Cost Calculator | Free tool: "What is your return really costing you?" | Planned |
| Post-pickup referral | Two-sided £2 referral via WhatsApp | Planned |

---

## Pricing Model (Two-Mode)

### Mode 1: "We Book It" (Carrier-Direct)

For labels where the carrier supports collection (e.g., Royal Mail Parcel Collect).

- **£1.99–£2.99** platform convenience fee
- **+£1.50** optional label printing
- Monetizes: aggregation + reminders + scheduling friction removal
- Scales without driver constraints

### Mode 2: "Concierge Pickup" (Return-It Driver)

Universal service — works with any carrier/retailer.

- **£8.99–£12.99** base (1 parcel, depending on window)
- **+£1.50** per additional parcel (same address)
- Label printing included
- Proof-of-collection + proof-of-drop-off included

### Unit Economics (Concierge — Mode 2)

| Pickups/Hour | Cost/Pickup | Margin at £10.99 | Notes |
|-------------|------------|-------------------|-------|
| 2 | ~£12.61 | Loss | Not viable |
| 3 | ~£9.21 | ~£1.78 (16%) | Break-even territory |
| 4 | ~£7.51 | ~£3.48 (32%) | Target for launch zones |
| 5 | ~£6.49 | ~£4.50 (41%) | Density flywheel working |

**Key insight**: Density is everything. Product and ops must manufacture density through batching incentives, time window pricing, and geographic rollout strategy.

---

## Competitive Landscape

| Competitor | Strengths | Gap Return-It Fills |
|-----------|----------|-------------------|
| **Royal Mail Parcel Collect** | Cheap (30p/parcel) | Only Royal Mail parcels; no cross-carrier; no aggregation |
| **Collect+** | 14,000+ drop-off stores; in-store label printing | User still travels; drop-off only |
| **Parcel2Go** | Shipping broker; collection available | "Create shipment" flow, not return-label-first; not purpose-built for returns |
| **Orderly** | Email-connected order tracking + return alerts | Aggregation only; no universal pickup/drop-off/printing ops layer |

**Return-It's edge**: Aggregation + universal fulfillment (pickup + injection + printing) — the only service where "I already have a label" is the starting point.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router, `app/` directory) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Animation | Framer Motion 12 |
| Fonts | Plus Jakarta Sans (body) + Fraunces (display) via `next/font/google` |
| Backend | Next.js API Routes (Airtable + Cloudinary) |
| Email | Resend + React Email |
| Analytics | PostHog + Vercel Analytics |
| Deployment | Vercel (basePath: `/return-it`) |

## Design System

### Colors (oklch-based, defined in `globals.css`)

Colors use CSS custom properties with semantic role names. The brand identity is carried by typography and warm neutrals, not accent color — the primary color could change tomorrow.

- **Primary**: Deep coral `oklch(55% 0.18 25)` — CTAs + 2-3 accent highlights only
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

---

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
│   ├── HeroSection.tsx       # Hero with headline + dual CTAs + rotating friction lines
│   ├── QuickStartForm.tsx    # Size selector card → navigates to /request
│   ├── HowItWorks.tsx        # 3-step explainer with icons
│   ├── FrictionThemes.tsx    # 5 friction stories in Z-pattern layout
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
│   ├── PriceEstimate.tsx     # Price card with expandable breakdown
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
├── email.ts                  # Resend client + demo mode
├── airtable.ts               # Airtable API client (falls back to demo mode)
├── cloudinary.ts             # Cloudinary upload client (falls back to demo mode)
└── analytics.ts              # PostHog typed event wrapper

emails/
├── components/Layout.tsx     # Shared email brand wrapper
└── PickupConfirmation.tsx    # Pickup confirmation email template
```

## Data Flow

1. User selects size on landing → navigates to `/request?size=small-parcel`
2. 3-step form collects: file upload, size, count, postcode, address, pickup window, printing, name, email, phone
3. Form calculates price via `calculatePrice()` from `lib/pricing.ts`
4. On submit, stores to `sessionStorage` → navigates to `/result`
5. Result page reads from `sessionStorage`, shows quote + summary + willingness survey
6. Confirm → POSTs to `/api/submit` → Airtable (or console.log in demo mode)

## Current Pricing Logic (`lib/pricing.ts`)

> Note: This is the MVP pricing engine. The finished product will use two-mode pricing (see Pricing Model above).

- 3 zones: A (London), B (Major UK cities), C (Other)
- 4 sizes: Letter, Large Letter, Small Parcel, Medium Parcel
- Base prices: £4.99–£11.99 depending on zone + size
- Extras: +£2.50/additional parcel, +£1.50 for label printing
- Quote shows range: `total` to `total + £2.00` buffer

---

## Conventions

- All components are `"use client"` unless purely static
- Barrel exports via `index.ts` in each component directory
- Framer Motion for all animations (no CSS keyframe animations in components)
- SVG icons are inline functions within the component file that uses them
- Forms use controlled components with `useState`
- Errors cleared on field update
- UK postcode validation: `/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i`
- API routes validate server-side + log for ops

---

## Analytics Events

| Event | Page | Properties (no PII) |
|---|---|---|
| `landing_cta_clicked` | Landing | size_selected |
| `form_started` | Request Step 1 | source (landing/direct) |
| `form_step_completed` | Request | step, item_size, parcel_count |
| `form_step_back` | Request | from_step, to_step |
| `quote_viewed` | Result | quote_min, quote_max, zone, has_bulk_discount |
| `willingness_survey_responded` | Result | would_pay |
| `pickup_confirmed` | Result | zone, item_size, parcel_count, needs_printing |
| `confirmation_email_sent` | Server | success |

---

## Growth Strategy

### Pre-Signup: Return Cost Calculator

Free tool that calculates the true cost of a return (travel time, petrol, parking, missed deadlines). Users enter details → see "Your return is actually costing you £X" → share result via WhatsApp/X → friends click → loop restarts.

**Purpose**: Lead generation + viral loop before any account creation.

### Post-Pickup: Two-Sided Referral

After a successful pickup, prompt: "Give a friend £2 off their first pickup. You get £2 too." Share via WhatsApp (pre-formatted message with link). Triggered at the moment of highest satisfaction.

### Density Manufacturing

- Time window pricing: "Save £2 if you choose Tomorrow 12–4" to encourage batching
- Multi-parcel bundling at same address
- Geographic rollout starting with densest postcodes (Zone A: London first)
- Incentivize off-peak windows

---

## Project Documentation

| File | Purpose |
|------|---------|
| `PROJECT.md` | This file — the product spec (what we're building) |
| `CONTEXT.md` | State ledger — where we are, decisions, constraints, next steps. Read this second. |
| `BRAND-KIT.md` | Brand identity, positioning, voice/tone, email specs, social specs |
| `WEBSITE-BRIEF.md` | AI-builder-ready creative brief for marketing site (Framer/Lovable/Variants) |
| `Return-it project context.txt` | Full PRD, service blueprint, unit economics, competitive analysis |
| `.env.example` | All environment variables documented |

---

## Current State

- **Working**: Full landing page, 3-step request form, result/quote page, API routes, brand kit, email templates, analytics instrumentation
- **Not configured**: Airtable, Cloudinary, Resend, PostHog (all run in demo/console-log mode without API keys)
- **basePath**: Set to `/return-it` in `next.config.js`

---

## What's Next

### Phase 1: Marketing Site (Current)
- [x] MVP landing page + request flow
- [x] Brand kit + email templates + analytics
- [x] Website creative brief (`WEBSITE-BRIEF.md`)
- [ ] Build new marketing site using AI builder (Framer/Lovable/Variants) from the brief
- [ ] Return Cost Calculator (free tool + viral mechanic)

### Phase 2: Core Product
- [ ] Email integration (Gmail API / Microsoft Graph for return detection)
- [ ] Pending Returns dashboard
- [ ] Two-mode pricing implementation (carrier-direct + concierge)
- [ ] Payment integration (Stripe)
- [ ] Tracking timeline + proof of collection

### Phase 3: Operations
- [ ] Driver/partner app (scan, photo proof, status updates)
- [ ] Routing + capacity management
- [ ] Exception queue (missed pickup, unreadable label)
- [ ] Reminder emails (T-24h, T-2h via Vercel Cron + Resend)

### Phase 4: Growth
- [ ] Post-pickup referral program (two-sided £2)
- [ ] Return Deadline Tracker (free tool)
- [ ] Multi-return bundling optimization
- [ ] Geographic expansion beyond London

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
