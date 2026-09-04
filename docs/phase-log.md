# Phase Log

This log records completed project phases. Entries describe verified work rather than planned work.

## Phase 1 — Product and technology definition

- Defined Northstar Expeditions as a fictional premium adventure-travel product concept.
- Defined the five required views and one discovery-to-plan frontend capability proof.
- Defined a versioned, bounded URL contract with deterministic integer pricing and stable errors.
- Excluded personal information, browser storage, server mutation, live inventory, and fake booking
  behavior from the first release.
- Recorded the frontend-only exception to the portfolio's default backend-flow scope, including its
  owner, reason, compensating behavior, release boundary, and reconsideration trigger.
- Selected Astro, strict TypeScript, one React planner island, Tailwind CSS, typed local content,
  Vitest, and Playwright, subject to implementation gates.
- Selected Cloudflare Pages tentatively, subject to static-routing and OpenTofu validation.
- Rejected an initial CMS, component library, animation package, server runtime, database,
  analytics, and generalized design system because no current requirement justifies them.

Validation: Documentation was reviewed against the shared portfolio strategy, shipping,
infrastructure, and project-command standards. Contract review included valid, malformed, duplicate,
out-of-range, incompatible, refresh, history, reset, and unavailable-content paths. No executable
implementation or deployment exists in this phase.

## Phase 2 — Content-first static foundation

- Replaced the planned art-direction-first sequence with an explicit content-first decision owned by
  the repository maintainer.
- Added plain static home, directory, six detail, planner introduction, and 404 routes.
- Added six fictional Markdown expedition records with varied lengths, seasons, activities,
  difficulty, routes, and prices.
- Added strict frontmatter schemas, catalog count and order invariants, explicit labels, and bounded
  integer US-dollar formatting.
- Added a semantic shared layout, skip link, visible concept notice, system typography, simple
  responsive grids, and no photography, custom fonts, animation, or client JavaScript.
- Added pinned Astro and validation tooling, a pnpm lockfile, an explicit formatter configuration,
  and the canonical root `justfile`.
- Allowed only esbuild's dependency lifecycle script because Astro's Vite build pipeline consumes
  its platform binary; all other dependency lifecycle scripts remain denied by pnpm.
- Added direct static-artifact checks for the ten expected HTML files, bounded file size, main
  landmarks, document titles, and the temporary Phase 2 script-free requirement. The script-free
  gate must be narrowed to content routes when the Phase 3 planner intentionally adds React.

Validation: `just check` passed formatting, warning-denied type-aware linting, Astro and strict
TypeScript diagnostics, 13 valid, invalid, and boundary tests, a production build of ten static
pages, and direct artifact checks. A frozen-lockfile install and high-severity dependency audit
passed with no reported vulnerability. The expedition directory was rendered at 360, 768, and 1440
CSS-pixel widths and remained readable without horizontal overflow. HTTP smoke checks returned 200
for home, directory, detail, and planner routes and 404 for an unknown route. No deployment exists.
