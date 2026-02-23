# Task: Request Form UX & Visual Polish

**Status**: TODO
**Agent**: kimi
**Branch**: `agent/kimi/request-form-polish`
**Priority**: P0

---

## Context

The 3-step request form (`/request`) is functional but feels flat. Step transitions are instant (no animation), error states are basic, and the overall experience doesn't match the polish level we want. The form is the core conversion path — if it feels clunky, users abandon. See `PROJECT.md` for the full design system and data flow.

## Objective

Make the request form feel smooth, premium, and confidence-building with animated step transitions, better visual feedback, and micro-interactions.

## Files You Own (edit these)

- `app/request/page.tsx` (the main form page — step logic, layout, transitions)
- `components/form/FileUpload.tsx`
- `components/form/SizeSelector.tsx`
- `components/form/PickupWindowPicker.tsx`
- `components/form/ParcelCount.tsx`
- `components/form/PrintingToggle.tsx`

## Files You Must NOT Edit

- `app/page.tsx` (landing page — Gemini owns this)
- `app/result/*` (result page)
- `app/layout.tsx`
- `lib/pricing.ts` (pricing logic — Claude owns this)
- `lib/cloudinary.ts` (upload logic)
- `lib/airtable.ts` (submission logic)
- `components/landing/*` (Gemini owns these)
- `components/result/*`
- `components/ui/Button.tsx` (shared primitive — can use, don't edit)
- `components/ui/Input.tsx` (shared primitive — can use, don't edit)
- `tailwind.config.ts`

## Requirements

1. **Step Transitions**: Add animated transitions between the 3 form steps. Steps should slide/fade smoothly. Use Framer Motion `AnimatePresence` with `mode="wait"`. Direction should feel natural (forward = slide left, backward = slide right).

2. **Progress Indicator**: The current dot indicator works but could be more informative. Consider adding step labels or a progress bar. Keep it compact for mobile.

3. **FileUpload**: The drag-and-drop zone is good. Add a subtle animation when a file is successfully uploaded (not just a state change). The uploading spinner could pulse or have a progress feel.

4. **SizeSelector**: The 2×2 grid is fine. Add a subtle scale/bounce when selecting an option. The selected state transition should feel snappy.

5. **PickupWindowPicker**: The 3-column layout may be tight on mobile. Ensure it doesn't break at 375px. Consider stacking on very small screens.

6. **ParcelCount**: The stepper is well-built (it already has the bulk discount badge). Polish the number transition animation. The +/- buttons could have a more tactile press feel.

7. **PrintingToggle**: The toggle animation is good. Make sure the transition between on/off states is buttery smooth.

8. **Error States**: When validation fails, errors should animate in (not just appear). The field with the error should get subtle attention (gentle shake or border pulse).

9. **Price Preview**: The sticky header shows an estimate. Make this feel like a live-updating element — when the price changes (e.g., user adds parcels), animate the number transition.

10. **Mobile**: The form must be usable one-handed on a phone. Buttons should be large tap targets (min 44px). Input fields should not be obscured by keyboards.

## Acceptance Criteria

- [ ] Step transitions are animated (forward and backward feel different)
- [ ] File upload has success animation feedback
- [ ] Size selector options have selection micro-interaction
- [ ] Error states animate in smoothly
- [ ] All form components work correctly at 375px width
- [ ] The form still submits correctly (don't break the data flow)
- [ ] All animations respect `prefers-reduced-motion`
- [ ] `npm run build` succeeds with no errors

## Design Notes

- Standard easing: `ease: [0.16, 1, 0.3, 1]` (expo out)
- Spring physics for snappy interactions: `type: "spring", stiffness: 400, damping: 25`
- Keep animations fast — form interactions should feel instant. Max 300ms for micro-interactions, 400ms for step transitions.
- The primary coral color is for active/selected states. Don't overuse it.
- Error color is `var(--color-error)` / `text-error` / `border-error`

## When You're Done

1. Make sure the app builds with `npm run build`
2. Update the **Status** at the top of this file to `DONE`
3. Note any decisions or trade-offs you made in the section below

## Agent Notes

_[Agent fills this in when done — decisions made, trade-offs, anything the next person should know.]_
