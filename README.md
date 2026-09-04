# Northstar Expeditions

Northstar Expeditions is an independent product concept for a premium adventure-travel marketing
experience. It demonstrates how strong art direction, responsive editorial content, and a focused
planning tool can turn destination interest into a useful, transparent trip summary.

> This repository is portfolio work, not client work, a travel operator, or a production booking
> service. Expeditions, availability, and prices are fictional seeded demonstration data.

## Capability proof

The first release will prove one complete frontend flow:

```text
visitor explores seeded expeditions
→ visitor configures a trip from bounded choices
→ URL input is validated
→ the application derives an illustrative plan and price
→ the visitor can edit, reset, copy, or print the result
→ invalid and unsupported states provide visible recovery
```

Northstar deliberately does not collect names, email addresses, payment details, or free-form
personal information. The initial release has no booking or inquiry backend. This exception to the
portfolio's default backend-flow scope keeps the project focused on high-end frontend and marketing
execution; the other portfolio projects provide backend evidence.

## Current status

Phase 2, the content-first static foundation, is complete. The home, directory, six expedition
details, planner introduction, and 404 page build as plain static HTML from validated Markdown. The
planner interaction, final art direction, and deployment do not exist yet.

- [Product brief](docs/product-brief.md)
- [Planner contract](docs/planner-contract.md)
- [Technology decision](docs/decisions/0001-technology-stack.md)
- [Content-first decision](docs/decisions/0002-content-before-art-direction.md)
- [Phase log](docs/phase-log.md)

## Stack

Currently implemented:

- Astro with strict TypeScript for static pages.
- Zod-validated Astro content collections for seeded expedition content.
- Minimal project CSS with system fonts and no media or animation.
- Vitest, Oxlint, Oxfmt, and Astro checks.
- pnpm for locked dependencies and a root `justfile` for project commands.

Deferred until a current phase consumes them:

- React for the trip-planner island.
- Tailwind CSS and project-owned visual tokens.
- Playwright for planner, accessibility, and browser checks.
- Cloudflare Pages and OpenTofu, subject to infrastructure validation.

## Product scope

The initial release contains five primary views:

1. Editorial home page.
2. Filterable expedition directory.
3. Expedition detail page.
4. Multi-step trip planner.
5. Printable plan summary.

Authentication, checkout, live inventory, an administration interface, a CMS, user-generated
content, and real lead capture are out of scope.

## Local development

Requirements are Node.js 22.12 through 24, pnpm 10.33.2, and just 1.43 or newer.

```text
just install
just develop
```

The development server listens on <http://127.0.0.1:4321>. Use `just --list` to discover commands
and run the complete non-mutating validation set with:

```text
just check
```

## Delivery phases

1. Define the product, planner contract, technology boundary, and acceptance criteria.
2. Build the plain static application and schema-validated Markdown content foundation.
3. Implement the planner contract, directory filters, and browser-level negative-path tests.
4. Add art direction iteratively against the working content and planner.
5. Complete accessibility, responsive, and performance validation.
6. Provision infrastructure, deploy, and capture portfolio evidence.
