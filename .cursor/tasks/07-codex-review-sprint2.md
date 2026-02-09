# Task: Sprint 2 Code Review — Email + Analytics + Brand Kit

**Status**: TODO
**Agent**: codex
**Branch**: `agent/codex/review-sprint2`
**Priority**: P1

---

## Context

Sprint 2 added three capabilities to Return-It:
1. **Brand Kit** (`BRAND-KIT.md`) — formalized identity, positioning, and design specs
2. **Email confirmation** (Resend + React Email) — sends a branded email after pickup request submission
3. **Product analytics** (PostHog + Vercel Analytics) — tracks user funnel from landing to confirmation

This review covers all changes from Claude (infrastructure) and Gemini (email template design).

## Objective

Staff engineer code review of Sprint 2 changes. Fix Critical/High severity issues directly. Document Medium/Low issues.

## Review Scope

### Files to Review

**Email system:**
- `lib/email.ts` — Resend client with demo mode. Check: error handling, does email failure block form submission? Demo mode logging.
- `emails/components/Layout.tsx` — Shared email wrapper. Check: accessibility (alt text, semantic structure), dark mode compatibility.
- `emails/PickupConfirmation.tsx` — Confirmation template. Check: responsive rendering, accessible tables, all data variables used correctly.
- `app/api/submit/route.ts` — Email sending integration. Check: is it non-blocking? Does it gracefully handle Resend failures?

**Analytics system:**
- `lib/analytics.ts` — Event tracking wrapper. Check: **NO PII** in event properties (email, name, phone, address must NOT appear). Typed event names.
- `components/PostHogProvider.tsx` — PostHog initialization. Check: respects DNT, conditional on API key, no sensitive data captured.
- All pages with analytics events (`app/page.tsx`, `app/request/page.tsx`, `app/result/page.tsx`) — Check event naming consistency (snake_case), property types.

**Brand kit:**
- `BRAND-KIT.md` — Check: color hex values match `globals.css` definitions. Typography matches `tailwind.config.ts`. No contradictions with existing design system.

**Configuration:**
- `.env.example` — Check: all required vars documented, no actual secrets.
- `package.json` — Check: new dependencies are appropriate and latest.

### Review Checklist

- [ ] **PII in analytics**: No email, name, phone, or address in PostHog events
- [ ] **Email non-blocking**: Resend failure does not fail the form submission
- [ ] **Demo mode**: All new services (email, analytics) work gracefully without API keys
- [ ] **Email accessibility**: Alt text on images, semantic HTML structure, readable at 15px+
- [ ] **Email dark mode**: Colors work in dark mode (no pure black, coral contrasts well)
- [ ] **Brand consistency**: Email hex values match BRAND-KIT.md palette
- [ ] **Error handling**: Try/catch around all external service calls
- [ ] **Type safety**: No `any` types, proper interfaces for all data
- [ ] **Build passes**: `npm run build` succeeds with no errors or warnings

## Process

1. Review all files listed above
2. Fix Critical/High severity issues directly on your branch
3. Document all findings in the Agent Notes section below
4. Commit your changes and push

## When You're Done

1. Make sure `npm run build` passes
2. Update the **Status** at the top of this file to `DONE`
3. Document your findings below

## Agent Notes

_[Agent fills this in when done — categorized by severity: Critical, High, Medium, Low, Positive Observations]_
