# 0001: Initial Technology Stack

- Status: Accepted with validation gates; delivery sequence amended by
  [decision 0002](0002-content-before-art-direction.md).
- Date: 2026-09-04.
- Decision owner: `@sillypoise`.
- Confidence: Medium-high. The architecture matches a static editorial product, but dependency,
  image, and Cloudflare behavior still require executable validation.

## Context

Northstar must provide the portfolio's strongest evidence of responsive frontend and marketing
execution. Its first release has public read-only content and one deterministic planner that uses
non-sensitive URL state. It does not require authenticated data, server mutation, background work,
or a runtime database.

The portfolio already assigns visible Next.js evidence to Integration Hub. Northstar should choose
the smallest stack that supports excellent content delivery and a focused React interaction rather
than duplicate a full-stack runtime by default.

## Decision

Use:

- Astro and strict TypeScript for static generation, routing, metadata, and content pages.
- React for the trip-planner island only.
- Tailwind CSS for layout and responsive utilities, with project-owned CSS custom properties for
  visual tokens.
- Astro content collections for build-validated, repository-owned expedition records.
- Native CSS transitions and animations first, always with reduced-motion behavior.
- Vitest for pure planner, content, and contract tests.
- Playwright for browser, accessibility, responsive-boundary, print, and recovery checks.
- pnpm with a committed lockfile for JavaScript dependency integrity.
- Cloudflare Pages as the tentative static host.
- OpenTofu for provider-supported Cloudflare project resources and DNS configuration.
- A root `justfile` as the canonical command interface.

Do not initially add a component library, animation package, state-management package, form package,
CMS, analytics product, server adapter, database, container image, or PDF library. Admit one only
when an implemented requirement cannot be met more simply.

Select current stable versions and pin them during Phase 3 repository foundation work. This decision
does not claim compatibility with versions that have not yet been installed and tested.

## Why this option

Astro can generate the editorial pages as HTML while hydrating only the planner. That directly
supports Northstar's performance and progressive-enhancement goals and keeps content rendering
independent of client JavaScript. React remains visible where component state and URL navigation
justify it.

A static deployment has no public server mutation, secret-bearing application runtime, or database
lifecycle. This is materially smaller than adding a backend solely to imitate lead capture in a
fictional business.

Tailwind accelerates responsive implementation, while explicit project tokens and bespoke components
preserve art direction. Native motion remains sufficient until a reviewed prototype proves
otherwise.

## Alternatives considered

### Next.js

Next.js offers strong market recognition and an easy path to server behavior. It is not currently
required because Northstar has no server-side mutation, private data, or dynamic content source.
Integration Hub already provides the portfolio's primary Next.js signal. Reconsider Next.js if a
current requirement introduces authenticated server orchestration, previewable remote content, or a
real owned inquiry workflow.

### Astro without React

An Astro-only planner could use a small vanilla TypeScript module and ship less framework code.
React is accepted because the multi-step URL state, validation feedback, and testable component
boundaries form one current interactive use and because React delivery is relevant to the portfolio.
The rest of the site must not become React islands by convenience.

### Headless CMS

A CMS would demonstrate content operations, but no content editor or publishing workflow currently
exists. Repository-owned collections provide validation and version history with no external
service, preview authorization, webhook, or schema-migration surface.

### Server-backed inquiry capture

A server endpoint would persist conversion data but would also introduce personal-data collection,
spam protection, retention, authorization, and operations. It is rejected for the first release. The
product brief records the bounded exception and its reconsideration trigger.

## Consequences

- Content changes require a repository change and deployment.
- Query parsing and catalog validation are security and contract boundaries despite running in the
  browser; malformed URLs must fail closed before calculation.
- The URL is the planner's persisted source of truth. A second browser or server state store is not
  permitted in the first release.
- Content pages must remain useful without JavaScript. The planner may require JavaScript but must
  show an explicit unavailable state if hydration fails.
- Static hosting cannot claim successful submissions, live availability, or persisted plans.
- Media files will dominate transfer cost, so responsive dimensions, formats, and provenance are
  part of implementation rather than deferred polish.

## Deferred art-direction gate

Decision 0002 moves this gate after the plain content foundation. Before expanding the visual
system, demonstrate:

1. One home-page section at 360, 768, and 1440 CSS-pixel widths.
2. One expedition card with representative short and long content.
3. One planner step with keyboard focus, validation, and reduced-motion behavior.
4. A documented media source and license path suitable for the public repository.
5. An initial asset and typography budget based on the prototype, not an unsupported estimate.

Failure to produce distinctive, accessible work at this gate triggers art-direction revision before
more components are added.

## Phase 3 foundation gates

The executable foundation must demonstrate:

1. Locked dependencies and strict formatting, linting, type-checking, testing, and build recipes.
2. Build-time rejection of invalid content records and catalog limits.
3. Tests for valid, invalid, duplicate, and boundary planner query values.
4. No planner JavaScript on content-only routes.
5. No secret, personal-data field, analytics tracker, or network mutation in browser artifacts.

## Deployment gates

Before Cloudflare Pages is accepted rather than tentative:

1. The built static artifact runs correctly under representative direct and fallback routes.
2. OpenTofu can manage the selected project-owned resources with pinned providers and a reviewed
   plan, or each unsupported resource has a documented manual boundary and drift check.
3. State storage, locking, rollback, teardown, cache invalidation, and expected recurring cost are
   documented.
4. The deployed site passes the declared responsive, accessibility, negative-path, and performance
   checks.

Failure of a gate triggers review of this decision rather than an undocumented workaround.
