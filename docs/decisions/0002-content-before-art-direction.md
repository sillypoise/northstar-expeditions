# 0002: Content Before Art Direction

- Status: Accepted.
- Date: 2026-09-04.
- Decision owner: `@sillypoise`.
- Confidence: High. The repository owner explicitly selected a content-first sequence, and the
  approach is reversible without changing the product or planner contracts.

## Context

The initial delivery plan placed an art-direction prototype before the application foundation. The
repository owner wants to evaluate the information architecture and written content first through a
plain, almost vanilla rendering. Visual direction can then evolve against real page shapes rather
than placeholder sections.

## Decision

Replace the original Phase 2 art-direction gate with a content-first static foundation:

- Build the home, expedition directory, expedition detail, planner introduction, and 404 routes.
- Store page and expedition source material as schema-validated Markdown.
- Begin with system typography, text links, semantic HTML, simple borders, and one content-width
  constraint.
- Include no photography, custom fonts, decorative illustration, animation, React, or Tailwind in
  this phase.
- Establish locked dependencies, strict validation, unit tests, and canonical `just` commands now
  because rendered content needs an executable foundation.
- Permit only esbuild's package lifecycle script because Astro's Vite pipeline consumes its platform
  binary; continue denying lifecycle scripts from every other dependency.
- Introduce art direction incrementally only after content hierarchy and representative long and
  short records have been reviewed in the browser.

Astro, React, and Tailwind remain the accepted eventual stack. React and Tailwind are deferred until
an implemented interaction or visual-system requirement consumes them.

## Why this sequence

Real content exposes heading, metadata, list, long-copy, empty, and overflow requirements earlier
than a polished mockup. A plain baseline also makes later visual changes easy to evaluate: added
styles must improve hierarchy, comprehension, responsiveness, or brand expression rather than hide
weak content structure.

Deferring media avoids selecting or licensing assets before the route and narrative boundaries are
stable. Deferring React and Tailwind avoids installing packages with no current runtime consumer.

## Alternatives considered

### Complete art direction first

The original sequence could establish a stronger early visual target. It is deferred because it
would rely on provisional copy and could create a component system around page shapes that later
change.

### Markdown files without a rendered application

Reviewing Markdown alone would be smaller, but it would not validate routes, semantic page
structure, content schemas, responsive reading width, or static-build behavior. The minimal Astro
rendering provides those checks without committing to an art direction.

## Consequences

- Phase 2 includes part of the foundation work originally planned for Phase 3.
- The Phase 2 result is intentionally plain and must not be judged as final visual portfolio proof.
- Later visual work should modify presentation without moving normative expedition facts out of the
  Markdown collection.
- Content schema changes remain contract changes and require valid, invalid, and boundary checks.
- A static route or text change can be reviewed independently from later planner interaction.

## Phase 2 acceptance checks

- The home, expedition directory, six expedition details, planner introduction, and 404 page build
  as static HTML.
- Every expedition passes the shared frontmatter schema and catalog-wide count and order checks.
- Tests reject unknown fields, duplicate values, and values immediately outside numeric limits.
- Pages remain usable without client JavaScript at representative narrow and wide viewport widths.
- The planner page states plainly that interaction, booking, and inquiry submission do not yet
  exist.
- `just check` passes without ignored failures.

## Re-evaluation trigger

Begin iterative art direction after the repository owner has reviewed the rendered content hierarchy
and identified the first concrete visual improvement. Reconsider the content model first if that
review exposes missing or misleading information rather than styling gaps.
