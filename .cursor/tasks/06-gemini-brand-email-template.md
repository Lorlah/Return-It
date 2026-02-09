# Task: Landing Page Visual Polish + Email Template Design + Brand Kit Refinement

**Status**: TODO
**Agent**: gemini
**Branch**: `agent/gemini/landing-email-brand`
**Priority**: P0

---

## Context

Return-It's brand kit (`BRAND-KIT.md`) now defines 5 friction themes, competitive positioning, and a rich identity. Claude has updated the landing page with the correct copy, content, and page structure — but the **visual design needs your touch**. Specifically:

1. **New "FrictionThemes" component** (`components/landing/FrictionThemes.tsx`) — has the right content (5 scenarios with customer language + resolutions) but needs visual design elevation
2. **Updated HeroSection** (`components/landing/HeroSection.tsx`) — new headline with rotating friction lines, but the animation choreography and layout could be improved
3. **Updated TrustBadges** (`components/landing/TrustBadges.tsx`) — new friction-specific copy, same visual structure
4. **Email template** (`emails/PickupConfirmation.tsx`) — baseline template, needs premium branded design
5. **Brand kit visual sections** (`BRAND-KIT.md` §2) — add your design expertise

The page flow is now: Hero → FrictionThemes → QuickStartForm → HowItWorks → TrustBadges → Footer.

## Objective

Elevate the visual design of the landing page and email template to feel premium, branded, and distinctive — matching the warm, modern, human-centered identity in the brand kit. Apply the frontend design skill principles: bold aesthetic direction, intentional motion, visual rhythm through varied spacing, no generic AI patterns.

## Files You Own (edit these)

### Landing Page (visual polish — keep all copy/content as-is)

- `components/landing/FrictionThemes.tsx` — This is new and needs the most design attention. The 5 friction themes are the emotional core of the page. Consider:
  - Breaking out of the uniform card grid pattern (the skill says "DON'T use identical card grids")
  - Varied visual weight — some themes could be larger/more prominent than others
  - Consider an asymmetric layout: left-aligned text, visual elements that break the grid
  - The scenarios should feel personal and relatable, not corporate/listy
  - Subtle animation on scroll (staggered reveals, but cap total stagger time)
  - The resolution line (coral text) should land with impact — spacing and weight matter

- `components/landing/HeroSection.tsx` — Polish the rotating friction lines animation. Consider:
  - The AnimatePresence cycling — is the timing right? The easing?
  - Could the floating illustration elements better reinforce the "zero trips" message?
  - The feature bullets ("From £4.99", "We print your label", "Evening & weekend pickups") — visual styling

- `components/landing/TrustBadges.tsx` — Keep the structure, but consider if the icons should change to better match the new copy ("Heavy items? Handled" and "Multiple returns, one pickup" may deserve different icons)

- `components/landing/HowItWorks.tsx` — Optional light touch if you see opportunities

### Email Template

- `emails/PickupConfirmation.tsx` — The main email template. Redesign layout, colors, typography, visual hierarchy to match the brand kit. Make it feel warm, personal, premium.
- `emails/components/Layout.tsx` — Shared email wrapper. Improve header, footer, structure if needed.

### Brand Kit

- `BRAND-KIT.md` — Only §2 (Visual Identity) and illustration style sections. Add design expertise: extended palette, illustration guidance, animation principles, design patterns.

## Files You Must NOT Edit

- `lib/email.ts`, `lib/analytics.ts`, `components/PostHogProvider.tsx` (infrastructure — Claude owns)
- `app/api/submit/route.ts` (API — Claude owns)
- `app/layout.tsx`, `app/page.tsx`, `app/request/page.tsx`, `app/result/page.tsx` (pages/routing — Claude owns)
- `package.json`, `tsconfig.json`, `next.config.js` (config — Claude owns)
- `components/form/*`, `components/result/*`, `components/ui/*` (unchanged this sprint)
- `BRAND-KIT.md` §1 (positioning), §3 (voice/tone), §5 (social), §6 (growth strategy) — Claude owns the strategy sections

## Design Direction (from frontend-design skill)

- **Tone**: Warm/refined minimalism — not maximalist, not brutalist. Think Monzo meets Airbnb. Confident white space, purposeful color accents.
- **The unforgettable thing**: The FrictionThemes section. A visitor should think "that's literally me" within 3 seconds of scrolling to it. The emotional resonance is what they'll remember.
- **Avoid AI slop**: No identical card grids, no icon-above-heading-above-text repeated 5x, no glassmorphism, no gradient text, no cards-inside-cards.
- **Motion**: Expo easing (`cubic-bezier(0.16, 1, 0.3, 1)`), staggered scroll reveals with capped total time. One well-orchestrated entrance > scattered micro-interactions.
- **Colors**: Coral `oklch(55% 0.18 25)` is the hero — use it intentionally for emphasis, not as a flood. Warm-tinted neutrals for text and borders.

## Landing Page Design Requirements

### FrictionThemes Section

1. **NOT a 5-card grid.** Each theme has different emotional weight. "Stuck With It" (guilt) and "Deadline Dread" (urgency) are the strongest — they should get more visual space.
2. The customer-language scenarios should feel like someone talking to you, not bullet points in a card
3. The coral resolution lines should feel like relief — the design should create a contrast between the problem (heavier, darker) and the resolution (lighter, coral, confident)
4. Consider: could one or two themes be pulled out as hero-sized callouts while the rest are more compact?
5. Left-aligned text. Do NOT center-align the scenarios.
6. The "Sound familiar?" section header should feel like an empathetic question, not a marketing headline

### Hero

1. The rotating friction lines should feel natural — smooth crossfade, not jarring
2. The floating illustration can evolve — "24h" badge was changed to "Zero trips" — make sure it reads well
3. Feature bullets should have enough visual weight to be noticed but not compete with the headline

### Trust Badges

1. Review if the current icons (Shield, Refresh/arrows, Lock, Clock) match the updated copy
2. "Heavy items? Handled" — the lock icon doesn't fit. Consider a weight/box icon.
3. "Multiple returns, one pickup" — the clock icon doesn't fit. Consider a stack/layers icon.

## Email Template Requirements

(Same as before — see the detailed specs below)

1. **Visual hierarchy**: Greeting → pickup summary card → price → "what happens next" steps → CTA → trust footer
2. **Brand colors**: Coral `#c75a3a`, text `#2d2926`, secondary `#6b5f56`, muted `#918780`, border `#e5e0dc`, surface `#faf9f7`
3. **Typography**: Headlines in Georgia, body in `-apple-system, sans-serif`. Sizes: headline 24-28px, body 15-16px, caption 13px.
4. **Summary card**: Visually distinct with border, rounded corners, clean label/value alignment
5. **Price estimate**: Coral, Georgia/serif, 20px+
6. **Steps**: 3 numbered steps with coral numbers. Timeline feel, not just a list.
7. **CTA button**: `#c75a3a` bg, white text, 44px+ height, 200px+ min-width, 12px border-radius
8. **Trust footer**: `#fdf0ec` bg, centered: "We're personally handling every pickup right now."
9. **Responsive**: Renders in Gmail, Apple Mail, Outlook. 600px max-width. Looks good on iPhone.
10. **Dark mode**: Coral contrasts well against dark. No pure `#000000`.
11. **Tone**: "Hey [firstName]," — warm, concierge-style

## Acceptance Criteria

### Landing Page
- [ ] FrictionThemes section is visually distinctive — NOT an identical-card grid
- [ ] Scenarios feel personal and relatable (reading experience, not scanning bullets)
- [ ] Coral resolutions create visual contrast with the problem text
- [ ] Hero rotating lines animate smoothly
- [ ] Trust badge icons match their new copy
- [ ] Page feels cohesive — all sections share the same visual language

### Email
- [ ] Template looks premium and branded (not generic)
- [ ] All colors match brand kit email-safe palette
- [ ] Renders at 600px (desktop) and 375px (mobile)
- [ ] CTA button prominent and accessible
- [ ] Summary card clean and scannable
- [ ] Trust footer present and warm

### Build
- [ ] `npm run build` passes with no errors
- [ ] Brand kit visual sections are improved

## Design References

- **Landing page you already designed**: The floating card aesthetic, the coral accent usage, the trust badges layout — your previous work is the benchmark.
- **Result page success state** (`app/result/page.tsx` lines 234-288): "You're all set, [name]!" with coral checkmark — the right emotional tone.
- **Brand aspirations**: Monzo (warmth), Wise (clarity), Deliveroo (modern design system).
- **Email references**: Airbnb reservation confirmations, Uber ride receipts, Monzo notifications.

## When You're Done

1. `npm run build` passes
2. Update the **Status** at the top of this file to `DONE`
3. Note your design decisions and trade-offs below

## Agent Notes

_[Agent fills this in when done]_
