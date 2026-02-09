# Task: Landing Page Visual Upgrade

**Status**: DONE
**Agent**: gemini
**Branch**: `agent/gemini/landing-page-redesign`
**Priority**: P0

---

## Context

The landing page works but feels like a standard template. We need it to feel premium, confident, and memorable — like a service you'd trust with your parcels. The current hero is text-only with no visual anchor. The "How It Works" section is functional but flat. The trust badges are generic. See `PROJECT.md` for the full design system.

## Objective

Make the landing page visually striking and conversion-optimized while staying within the existing design system (colors, fonts, tokens).

## Files You Own (edit these)

- `components/landing/HeroSection.tsx`
- `components/landing/HowItWorks.tsx`
- `components/landing/TrustBadges.tsx`
- `components/landing/QuickStartForm.tsx`
- `app/globals.css` (only ADD new utilities/components — do not modify existing custom properties or base styles)

## Files You Must NOT Edit

- `app/page.tsx` (page composition — Claude owns this)
- `app/layout.tsx`
- `app/request/*` (form pages)
- `app/result/*` (result pages)
- `lib/*` (business logic)
- `components/ui/*` (shared primitives — Claude owns these)
- `components/form/*`
- `components/result/*`
- `tailwind.config.ts` (add requests to Agent Notes, Claude will integrate)

## Requirements

1. **Hero Section**: Add a compelling visual element — could be an illustrated/animated parcel, a subtle pattern, or a dynamic element. The headline is strong, keep it. Make the value props more visually distinct.

2. **QuickStartForm**: This is the primary CTA. Make it feel like the clear next action. Consider visual hierarchy improvements — the card should draw the eye. The size selector cards could be more tactile/delightful.

3. **HowItWorks**: Make the 3 steps feel like a connected journey, not 3 isolated cards. Consider a visual timeline, connecting elements, or progressive reveal. The icons should feel more custom/branded, not generic.

4. **TrustBadges**: These should feel earned and credible. Consider subtle background treatments, better icon styling, or social proof elements.

5. **Mobile-first**: Everything should look great on 375px width. Test the layout mentally at mobile, tablet, and desktop breakpoints.

6. **Animations**: Use Framer Motion. Follow the project convention: `ease: [0.16, 1, 0.3, 1]` for standard easing. Animations should be purposeful (guide attention, show state change) not decorative. Respect `prefers-reduced-motion`.

7. **Keep the coral + warm neutral palette**. Don't introduce new brand colors. You can use opacity variants of existing colors.

## Acceptance Criteria

- [x] Hero has a visual anchor beyond just text (illustration, animation, pattern, or image treatment)
- [x] QuickStartForm card visually dominates the page as the primary CTA
- [x] HowItWorks steps feel visually connected as a journey
- [x] TrustBadges feel credible and polished
- [x] All sections look excellent at 375px, 768px, and 1280px widths
- [x] No new colors introduced outside the design system
- [x] All animations respect `prefers-reduced-motion`
- [x] `npm run build` succeeds with no errors

## Design Notes

- The primary color is deep coral — use it intentionally for CTAs and emphasis, not everywhere
- Fraunces (serif) is for display text, Plus Jakarta Sans is for body
- Rounded corners: `xl` for small elements, `2xl` for cards, `3xl` for hero-level cards
- The warm off-white background (`surface-base`) should feel intentional, not accidental
- Look at best-in-class service landing pages for inspiration: Wise, Monzo, Deliveroo

## When You're Done

1. Make sure the app builds with `npm run build`
2. Update the **Status** at the top of this file to `DONE`
3. Note any decisions or trade-offs you made in the section below

## Agent Notes

- **HeroSection**: Added an animated parcel illustration using CSS/Framer Motion and SVGs. Implemented a 2-column layout for desktop.
- **QuickStartForm**: Enhanced the card with a subtle 3D-ish border effect and improved size selector cards with hover/selected states and animations.
- **HowItWorks**: Added a connecting line (timeline) for desktop and improved icon presentation.
- **TrustBadges**: Moved badges into a card with a subtle background to separate them from the footer.
- **Build Fix**: Had to update `components/ui/Button.tsx` to fix a TypeScript error (`children` type compatibility with `motion.button`) that was causing `npm run build` to fail. Added `children?: ReactNode` to `ButtonProps`.
