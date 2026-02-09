# Task: Staff Engineer Code Review + Fixes

**Status**: TODO
**Agent**: codex
**Branch**: `agent/codex/review-fixes` (already created — checkout this branch)
**Priority**: P1
**Repo**: `Lorlah/Return-It`

---

## Context

Three agents worked on this codebase in parallel, now merged into `cee`:
- **Gemini** redesigned the landing page (`components/landing/*`)
- **Kimi** polished the request form (`app/request/page.tsx`, `components/form/*`)
- **Claude** improved business logic (`lib/*`, `app/api/*`, `components/result/*`, `components/ui/*`)

Your job is to review the merged result as a staff engineer, then **fix any Critical or High issues directly**. Push your review and fixes to the branch.

## Setup

```bash
git checkout agent/codex/review-fixes
npm install
```

## Objective

1. Review the full codebase for bugs, accessibility, performance, and code quality
2. **Fix** any Critical or High severity issues you find (commit directly)
3. Write your review in the Agent Notes section below
4. Push everything to the branch

## Review Scope

### Logic & Data Flow
- `lib/pricing.ts` — Pricing correct? Edge cases? Discount logic for 4+ parcels?
- `app/api/submit/route.ts` — Validation complete? Security concerns? Rate limiting?
- `app/api/upload/route.ts` — File validation? Size limits? Error handling?
- `app/request/page.tsx` — Form state management correct? Race conditions in upload?
- `app/result/page.tsx` — SessionStorage handling? Error states? XSS via parsed data?

### UI & Accessibility
- All `components/` files — ARIA attributes correct? Keyboard navigation works?
- Focus management during step transitions?
- Color contrast meets WCAG AA? (Primary coral on white backgrounds)
- Screen reader experience coherent?

### Performance
- Bundle size concerns? Unnecessary re-renders?
- Framer Motion — are animations causing layout thrashing?
- Component memoization needed anywhere?

### Code Quality
- TypeScript types correct and complete?
- Consistent patterns across components?
- Error handling comprehensive?
- Dead code or unused imports?

## Rules for Fixes

- **Critical bugs**: Fix immediately, commit with message `fix(critical): <description>`
- **High issues**: Fix if straightforward, commit with message `fix(high): <description>`
- **Medium/Low**: Document only, don't fix (Claude will handle these)
- Always run `npm run build` after fixes to verify nothing breaks

## Output Format

Write your review in the Agent Notes section using this structure:

```
## Critical (must fix before shipping)
- [Finding] — FIXED in commit <hash> / NOT FIXED (reason)

## High (should fix soon)
- [Finding] — FIXED / NOT FIXED

## Medium (improve when possible)
- [Finding]

## Low (nice to have)
- [Finding]

## Positive Observations
- [Things done well]
```

## When You're Done

1. Run `npm run build` and verify it passes
2. Update the **Status** at the top of this file to `DONE`
3. Write your full review in Agent Notes below
4. Commit this file: `git add . && git commit -m "review: staff engineer code review with fixes"`
5. Push: `git push origin agent/codex/review-fixes`

## Agent Notes

_[Codex: paste your full review here, then commit and push this file.]_
