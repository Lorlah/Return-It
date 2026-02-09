# Task: Brand Kit Refinement + Email Template Design

**Status**: TODO
**Agent**: gemini
**Branch**: `agent/gemini/brand-email-template`
**Priority**: P0

---

## Context

Return-It now has a comprehensive brand kit (`BRAND-KIT.md`) that defines positioning, visual identity, voice/tone, and email specifications. A baseline email confirmation template has been created in `emails/PickupConfirmation.tsx` using React Email components. Your job is to make both visually excellent — bringing the same design quality you showed on the landing page to the email template and brand kit.

## Objective

Refine the brand kit's visual identity sections and elevate the email confirmation template to be a beautifully branded, responsive email that reinforces trust and matches the Return-It design aesthetic.

## Files You Own (edit these)

- `emails/PickupConfirmation.tsx` — The main email template. This is a React Email component. Redesign the layout, colors, typography, and visual hierarchy to match the brand kit. Make it feel warm, personal, and premium.
- `emails/components/Layout.tsx` — The shared email wrapper. Improve the header, footer, and overall structure if needed.
- `BRAND-KIT.md` — Only the **Visual Identity** (§2) and **Illustration Style** sections. Add visual design expertise: refine the extended palette, improve illustration style guidance, add any design patterns you think are missing.

## Files You Must NOT Edit

- `lib/email.ts` (email infrastructure — Claude owns)
- `lib/analytics.ts` (analytics infrastructure — Claude owns)
- `components/PostHogProvider.tsx` (analytics — Claude owns)
- `app/api/submit/route.ts` (API integration — Claude owns)
- `app/layout.tsx` (root layout — Claude owns)
- `app/page.tsx`, `app/request/page.tsx`, `app/result/page.tsx` (pages — Claude owns)
- `package.json`, `tsconfig.json`, `next.config.js` (config — Claude owns)
- `components/landing/*`, `components/form/*`, `components/result/*`, `components/ui/*` (unchanged this sprint)

## Requirements

### Email Template (`emails/PickupConfirmation.tsx`)

1. **Visual hierarchy**: The email should have clear sections — greeting, pickup summary, price, next steps, CTA, trust footer. Use the brand kit's email layout diagram as a guide.

2. **Brand consistency**: Use the email-safe hex colors from BRAND-KIT.md §2. Primary coral `#c75a3a`, text `#2d2926`, secondary `#6b5f56`, muted `#918780`, border `#e5e0dc`, surface `#faf9f7`.

3. **Typography**: Headlines in Georgia (Fraunces fallback), body in `-apple-system, Segoe UI, sans-serif` (Plus Jakarta Sans fallback). Sizes: headline 24-28px, body 15-16px, caption 13px.

4. **Summary card**: The pickup details should be in a visually distinct card with border, rounded corners, and clean label/value alignment.

5. **Price estimate**: Should stand out — use coral color, larger font (Georgia/Fraunces, 20px+).

6. **"What happens next" section**: 3 numbered steps with coral step numbers. Should feel like a connected timeline, not just a list.

7. **CTA button**: Coral background `#c75a3a`, white text, 44px+ height, 200px+ width, `border-radius: 12px`, centered.

8. **Trust footer**: Warm background (`#fdf0ec`), centered text: "We're personally handling every pickup right now. Expect a text from a real human."

9. **Responsive**: Must render well in Gmail, Apple Mail, Outlook. Single-column, max-width 600px. Test mental model: what does this look like on an iPhone?

10. **Dark mode**: Coral has good contrast against dark backgrounds. Use transparent PNG for any images. Avoid pure `#000000`.

11. **Tone**: Warm, personal, concierge-style. "Hey [firstName]," not "Dear Customer." See BRAND-KIT.md §3 for voice guidelines.

### Brand Kit Refinement (`BRAND-KIT.md`)

1. Review the Visual Identity section (§2) with your design expertise
2. Add any missing design guidance that would help other agents
3. Improve the illustration style description if you have better ideas
4. Do NOT change: positioning (§1), voice/tone (§3), growth strategy (§6) — Claude owns those

## Acceptance Criteria

- [ ] Email template looks premium and branded (not generic/template-y)
- [ ] All colors match the brand kit email-safe palette exactly
- [ ] Email renders well at 600px width (desktop preview)
- [ ] Email is readable and well-structured at 375px width (mobile)
- [ ] CTA button is prominent and accessible
- [ ] Summary card is clean and scannable
- [ ] Price estimate stands out visually
- [ ] Trust footer is present and warm
- [ ] `npm run build` succeeds with no errors
- [ ] Brand kit visual sections are improved (not just unchanged)

## Design Notes

- Reference the landing page you designed (`components/landing/HeroSection.tsx`) for the floating card aesthetic and color usage
- The success screen in `app/result/page.tsx` (lines 234-288) has the right tone — "You're all set, [name]!" with the coral checkmark
- Think about: what would Monzo's or Airbnb's confirmation email look like if they did parcel pickups?
- The email-safe font stack limits what you can do with display typography — Georgia is the best serif fallback. Lean into spacing, color, and layout for visual impact.

## When You're Done

1. Make sure the app builds with `npm run build`
2. Update the **Status** at the top of this file to `DONE`
3. Note any decisions or trade-offs you made below

## Agent Notes

_[Agent fills this in when done]_
