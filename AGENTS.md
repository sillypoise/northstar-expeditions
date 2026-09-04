# Repo Agent Context

<!-- BEGIN MANAGED GUIDE HEADER -->
This repository uses the pi guide system.

## Guide Activation Contract

Active guides for this repository are defined in:

- `.pi/guides.json` — canonical machine-readable guide selection
- installed pi guide package extension — resolves and injects active guides into the system prompt

The pi guide package can be made available either:

- globally from `~/.pi/agent/settings.json`, or
- repo-locally from `.pi/settings.json`

Repo-local `AGENTS.md` supplements the guide system with repository-specific context.
It does not define the canonical active guide set.

## Authoring Rules for This File

Use this file for:

- repository architecture facts
- build, test, and validation commands
- local workflow expectations
- repository-specific constraints
- durable notes that help future tasks in this repo

Do not use this file for:

- reusable cross-repo guide content
- large generic policy documents
- secrets, tokens, or credentials
- machine-readable guide selection state

If a rule should apply across multiple repositories, promote it into the guide package instead of
only documenting it here.
<!-- END MANAGED GUIDE HEADER -->

## Repo-Specific Context

<!-- BEGIN REPO CONTEXT -->
- Purpose: Portfolio demonstration of premium frontend and marketing execution through a fictional
  adventure-travel discovery and planning experience.
- Primary languages: TypeScript, Astro, Markdown, and CSS. React is planned only for the later
  planner island.
- Key directories: `src/content/` owns validated Markdown, `src/pages/` owns static routes,
  `src/domain/` owns content limits and validation, `src/layouts/` and `src/components/` own shared
  rendering, `scripts/` owns typed artifact checks, and `docs/` owns project decisions.
- Architectural constraints: Keep content pages static-first and hydrate only the planner. The
  versioned URL is the planner's persisted source of truth. The first release has no personal-data
  collection, server mutation, browser-storage state, CMS, or database.
<!-- END REPO CONTEXT -->

## Build / Test / Validation

- Install: `just install`
- Build: `just build`
- Test: `just test`
- Lint: `just format-check && just lint`
- Typecheck: `just typecheck`
- Validation: `just check`, followed by review against `docs/product-brief.md`,
  `docs/planner-contract.md`, and the shared documents under `../global-docs/`.
- Run one test: `just test-one src/domain/expedition.test.ts`

## Local Workflow Notes

- Preferred commands: Use root `just` recipes; package scripts are low-level implementation details.
- Safe-to-edit areas: Validated Markdown, static pages, domain validation and tests, minimal shared
  rendering, and project documentation.
- Areas requiring extra care: Truthful fictional-content labels, media provenance, planner URL
  compatibility, accessibility, responsive behavior, and performance claims.
- Review expectations: Check valid, malformed, duplicate, out-of-range, incompatible, refresh,
  history, reduced-motion, empty, and recovery paths rather than only the completed plan.

## Repository-Specific Constraints

- Compatibility expectations: Published version 1 planner URLs and stable error classes require
  explicit contract review before their meaning changes.
- Migration / rollout constraints: Static content changes deploy atomically. A future incompatible
  planner shape requires a new explicit contract version or controlled cutover.
- Performance constraints: Content pages ship no planner JavaScript. Media, query, catalog, and
  animation work must remain within the limits defined in project contracts.
- Security / privacy constraints: Do not collect personal information or imply booking, live
  availability, inquiry submission, or payment behavior. Planner query values are fixed,
  non-sensitive choices and must not be sent to analytics.
