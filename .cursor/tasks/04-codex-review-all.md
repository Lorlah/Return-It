# Task: Staff Engineer Code Review

**Status**: TODO (blocked — run after tasks 01, 02, 03 are merged)
**Agent**: codex
**Branch**: review only — no code changes unless critical bugs found
**Priority**: P1

---

## Context

Three agents have been working on this codebase in parallel:
- **Gemini** redesigned the landing page (`components/landing/*`)
- **Kimi** polished the request form (`app/request/page.tsx`, `components/form/*`)
- **Claude** improved business logic (`lib/*`, `app/api/*`, `components/result/*`, `components/ui/*`)

Your job is to review the merged result as a staff engineer would. You're looking for bugs, inconsistencies, accessibility issues, performance problems, and code quality concerns.

## Objective

Produce a detailed code review with actionable findings categorized by severity (Critical / High / Medium / Low).

## Review Scope

Review ALL files in the project, but focus especially on:

### Logic & Data Flow
- `lib/pricing.ts` — Is the pricing correct? Edge cases? Discount logic?
- `app/api/submit/route.ts` — Validation complete? Security concerns?
- `app/api/upload/route.ts` — File validation? Size limits? Error handling?
- `app/request/page.tsx` — Form state management correct? Race conditions?
- `app/result/page.tsx` — SessionStorage handling? Error states?

### UI & Accessibility
- All `components/` files — ARIA attributes correct? Keyboard navigation works?
- Focus management during step transitions?
- Color contrast meets WCAG AA?
- Screen reader experience makes sense?

### Performance
- Bundle size concerns? Unnecessary re-renders?
- Images/assets optimized?
- Framer Motion — are animations causing layout thrashing?

### Code Quality
- TypeScript types correct and complete?
- Consistent patterns across components?
- Error handling comprehensive?
- No dead code or unused imports?

## Output Format

Write your review as a markdown document. Use this structure:

```markdown
## Critical (must fix before shipping)
- [Finding with file path and line reference]

## High (should fix soon)
- [Finding]

## Medium (improve when possible)
- [Finding]

## Low (nice to have)
- [Finding]

## Positive Observations
- [Things done well worth noting]
```

## Files You May Edit

- This task file (to add your review)
- You may create a `REVIEW.md` at the repo root

## Files You Must NOT Edit

- All source code files — this is a review task, not a fix task
- Exception: if you find a CRITICAL bug (data loss, security vulnerability), you may fix it and note the change

## When You're Done

1. Update the **Status** at the top of this file to `DONE`
2. Paste your full review in the Agent Notes section below

## Agent Notes

_[Codex pastes the full review here.]_
