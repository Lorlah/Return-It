# Return-It — Website Creative Brief

> **Purpose:** This document gives an AI website builder (Framer AI, Figma Make, Lovable, Variants, or similar) everything it needs to design and build a modern, animated marketing website for Return-It. It defines **what to build** — the narrative, copy, conversion goals, and brand constraints. **How** you lay it out, animate it, and visually execute it is your creative decision.

---

## THE PRODUCT

**Return-It** is a UK service that eliminates the friction of returning online purchases. We handle your returns from doorstep to drop-off — any retailer, any carrier, zero trips.

### Two Ways In (Both Lead to the Same Experience)

**Path A — Connect your email (power mode):**
Sign up and connect Gmail or Outlook. Return-It automatically scans for return confirmation emails and surfaces pending returns in a dashboard — with deadlines, label status, and retailer details. Select the ones you want returned, schedule a pickup, done.

**Path B — Upload a label (instant mode):**
Already have a return label? Skip the signup. Upload the PDF or snap a photo, enter your postcode, pick a time slot. Get a quote and request a pickup in 60 seconds. No account required.

Both paths converge on the same outcome: a courier comes to your door and handles everything.

### The Full Experience

1. **See all your pending returns** — Dashboard shows every return in one place: retailer, deadline, label status. Deadline warnings flag returns about to expire. (Email-connected users get this automatically; manual users add returns individually.)

2. **Select returns & schedule pickup** — Choose one or multiple returns. Pick tomorrow, this weekend, or next week — morning, afternoon, or evening. Add label printing if needed. Bundle returns from different retailers into one pickup.

3. **Two service tiers:**
   - **"We book it"** (from £1.99) — If the carrier supports collection, we schedule it for you. You pay a small fee for the convenience of aggregation + scheduling + reminders.
   - **"Concierge pickup"** (from £8.99) — Our courier comes to your door, collects your parcels, prints labels if needed, and drops everything at the correct return locations. Universal — works with any label from any carrier.

4. **Pay securely** — Stripe, Apple Pay, or Google Pay. Clear breakdown before payment.

5. **Track & prove** — Real-time status: Scheduled → Collected → Dropped off → In transit. Proof of collection (photo + timestamp). Reminders at T-24h and T-2h. Calendar integration.

6. **Get your refund faster** — Parcels enter the return network sooner = refunds arrive sooner.

### Target User

UK online shoppers — time-poor professionals, parents, anyone who shops online regularly and accumulates returns they never post. People who have literally thrown away money because the return trip was too inconvenient.

### Core Promise

**"We handle your returns. You get your money back."**

### Positioning

The Monzo/Wise of parcel returns — warm, modern, human-centered, and universal. Not a logistics company. A service that removes friction from everyday life. Where competitors make you create shipments, enter addresses, and compare carriers — Return-It starts from **the label you already have** and handles everything else.

### Competitive Edge

| Competitor | What They Do | The Gap |
|-----------|-------------|---------|
| **Royal Mail** | Cheap pickup (30p) for their own parcels | Only RM labels. No cross-carrier. No label printing. |
| **Collect+** | 14K drop-off locations + in-store label printing | You still have to travel there. Drop-off, not pickup. |
| **Parcel2Go** | Shipping broker — compare carriers, book shipments | "Create a shipment" flow. Not built for return labels you already have. |
| **Orderly** | Email-connected order tracking + return reminders | Tracks but doesn't collect. No pickup, no drop-off, no printing. |
| **Return-It** | **Doorstep pickup + label printing + drop-off injection — for any label, any carrier, any retailer.** Optional email detection finds the returns you forgot about. | — |

### CTA Destinations

- **Primary CTA:** The hero QuickStart form — users engage with the form directly on the landing page, then pricing is revealed after they provide details
- **Secondary CTA:** `/calculator` — "What are your returns really costing you?" free calculator tool (lead gen + engagement)

---

## DESIGN DIRECTION

### The Feeling

This website should feel like **relief**. The visitor arrives frustrated — returns piling up, deadlines expiring, money evaporating — and should leave thinking "why didn't this exist before?" The design moves from **tension → resolution**, visually and narratively.

### Vibe References

| Reference | What to Take | What NOT to Take |
|-----------|-------------|-----------------|
| **apple.com/airpods-pro** | Scroll-driven storytelling, cinematic pacing, massive type, product-in-motion | Product-centric focus (we're a service) |
| **linear.app** | Smooth entrance animations, precision, spatial hierarchy, confident UI showcases | Developer aesthetic, dark-only theme |
| **monzo.com** | Warmth, conversational copy, "real humans" energy, friendly feel | Banking-specific patterns, their specific coral |
| **wise.com** | Straight-talking clarity, bold numbers, challenger energy, clean pricing | Aggressive green palette |
| **arc.net** | Playful animation, scroll-triggered reveals, personality, confident whitespace | Browser metaphors |
| **royalmail.com** | Hero with embedded interactive form — visitors start their journey immediately without navigating away | Royal Mail's specific styling, carrier-centric framing |

### Design Principles

These are guardrails, not prescriptions. Use your best judgment for layout, animation, and visual execution.

**Animation philosophy:**
- Scroll-driven storytelling — sections reveal as the user scrolls
- Entrance animations with intention — nothing appears all at once
- Micro-interactions — buttons, cards, and interactive elements feel alive
- Smooth scrolling — the page should feel silky
- Easing: never linear. Prefer `power3.out` / `expo.out` / `cubic-bezier(0.16, 1, 0.3, 1)`
- Respect `prefers-reduced-motion` — fall back to simple fades

**Responsive principles:**
- Mobile-first — beautiful on mobile, immersive on desktop
- Sticky CTA on mobile after scrolling past hero
- Touch targets: minimum 44×44px
- No horizontal scroll on any viewport

**Visual approach:**
- Warm, modern, editorial feel — Fraunces serif + Jakarta Sans creates the signature
- Real photos (the messy problem) + product UI mockups (the clean solution)
- Depth and layers — background, mid-layer, foreground elements
- 90%+ of the page lives in warm neutrals; primary color accents only

**Creative freedom:** The sections below define what must be communicated and the exact copy. How you arrange it, what visual patterns you use, how elements animate in — that's your creative interpretation. Build something distinctive.

---

## BRAND SPECIFICATIONS

### Colors — Semantic System (Designed to Be Swappable)

Colors are defined by **role**, not hue. The current palette is provided as defaults — the design must work if primary changes to a different color entirely. Use CSS custom properties (`--color-primary`, etc.) throughout. Never let a specific hue become load-bearing for the design's identity. The identity comes from **typography, shape, space, and warmth** — not from one accent color.

**Current defaults:**

| Role | Hex | Usage |
|------|-----|-------|
| **Primary** | `#C75A3A` | CTAs, active states, key highlights, animated subline |
| **Primary Hover** | `#A84830` | Hover/pressed states |
| **Primary Light** | `#FDF0EC` | Soft background tint for badges/highlights (use sparingly) |
| **Secondary** | `#0D3D3D` | Dark sections, trust badges, system indicators, depth |
| **Secondary Light** | `#E6F0F0` | Alternate section backgrounds |
| **Surface Base** | `#FAF9F7` | Main page background (warm off-white) |
| **Surface Elevated** | `#FFFFFF` | Cards, modals, elevated surfaces |
| **Text Primary** | `#2D2926` | Headlines, body text |
| **Text Secondary** | `#6B5F56` | Supporting text |
| **Text Muted** | `#918780` | Captions, hints |
| **Border** | `#E5E0DC` | Dividers, card borders |
| **Success** | `#2D8A4E` | Confirmation states |

**Design principle:** The primary color **accents** — it doesn't dominate. 90%+ of the page should live in warm neutrals (off-white, white, warm grays, dark text) and the secondary dark color. Primary appears on: CTA buttons, the animated subline text, price highlights, and small badges. That's it. If you swapped `#C75A3A` for deep blue or forest green tomorrow, nothing should break visually.

### Typography (This IS the Brand)

| Role | Font | Fallback | Usage |
|------|------|----------|-------|
| **Display / Headlines** | **Fraunces** (variable, serif) | Georgia, serif | Page titles, hero text, section headings, prices |
| **Body / UI** | **Plus Jakarta Sans** (variable, sans-serif) | -apple-system, "Segoe UI", sans-serif | Everything else |

Both free on Google Fonts.

**Scale:** Hero headline: 64–80px desktop, fluid down to 36px mobile. Section heads: 40–56px. Body: 16–18px.

**Style:** Headlines in Fraunces should feel warm and editorial — like a magazine. Body in Jakarta: clean, readable. The serif/sans pairing is the strongest brand signal on the page. It should be distinctive even in grayscale.

### Shape Language

- Rounded corners: `16px` (inputs/buttons), `20px` (cards), `24px` (hero sections)
- Soft shadows with warm tint: `rgba(60, 50, 45, 0.08)`
- No hard edges. No sharp corners. Everything approachable.

### Logo

Wordmark: "Return-It" in Fraunces (display font), with a small parcel/box SVG icon. Icon uses primary color, text uses text-primary. The wordmark IS the logo.

---

## PAGE STRUCTURE & COPY

Build in this exact section order. Copy below is final — use verbatim.

---

### SECTION 1: Navigation

**Goal:** Persistent wayfinding + always-available CTA.

**Copy:**
- Logo: "Return-It" + parcel icon
- Links: "How it works" | "Pricing" (smooth scroll anchors)
- CTA button: **[Get Started]**
- Mobile: Hamburger → slide-out menu

**Content:** Sticky top bar. Transitions from transparent over hero to solid/frosted on scroll.

---

### SECTION 2: Hero

**Goal (CRO):** Immediate engagement. The visitor sees the value prop AND starts their return journey without leaving the page. The interactive form is the primary CTA — not a button that links elsewhere. Progressive pricing: users commit to the journey (select size, enter postcode) before seeing a price quote. This leverages commitment bias — by the time they see pricing, they've already invested effort.

**Copy:**

Headline (Fraunces, massive):
```
Your returns, handled.
```

Animated subline (cycles every 3s with smooth crossfade, in primary color):
```
We'll handle it.
No printer? We print the label.
Post office closed? We come to you.
Too heavy to carry? We collect it.
Three retailers? One pickup.
Missed the deadline? Never again.
```

Body text:
```
We pick up your returns from your door and handle the drop-off — any retailer, any carrier. Connect your email and we'll find your pending returns automatically, or just upload a label. Either way, zero trips.
```

Trust signals (below the form):
```
✓ From £1.99  ·  ✓ We print your label  ·  ✓ Evening & weekend pickups
```

**Content — QuickStart Form:**

An interactive card embedded in the hero with two tabs/paths:

**Tab 1: "Schedule a Pickup"**
- Parcel size selector (Small Parcel / Medium Parcel / Large Parcel / Heavy/Bulky — radio or card selection)
- Postcode input field (placeholder: "Enter your postcode")
- Submit: **[Get a Quote →]** (primary button)

**Tab 2: "I Have a Label"**
- Upload zone (drag-and-drop or click to upload — accepts PDF, image)
- Postcode input field (placeholder: "Enter your postcode")
- Submit: **[Get a Quote →]** (primary button)

Both paths lead to the request flow (`/request`) where pricing is revealed after the user has engaged. The form card should feel clean, elevated, and inviting — like a mini product experience right in the hero.

**Tone:** Confident, warm, immediately useful. The hero should feel like the visitor can DO something, not just read about it.

---

### SECTION 3: Product Showcase — "How It Works"

**Goal (CRO):** Show the full product experience so visitors understand what they're getting. Two paths (email-connected vs. label upload) so every visitor sees themselves in the product. Build confidence that the service is real, polished, and easy.

**Copy:**

Section intro:
```
Eyebrow: HOW IT WORKS
Headline: From label to collection in minutes.
Subtext: Connect your email and we'll find your returns automatically — or upload a label and skip straight to scheduling.
```

Step 1 — Start:
```
Title: Connect your email or upload a label
Description: Sign in with Google or Outlook and we'll scan for return confirmations from any retailer. Or skip the signup — just upload the label PDF or snap a photo and go.
```

Step 2 — Review:
```
Title: See what's pending
Description: Every return in one place — with deadlines, labels, and what needs doing. No more digging through emails or searching for that PDF.
```

Step 3 — Schedule:
```
Title: Bundle and book
Description: Select the returns you want collected. Pick a time slot — tomorrow, this weekend, or next week. Add label printing if you need it. One pickup handles everything.
```

Step 4 — Done:
```
Title: We collect. You relax.
Description: A courier arrives at your door. They handle the labels, collect the parcels, and drop everything at the correct locations. You get proof of collection and can track it all.
```

**Content:** 4-step walkthrough with product UI mockups showing the actual experience at each step. Retailer logos (Amazon, ASOS, Shein, Zara, John Lewis) should appear to reinforce universality. A progress indicator showing current step is encouraged.

**Tone:** Reassuring, clear, methodical. "We've thought of everything."

---

### SECTION 4: Pain Points — "Sound Familiar?"

**Goal (CRO):** Emotional resonance. The visitor sees their own frustration reflected back — using real customer language (sourced from Reddit, Mumsnet, Trustpilot). This section validates the problem before the solution sections that follow.

**Copy:**

Section intro:
```
Eyebrow: SOUND FAMILIAR?
Headline: The friction is real.
Subline (in secondary color): The solution is simple.
```

Story 1 — "Deadline Dread":
```
Label: THE DEADLINE DREAD
Scenario: "You bought it 27 days ago. The return window closes in 3 days. The post office closes at 5:30. You finish work at 6."
Resolution: We pick up evenings & weekends.
```

Story 2 — "The Two-Trip Trap":
```
Label: THE TWO-TRIP TRAP
Scenario: "No printer at home. A trip to the print shop, then a separate trip to the post office. Two trips for one return."
Resolution: We print the label and pick up the parcel. Zero trips.
```

Story 3 — "The Heavy Haul":
```
Label: THE HEAVY HAUL
Scenario: "A dehumidifier. A monitor. A piece of furniture. Can't carry it. Can't fit it on a bike. Can't get it to the shop."
Resolution: We handle heavy & bulky items. We come to you.
```

Story 4 — "Multi-Return Madness":
```
Label: MULTI-RETURN MADNESS
Scenario: "Three items from three retailers. Three different carriers. Your Saturday becomes a logistics tour — Hermes locker, Post Office, Evri drop-off."
Resolution: One pickup. All your returns. Sorted.
```

Story 5 — "Stuck With It":
```
Label: "STUCK WITH IT"
Scenario: "That dress is still in the bag on the floor. It's been 4 months. You've accepted the £60 loss. It's not the money anymore — it's the guilt."
Resolution: The guilt leaves with the parcel.
```

**Content:** 5 friction stories, each with a scenario, resolution, and accompanying imagery. Images should be warm, domestic UK scenes matching each scenario (clock/time pressure, hallway with parcels, large box in living room, scattered shopping bags, untouched shopping bag on bedroom floor). Each story should have a small floating card showing the Return-It solution (e.g., "Return deadline: 3 days · Pickup booked: Tomorrow 18:30").

**Tone:** Empathetic, slightly wry, recognizable. "We've been there too."

---

### SECTION 5: Return Cost Calculator (Lead-Gen Tool)

**Goal (CRO + Marketing):** This is a free, interactive tool that quantifies the cost of not returning items. It serves three purposes: (1) makes the problem visceral by putting a number on it, (2) captures email leads, (3) creates shareable "I've wasted £X on unreturned items" moments. This is the **engineering-as-marketing** play and the top-of-funnel growth loop.

**Copy:**

Section intro:
```
Eyebrow: FREE TOOL
Headline: What are your unreturned items really costing you?
Subtext: Most UK shoppers lose £100–£300 a year on returns they never post. Find out your number.
```

Calculator inputs (max 4 fields):
```
1. "How many items are you sitting on right now?" (stepper: 1–10+)
2. "Roughly what are they worth in total?" (quick presets: Under £50 / £50–£100 / £100–£200 / £200+)
3. "How many returns have you given up on in the last year?" (stepper: 0–10+)
4. "Enter your email to see your full breakdown" (email capture)
```

Output:
```
"You're sitting on approximately £[X] in unreturned items right now.
Over the past year, you've lost roughly £[Y] to returns you didn't post.
That's £[Y] that could be back in your account."

[Get Your Returns Handled →]   (CTA, primary)
```

Sharing mechanic:
```
"I've wasted £[Y] on unreturned items this year. 😳 Just found out with @returnit_uk's calculator."
[Share on X]  [Share on WhatsApp]  [Copy Link]
```

**Content:** Interactive calculator card embedded in the page. Inputs update the total in real-time. The £ total should be large, in Fraunces, with an animated count-up. Email capture is the last step — after the user has engaged and seen their number. Share buttons appear after the result. WhatsApp is the highest-priority share channel.

**Tone:** Eye-opening, slightly confrontational (in a friendly way). "Let's see the damage."

---

### SECTION 6: Transparent Pricing

**Goal (CRO):** Provide pricing information for visitors who scroll to learn more, reinforcing transparency and trust. This is **informational**, not the primary conversion mechanism — the hero QuickStart form handles conversion with progressive pricing. Visitors who reach this section are researching, not ready to click; give them the facts clearly.

**Copy:**

Section intro:
```
Eyebrow: SIMPLE PRICING
Headline: Two ways to return. Both effortless.
Subtext: Choose what works for you. No hidden fees. Cancel anytime before your pickup window.
```

Tier 1 — "We Book It":
```
Tagline: We schedule the carrier pickup for you
Price: From £1.99
Includes:
  · Carrier collection scheduled on your behalf
  · Pickup reminders (email + text)
  · All returns managed in one dashboard
  · Multi-return bundling
Add-on: +£1.50 label printing assistance
Best for: Labels where the carrier offers collection
```

Tier 2 — "Concierge Pickup" (recommended):
```
Tagline: Our courier collects and handles the drop-off
Price: From £8.99
Includes:
  · Doorstep collection at your chosen time
  · We drop off at the correct return locations for you
  · Label printing included
  · Proof of collection (photo + timestamp)
  · Real-time tracking
  · +£1.50 per additional parcel
Best for: Any carrier, any label — zero effort
```

Below both tiers:
```
"No payment until you confirm. No account needed for single pickups."
```

**Content:** Two pricing tiers presented clearly. The Concierge tier should be visually emphasized as the recommended option. Price numbers in primary color. Keep it clean and scannable — not a dense comparison table.

**Tone:** Straightforward, no-nonsense. Like Wise's pricing — clear and confident.

---

### SECTION 7: Trust & Social Proof

**Goal (CRO):** Eliminate remaining doubt. Prove universality, humanity, security, and real results. Trust elements should feel woven into the narrative, not like a corporate compliance section.

**Copy:**

Trust badges (4):
1. **"Any Retailer, Any Carrier"** — "Amazon, ASOS, Shein, Zara, John Lewis — we work with return labels from any shop, any logistics provider."
2. **"Real Humans"** — "We're personally handling every pickup right now. You'll get a text from a real person, not a bot."
3. **"Proof of Collection"** — "Photo, timestamp, confirmation text. Every pickup is documented. Your proof, instantly."
4. **"Your Data, Your Control"** — "Email scanning is optional and reads return emails only. Disconnect anytime. GDPR compliant."

Retailer logo strip:
```
Label: "Works with returns from any retailer"
Logos: Amazon, ASOS, Shein, Zara, John Lewis, H&M, Nike, Uniqlo, Next, Marks & Spencer
```

Testimonial (placeholder):
```
"I had £400 of unreturned items across four retailers. Return-It collected everything in one visit. I got £380 back in refunds."
— Lola, London
```

Referral teaser:
```
"After your pickup, share the love — refer a friend and you both get £2 off. We'll prompt you at the perfect moment."
```

**Content:** Trust badges with icons, auto-scrolling retailer logo strip, testimonial, and referral teaser. The referral tease plants a seed — the natural sharing moment is post-pickup relief, not during booking. Two-sided referral (£2/£2) shared primarily via WhatsApp.

**Tone:** Warm, credible, human. Not corporate — conversational.

---

### SECTION 8: Final CTA

**Goal (CRO):** Strong close. Repeat the core value prop. Address final objections inline. Drive conversion for visitors who've scrolled the full page.

**Copy:**

Headline (Fraunces, large):
```
Stop losing money on returns you never post.
```

Subtext:
```
Connect your email and we'll find them. Or upload a label and we'll collect it. From £1.99. Any retailer. Any carrier.
```

CTA row (two buttons):
```
[Get Started — Free]  (primary button, solid — prominent)
[I Have a Label →]    (secondary button, outline — on dark bg, use light outline)
```

Below CTAs:
```
No payment upfront. No commitment. Cancel anytime.
```

**Content:** Dark background section (secondary color, #0D3D3D) with light text. CTA button in primary color against the dark. This creates a confident, cinematic close.

**Tone:** Bold, decisive. The final push.

---

### SECTION 9: Footer

**Goal:** Provide navigation, contact info, and legal links. Maintain visual continuity with the final CTA section.

**Copy:**
- Logo wordmark (white variant)
- Links: How it Works | Pricing | Calculator | FAQ | Privacy | Contact
- Email: hello@return-it.co.uk
- "© 2026 Return-It. Made with care in the UK."
- Social: Instagram, TikTok, X (placeholder links)

**Tone:** Calm, simple, warm.

---

## RESPONSIVE BEHAVIOR

Key principles — adapt these to your layout decisions:

- **Mobile-first:** Everything must work beautifully on mobile. Stack content vertically. Scale type fluidly.
- **Sticky mobile CTA:** After scrolling past the hero, a persistent "Get Started" button appears at the bottom of the screen on mobile.
- **QuickStart form:** On mobile, the form card stacks naturally below the hero text. Tabs remain functional. Touch-friendly inputs.
- **Touch devices:** Replace hover states with tap/active states. Reduce animation complexity.
- **Breakpoints to verify:** 375px, 768px, 1024px, 1440px.

---

## TECHNICAL REQUIREMENTS

### Must-Have
- **GSAP + ScrollTrigger** — Scroll-driven animations, parallax
- **Smooth scrolling** — Lenis or native `scroll-behavior: smooth`
- **Google Fonts** — Fraunces (variable) + Plus Jakarta Sans (variable)
- **CSS custom properties** — All colors as `--color-primary`, `--color-secondary`, etc. for easy brand updates
- **Responsive images** — `<picture>` with WebP + fallback, or `srcset`
- **Lazy loading** — Below-fold images, videos, and calculator
- **Semantic HTML** — Proper heading hierarchy, landmarks, ARIA
- **Performance** — 90+ Lighthouse. No layout shifts. Optimize LCP.

### Nice-to-Have
- **Lottie animations** — Parcel icon, step icons, inbox-to-dashboard transformation
- **Video backgrounds** — Short ambient loops (doorstep, courier)
- **Cursor effects** — Custom cursor or follower on desktop
- **Magnetic buttons** — CTAs that subtly attract the cursor
- **Calculator interactivity** — Real-time number updates, animated totals

### Avoid
- **No parallax scrolljacking** — Scroll should feel natural, never hijacked
- **No autoplay audio**
- **No heavy 3D/WebGL** — GSAP + SVG is enough
- **No generic stock photos** — Authentic, warm-lit, UK-domestic
- **No corporate SaaS template feel** — Human, not enterprise
- **No color flooding** — Primary accents. Neutrals + dark sections dominate. The design works in grayscale; color just adds warmth.
- **No emojis as icons** — Use SVG icons (Heroicons, Lucide, or custom 2px stroke)
- **No hidden contact info** — Email and support link always accessible

### UX Quality Checklist
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover transitions: 150–300ms, smooth (`ease-out` or `cubic-bezier`)
- [ ] Touch targets: minimum 44×44px
- [ ] Focus states visible on all interactive elements (keyboard nav)
- [ ] Text contrast: 4.5:1 minimum (WCAG AA)
- [ ] `prefers-reduced-motion` respected — fall back to simple fades
- [ ] No layout shift on load (reserve space for async content, images, fonts)
- [ ] Responsive verified at: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on any viewport
- [ ] Form inputs have visible labels (not just placeholders)
- [ ] Loading/disabled states on CTA buttons during async operations

---

## CONTENT ASSETS NEEDED

Sourced or created separately — AI builder should use placeholder images/mockups matching these concepts:

1. **Hero parcel illustration** — Animated SVG: parcel box with flaps, label, tape
2. **Product UI mockups** — Floating cards: returns dashboard, scheduling UI, status timeline, notification pills, inbox scan view. Should look like real product screens.
3. **5 friction story images** — Warm, domestic UK scenes for each pain point
4. **Return Cost Calculator** — Interactive embedded component
5. **Retailer logos** — Amazon, ASOS, Shein, Zara, John Lewis, H&M, Nike, Uniqlo, Next, M&S
6. **Step icons** — Email/upload, dashboard, calendar, doorstep (animated SVG or Lottie)
7. **Trust icons** — Shopping bag, person, camera/check, shield/lock
8. **Ambient video** (optional) — 10s doorstep/courier loop, warm-graded

---

## SUMMARY FOR THE AI AGENT

Build a single-page marketing website for **Return-It**, a UK service that handles your online purchase returns from doorstep to drop-off.

### The 9 Rules

1. **Hero includes an interactive QuickStart form — the form IS the primary CTA.** Two tabs: "Schedule a Pickup" (parcel size → postcode → Get a Quote) and "I Have a Label" (upload → postcode → Get a Quote). Pricing is revealed progressively after users engage — not upfront. This leverages commitment bias for conversion. Inspired by Royal Mail's hero form pattern.

2. **Feel warm and modern** — Monzo meets Apple. Warm neutrals dominate (off-white, white, warm grays). Primary brand color (currently `#C75A3A`) only accents CTAs and highlights — never floods. Use CSS custom properties so the brand color can be swapped. Secondary (`#0D3D3D`) provides depth. Fraunces serif for headlines, Plus Jakarta Sans for body. The typography pairing and warm neutrals ARE the brand — not any single color.

3. **Sell the full product, two doors in** — Email integration, returns dashboard, two pickup tiers, label printing, proof of collection, tracking. But always present **two entry paths**: "Schedule a Pickup" (connect email, browse returns) AND "I Have a Label" (no account, upload and go). Neither dominates. The value prop is "we handle your returns" regardless of how you enter.

4. **Tell a story through scroll** — The page follows a narrative arc with progressive intensity. "How It Works" walks through 4 steps. Pain points validate the problem with real customer language. Nothing appears all at once. Use scroll-driven animation throughout.

5. **Include a lead-gen growth loop** — The Return Cost Calculator ("What are your unreturned items really costing you?") quantifies the problem, captures emails, and creates shareable "I've wasted £X" moments. Share buttons (especially WhatsApp) turn the calculator into a pre-signup viral loop: social post → calculator → engage → share → friend clicks → loop restarts.

6. **Plant the post-pickup sharing seed** — The website should tease the referral program (£2/£2 two-sided, via WhatsApp). The natural sharing moment is post-pickup relief, not during booking. The site plants the seed; the product triggers the share.

7. **Nail the narrative arc** — Hook (hero with form) → Product (how it works, 4 steps) → Pain (5 friction stories) → Engage (calculator) → Proof (pricing + trust) → Close (final CTA).

8. **Use your creative judgment for layout and visual execution** — This brief defines what to communicate, not how to lay it out. Choose the layout patterns, animation choreography, and visual techniques that best serve the content. The only constraints are the brand specs (colors, typography, shape language) and the copy. Make something distinctive.

9. **Ship it responsive and accessible** — Beautiful on mobile, immersive on desktop. Sticky mobile CTA after hero scroll. 44px touch targets, visible focus states, 4.5:1 contrast, `prefers-reduced-motion` respected.

The copy above is final. Design tokens are defaults (swappable). Build something that makes a visitor think: "Why didn't this exist sooner?"
