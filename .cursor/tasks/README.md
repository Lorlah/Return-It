# Task Specs

This folder contains task assignments for each agent. Each `.md` file is a self-contained spec.

## How to Use

### If you're an agent picking up a task:
1. Read `PROJECT.md` at the repo root first
2. Read your assigned task file in this folder
3. Create a branch: `agent/<your-name>/<task-slug>`
4. Do the work, only touching the files listed in your spec
5. When done, note it in your task file's status section

### If you're the lead (Claude) creating tasks:
1. Create a new `.md` file using `_TEMPLATE.md` as the base
2. Be explicit about which files the agent should edit
3. Be explicit about which files they should NOT edit
4. Include acceptance criteria so the agent knows when they're done

## Task Naming

```
<priority>-<agent>-<slug>.md
```

Examples:
- `01-gemini-landing-hero-polish.md`
- `02-claude-pricing-discount-logic.md`
- `03-codex-review-form-validation.md`

## Statuses

- `TODO` — Not started
- `IN PROGRESS` — Agent is working on it
- `DONE` — Work complete, ready for review/merge
- `MERGED` — Merged into main
