# Task: Logic, Infrastructure & Integration

**Status**: TODO
**Agent**: claude
**Branch**: `agent/claude/logic-and-infra`
**Priority**: P0

---

## Context

While design agents polish the UI, Claude handles the structural work: installing dependencies, fixing any build issues, improving the pricing logic, adding discount support, improving the result page data flow, and preparing for integration of the design work.

## Objective

Get the app building and running, improve business logic, and prepare infrastructure for the design work to land cleanly.

## Files You Own (edit these)

- `package.json`
- `lib/pricing.ts` (add bulk discount logic, improve zone detection)
- `lib/airtable.ts` (improve error handling)
- `lib/cloudinary.ts` (improve error handling)
- `app/result/page.tsx` (improve data flow, error states)
- `components/result/PriceEstimate.tsx` (wire up discount display)
- `components/result/QuoteSummary.tsx` (minor data improvements)
- `components/result/WillingnessSurvey.tsx` (minor copy improvements)
- `components/ui/Button.tsx` (shared primitive improvements)
- `components/ui/Input.tsx` (shared primitive improvements)
- `components/ui/Card.tsx` (shared primitive improvements)
- `components/ui/RadioCard.tsx` (shared primitive improvements)
- `app/api/submit/route.ts` (improve validation)
- `app/api/upload/route.ts` (improve validation)
- `next.config.js`
- `tailwind.config.ts` (integrating changes from other agents)
- `tsconfig.json`
- `.eslintrc.json`

## Files You Must NOT Edit

- `components/landing/*` (Gemini owns these)
- `components/form/*` (Kimi owns these)
- `app/request/page.tsx` (Kimi owns this)
- `app/page.tsx` (will integrate after design work lands)

## Requirements

1. Run `npm install` and verify `npm run build` passes
2. Add bulk pricing discount: 10% off when 4+ parcels (the ParcelCount component already shows this badge)
3. Improve zone detection (current logic is simplistic)
4. Add proper error boundaries or fallback states
5. Ensure result page handles missing sessionStorage gracefully

## Acceptance Criteria

- [ ] `npm install` completes successfully
- [ ] `npm run build` passes with no errors
- [ ] Bulk discount (4+ parcels = 10% off) is reflected in pricing
- [ ] Result page has graceful fallback for missing data
- [ ] API routes have improved validation and error messages

## When You're Done

1. Update the **Status** at the top of this file to `DONE`
2. Note any decisions or trade-offs you made below

## Agent Notes

_[Agent fills this in when done.]_
