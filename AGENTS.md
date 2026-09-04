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
- Primary languages: TypeScript, Astro, React, and CSS.
- Key directories: `docs/` contains product, contract, decision, and phase records. Application and
  infrastructure directories will be established only when their implementation phases begin.
- Architectural constraints: Keep content pages static-first and hydrate only the planner. The
  versioned URL is the planner's persisted source of truth. The first release has no personal-data
  collection, server mutation, browser-storage state, CMS, or database.
<!-- END REPO CONTEXT -->

## Build / Test / Validation

- Install: Not established until the application foundation phase.
- Build: Not established until the application foundation phase.
- Test: Not established until the application foundation phase.
- Lint: Review Markdown and contracts manually until executable tooling exists.
- Typecheck: Not established until the application foundation phase.
- Validation: Review changes against `docs/product-brief.md`, `docs/planner-contract.md`, and the
  shared documents under `../global-docs/`.
- Run one test: Not established until the application foundation phase.

## Local Workflow Notes

- Preferred commands: Use the root `justfile` after it is added with executable tooling; do not add
  placeholder recipes.
- Safe-to-edit areas: Product documentation during Phase 1; later phases will identify application
  and infrastructure seams explicitly.
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
