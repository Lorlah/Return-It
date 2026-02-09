# Return-It — Brand Kit

> **Source of truth for brand identity across all touchpoints.** Read this before designing any email template, social media asset, marketing page, or customer-facing communication.

---

## 1. Brand Positioning

### Who We Serve

Busy UK online shoppers who lose money because **layered friction** prevents them from returning items before the deadline expires. They are not lazy — they are time-poor professionals, parents, and anyone who shops online regularly and accumulates returns that never get sent back.

### What We Do

Doorstep return pickup for any retailer, any carrier. Upload your return label, choose a pickup slot, and we collect it from your door — or your office.

### The Core Promise

**"Upload your label. We pick it up. Zero trips."**

### The 5 Friction Themes

These are the real problems Return-It solves. Every piece of marketing, email copy, social content, and product messaging should connect to one or more of these:

#### 1. The Two-Trip Trap (Printing friction)
No printer at home means a trip to the print shop, then a trip to the post office. Two separate trips to return one item. And post offices don't print labels — you must sort that before you even get there. Return-It prints the label AND picks up the parcel. Zero trips.

**Customer language:** "I don't have a printer," "had to go to the library to print it," "couldn't be arsed going to two places"

#### 2. The Deadline Dread (Time friction for professionals)
You bought it 27 days ago. The return window closes in 3 days. The post office closes at 5:30. You finish work at 6. The carrier's pickup window is 9am–12pm when you're in meetings. Return-It picks up evenings, weekends, and from your office.

**Customer language:** "Missed the window," "kept meaning to do it," "the post office is only open when I'm at work"

#### 3. The Heavy Haul (Size/logistics friction)
Returning a dehumidifier, a dishwasher, or a large piece of furniture when you don't have a car is a genuine logistics project. Can't fit it on a bike, can't carry it to the post office, and you still need to print the label first. Return-It handles heavy and bulky items — you don't even need to carry it to the door.

**Customer language:** "It's too heavy to carry," "I don't drive," "I'd need someone to help me take it"

#### 4. The Multi-Return Madness (Fragmentation friction)
Three items from three retailers, three different return labels, three different drop-off points. Your Saturday morning becomes a logistics tour between a Hermes locker, a Post Office, and an Evri drop-off. Return-It: one pickup, all your returns, sorted.

**Customer language:** "So many different places," "each shop uses a different courier," "wasted my whole morning"

#### 5. "Stuck With It" (Emotional cost)
That dress you never wore is still in the bag on the floor. It's been 4 months. You've accepted the £60 loss. It's not about the money anymore — it's the guilt of knowing you could have returned it if you'd just... had the time. Return-It: the guilt leaves with the parcel.

**Customer language:** "Just gave up on it," "stuck with a thing I don't want," "basically threw money away"

### Competitive Positioning

| Competitor | Positioning | Visual Identity | Gap |
|---|---|---|---|
| **Royal Mail** | Heritage, institutional, "we've been here 500 years" | Red + gold, traditional | Fragmented; only works for RM labels; cheap but limited |
| **DPD** | Corporate-efficient, utilitarian | Red cube, corporate | Only their own parcels; no universal returns |
| **Parcel2Go** | Price comparison, shipping broker | Green, comparison-site feel | "Create a shipment" flow — not built for return labels |
| **Collect+** | Drop-off network convenience | Functional, budget | Still requires travel; 13K locations but YOU go to THEM |
| **Orderly** | Order tracking + return reminders | App-first, aggregation | Tracks but doesn't fulfil — no pickup service |

**Return-It's position:** The Monzo/Wise of returns — warm, modern, human-centered, and universal. Not a logistics company. A service that removes friction from your life.

### Design Aspiration

| Brand | What We Take | What We Don't |
|---|---|---|
| **Monzo** | Coral warmth, friendly tone, "real humans" feel, distinctive visual identity | Banking-specific patterns, neon coral (ours is deeper/warmer) |
| **Wise** | Straight-talking clarity, challenger energy, zero confusion | Bold green palette, aggressive positioning |
| **Deliveroo** | Modern design system, semantic color tokens, dedicated email design system | Food-category associations, teal palette |

---

## 2. Visual Identity

### Color Palette

#### Primary

| Token | OKLCH | Hex (approx) | RGB (approx) | Usage |
|---|---|---|---|---|
| `--color-primary` | `oklch(55% 0.18 25)` | `#c75a3a` | `199, 90, 58` | CTAs, active states, branding, email buttons |
| `--color-primary-hover` | `oklch(48% 0.16 25)` | `#a84830` | `168, 72, 48` | Hover states, pressed states |
| `--color-primary-light` | `oklch(92% 0.05 25)` | `#fdf0ec` | `253, 240, 236` | Backgrounds, highlights, badges |

**Color psychology:** Coral sits in the orange family — "energy, confidence, warmth." It says "action" without the aggression of red. It signals approachability, which counterbalances a logistics category that defaults to cold blue or institutional red. The warm undertone communicates care and personality.

#### Surfaces

| Token | OKLCH | Hex (approx) | Usage |
|---|---|---|---|
| `--surface-base` | `oklch(98% 0.005 60)` | `#faf9f7` | Page backgrounds |
| `--surface-elevated` | `oklch(100% 0.002 60)` | `#ffffff` | Cards, modals, elevated elements |

#### Text

| Token | OKLCH | Hex (approx) | Usage |
|---|---|---|---|
| `--text-primary` | `oklch(20% 0.01 60)` | `#2d2926` | Headlines, body text, primary content |
| `--text-secondary` | `oklch(45% 0.02 60)` | `#6b5f56` | Supporting text, descriptions |
| `--text-muted` | `oklch(60% 0.015 60)` | `#918780` | Captions, placeholders, hints |

#### Borders

| Token | OKLCH | Hex (approx) | Usage |
|---|---|---|---|
| `--border-default` | `oklch(90% 0.01 60)` | `#e5e0dc` | Default borders, dividers |
| `--border-strong` | `oklch(80% 0.015 60)` | `#c9c1ba` | Emphasized borders, focus-adjacent |

#### Semantic

| Token | OKLCH | Hex (approx) | Usage |
|---|---|---|---|
| `--color-success` | `oklch(55% 0.15 145)` | `#2d8a4e` | Success states, confirmations |
| `--color-error` | `oklch(55% 0.2 25)` | `#c75a3a` | Error states (same hue as primary, intentional) |

#### Email-Safe Palette

For HTML emails (no oklch support), use these hex values:

| Role | Hex | Notes |
|---|---|---|
| Primary CTA button | `#c75a3a` | White text on coral background |
| Primary CTA hover | `#a84830` | Darker coral for hover/pressed |
| Background | `#faf9f7` | Warm off-white body |
| Card background | `#ffffff` | White content areas |
| Text primary | `#2d2926` | Near-black, warm-tinted |
| Text secondary | `#6b5f56` | Medium warm gray |
| Text muted | `#918780` | Light warm gray |
| Border | `#e5e0dc` | Subtle warm border |
| Success | `#2d8a4e` | Green for confirmations |

### Typography

#### Font Stack

| Role | Font | Fallback | Usage |
|---|---|---|---|
| Display / Headlines | Fraunces (variable, serif) | Georgia, "Times New Roman", serif | Page titles, section headings, email headlines, hero text |
| Body / UI | Plus Jakarta Sans (variable, sans-serif) | -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif | Body copy, form labels, buttons, captions, email body |

#### Size Scale

| Token | Value | Usage |
|---|---|---|
| `display-xl` | `clamp(2.5rem, 5vw + 1rem, 4rem)` | Hero headlines only |
| `display-lg` | `clamp(2rem, 4vw + 0.5rem, 3rem)` | Page titles, section headings |
| `display-md` | `clamp(1.5rem, 3vw + 0.25rem, 2rem)` | Subsection headings |
| `body-lg` | `1.125rem` (18px) | Lead paragraphs, prominent body text |
| `body-md` | `1rem` (16px) | Standard body text |
| `body-sm` | `0.875rem` (14px) | Secondary text, descriptions |
| `caption` | `0.75rem` (12px) | Fine print, timestamps, labels |

#### Email Typography

Emails have limited font support. Use web-safe fallbacks:

| Element | Font | Size | Weight |
|---|---|---|---|
| Email headline | Georgia (Fraunces fallback) | 24–28px | Bold (700) |
| Email subheadline | -apple-system, sans-serif (Jakarta fallback) | 18px | Semi-bold (600) |
| Email body | -apple-system, sans-serif (Jakarta fallback) | 15–16px | Regular (400) |
| Email caption/footer | -apple-system, sans-serif | 13px | Regular (400) |

### Iconography

- **Style:** 2px stroke weight, rounded line caps and joins
- **Size:** 24×24px default, 20×20px for compact, 16×16px for inline
- **Color:** Always `currentColor` (inherits from parent text color, typically `text-primary` or `primary`)
- **Format:** Inline SVG (no icon library dependency)
- **Pattern:** See existing icons in `components/landing/HeroSection.tsx` and `components/landing/TrustBadges.tsx` for reference

### Logo

- **Format:** Wordmark — "Return-It" in Fraunces (font-display) alongside a package/box icon
- **Primary usage:** Left-aligned in headers, centered in email headers
- **Minimum size:** 120px wide
- **Clear space:** At least 1× the height of the "R" on all sides
- **Monochrome:** `text-primary` (#2d2926) on light backgrounds, white on dark/coral backgrounds
- **No standalone logomark yet** — the wordmark IS the logo for MVP

### Illustration Style

- Warm, abstract geometric shapes (floating cards, rounded rectangles with subtle shadows)
- Matches the hero section's animated floating elements
- No stock photography; no photorealistic people
- Use coral accent color sparingly in illustrations
- Rounded corners: `xl` (inputs/buttons), `2xl` (cards), `3xl` (hero-level elements)
- Shadows: Warm-tinted (`rgba(60, 50, 45, 0.06)` to `0.08`), never cool gray

---

## 3. Voice and Tone

### Brand Personality

**Friendly neighbor, not corporate call center.** Capable and no-nonsense. Like a helpful friend who happens to be really good at logistics. Think Monzo customer service — warm, clear, human.

| Trait | What it sounds like | What it does NOT sound like |
|---|---|---|
| Warm | "We've got your request" | "Your request has been received" |
| Direct | "We'll text you within 2 hours" | "A representative will be in contact shortly" |
| Capable | "We handle the rest" | "Simply follow the below steps to..." |
| Personal | "You're one of our first users!" | "Dear valued customer" |
| Honest | "No payment until we confirm the price" | "Terms and conditions apply*" |

### Headline Patterns

- Active voice, benefit-led: **"We pick up your returns so you don't have to queue"**
- Uses "you/your" — always second person
- Short, punchy — rarely more than 12 words
- Acknowledges the pain, then resolves it

**Good:** "Upload your label. We pick it up. Done."
**Good:** "One pickup. All your returns."
**Bad:** "The UK's leading return pickup aggregation service"
**Bad:** "Simplifying the returns process through innovative logistics solutions"

### Email Tone

- Personal and concierge-style
- First person plural ("we") — not passive voice
- Short paragraphs (2–3 sentences max)
- Clear next steps — always tell the user what happens next
- Sign off with warmth: "The Return-It team" or from a named person for founder emails

### Trust Language

These phrases should appear consistently across touchpoints:
- "Proof of collection" (not "delivery confirmation")
- "Real humans" (not "our team")
- "We're personally handling every pickup right now"
- "No payment required now"
- "Any retailer, any carrier"

### Words to Avoid

| Avoid | Use Instead |
|---|---|
| "Logistics provider" | "Courier" or "our driver" |
| "Carrier network" | "Any carrier" or just omit |
| "Schedule a collection" | "Book a pickup" |
| "Initiate your return" | "Get your return picked up" |
| "Dear valued customer" | First name, or "Hey there" |
| Multiple exclamation marks | One or none |
| "Simply" (patronizing) | Just describe the action |

---

## 4. Email Design Guidelines

### Layout

```
┌──────────────────────────────────────┐
│  ▄ Coral accent bar (4px)            │
│  Return-It (Fraunces wordmark)       │  ← max-width: 600px
├──────────────────────────────────────┤
│                                      │
│  Hey [Name],                         │  ← Personalized greeting
│                                      │
│  [Warm one-line summary]             │
│                                      │
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐    │
│  │  PICKUP SUMMARY              │    │  ← Rounded card with border
│  │  Item: Small Parcel          │    │
│  │  Parcels: 2                  │    │
│  │  Postcode: SW1A 1AA          │    │
│  │  Pickup: Tomorrow            │    │
│  │  Printing: Yes               │    │
│  │  ─────────────────────       │    │
│  │  Estimate: £7.99 – £9.99    │    │  ← Coral-highlighted price
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  WHAT HAPPENS NEXT                   │
│  1. We'll text you within 2 hours    │  ← Numbered steps
│  2. Courier calls 30 mins before     │
│  3. Proof of collection via text     │
│                                      │
│        [ View Your Request → ]       │  ← Primary CTA (coral button)
│                                      │
├──────────────────────────────────────┤
│  "We're personally handling every    │
│   pickup right now. Expect a text    │  ← Trust footer
│   from a real human."               │
│                                      │
│  Return-It · hello@return-it.co.uk  │  ← Contact + unsubscribe
│  Unsubscribe                         │
└──────────────────────────────────────┘
```

### Specifications

| Element | Spec | Notes |
|---|---|---|
| Max width | 600px | Single-column, centered |
| Body padding | 32px horizontal, 24px vertical | Generous whitespace |
| Header | 4px coral bar + wordmark, 24px padding | Not a heavy logo block |
| CTA button | `#c75a3a` bg, white text, 44px+ height, 200px+ width, 8px border-radius | Centered, one per email |
| Summary card | White bg, 1px `#e5e0dc` border, 16px border-radius, 24px padding | Contains all booking details |
| Price highlight | Fraunces/Georgia, 20px, coral color | Stands out in the summary |
| Footer text | 13px, `#918780` color | Contact, unsubscribe, trust message |

### Anti-Patterns

- No heavy image headers (slow to load, broken in Outlook)
- No marketing upsells in transactional emails (this is a trust email)
- No "Dear Customer" — always use the first name
- No multiple CTAs — one action per email
- No dark backgrounds (poor Outlook rendering)

### Dark Mode

- Use transparent PNG for logo, provide a white-on-transparent variant
- Avoid pure `#000000` — dark mode adds its own dark background
- Coral `#c75a3a` has strong contrast against both light and dark backgrounds
- Test in: Gmail (web + app), Apple Mail, Outlook (desktop + web)

### References

- Airbnb reservation confirmations: clean, warm, informative layout
- Uber ride receipts: clear summary card, timeline next steps
- Monzo transaction notifications: personal, minimal, branded
- Deliveroo order confirmations: friendly, actionable, well-structured

---

## 5. Social Media Guidelines

### Platform Priority

| Priority | Platform | Why | Skip For Now |
|---|---|---|---|
| 1st | **Instagram** | Visual storytelling, Reels reach, UK shopping demographic | |
| 2nd | **TikTok** | Discovery engine, "I can't believe this exists" reactions | |
| 3rd | **X (Twitter)** | Real-time opinions, UK culture commentary, shareable frustration | |
| | LinkedIn | Revisit later for office-pickup B2B angle | Skip for MVP |
| | YouTube | Needs production effort | Skip for MVP |
| | Facebook | Organic reach is minimal | Skip for MVP |

### Asset Dimensions

| Asset | Size | Notes |
|---|---|---|
| Instagram feed post | 1080×1350 (4:5) | 15% better CTR than square |
| Instagram/TikTok Story/Reel | 1080×1920 (9:16) | TikTok safe zones: avoid top 130px, bottom 440px |
| X (Twitter) post image | 1600×900 or 1080×1080 | |
| Profile picture (all platforms) | 400×400 min | Return-It logomark on coral background |
| Instagram highlight covers | 1080×1920 | Design 4–5: How It Works, Pricing, Reviews, Areas, FAQ |

### Content Typology

| Type | % | Examples |
|---|---|---|
| **Educational** | 40% | "3 things you didn't know about return deadlines," retailer return policy breakdowns, "how to check if your label needs printing" |
| **Narrative** | 25% | Founder story ("I had £400 of unreturned clothes"), customer stories, "A day in the life of a Return-It courier" |
| **Proof** | 20% | Pickup confirmation screenshots, "Just collected 6 parcels from one address," customer quotes, time-saved stats |
| **Community** | 10% | "What's your worst return horror story?", polls ("How many unreturned items are in your house right now?") |
| **Promotional** | 5% | Launch announcements, referral offers, area expansion news |

### Cadence

- **MVP target:** 3 posts/week (1 Reel/TikTok + 1 carousel/static + 1 text/story)
- **Plus engagement:** 15 min/day replying to comments and engaging on related posts
- **Style:** UGC-style, phone-shot aesthetic outperforms polished studio work for this category

### Visual Style for Social

- Use the coral palette as an accent, not a background flood
- Text overlays: Plus Jakarta Sans (or system sans-serif), white or `#2d2926` on contrasting backgrounds
- Rounded corners on overlay cards (matching the website's `rounded-2xl`)
- No stock photos — use screen recordings, mockups, or abstract illustrations
- Captions/subtitles on all video content (80%+ of social video is watched muted)

---

## 6. Growth Strategy Notes

### Primary Growth Loop

```
Frustration content (social/search)
  → Landing page / pricing tool
    → First booking
      → Delightful pickup experience
        → Post-pickup share moment (WhatsApp referral)
          → Friend's first booking → loop restarts
```

### Natural Sharing Moment

NOT during booking (the user is stressed, transactional). It's the **relief moment** — when the courier has collected the parcel and the user gets the "Pickup Complete" confirmation. That's when they think of their friend who complained about Evri last week.

### First 5 Marketing Actions (Priority Order)

1. **Customer language research** — 3 hours mining Reddit, Mumsnet, Trustpilot for real phrases. Feeds everything.
2. **Founder welcome email** — personal, reply-to-founder style. "I built Return-It because I had £200 of unreturned clothes sitting in my hallway." Replies = research + testimonials.
3. **Return cost calculator** — "What is your return really costing you?" Highest-leverage engineering-as-marketing investment.
4. **3 posts/week on Instagram + TikTok** — UGC-style, frustration-led content using the 5 themes.
5. **Post-pickup referral** — two-sided: referrer gets £2 off, friend gets £2 off. Share via WhatsApp (practical, private, not social media).

### Organic Target

60% organic / 40% paid in the first 6 months.

---

## Changelog

| Date | Change | Author |
|---|---|---|
| 2026-02-09 | Initial brand kit created | Claude |
