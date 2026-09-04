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

Phase 1, product and technology definition, is complete. No executable application or deployment
exists yet.

- [Product brief](docs/product-brief.md)
- [Planner contract](docs/planner-contract.md)
- [Technology decision](docs/decisions/0001-technology-stack.md)
- [Phase log](docs/phase-log.md)

## Planned stack

- Astro with strict TypeScript for static-first pages.
- React for the trip-planner island only.
- Tailwind CSS and project-owned design tokens.
- Typed Astro content collections for seeded expedition content.
- Vitest and Playwright for logic, contract, accessibility, and browser checks.
- Cloudflare Pages, subject to an infrastructure validation gate.
- OpenTofu for supported project-owned infrastructure.
- pnpm for locked dependencies and a root `justfile` for project commands.

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

Executable setup and validation commands will be established in Phase 2. Once tooling exists, the
root `justfile` will be the canonical command interface.

## Planned delivery phases

1. Define the product, planner contract, technology boundary, and acceptance criteria.
2. Establish art direction and validate representative responsive components.
3. Create the application, command, content, and test foundations.
4. Build the editorial pages and expedition discovery flow.
5. Implement the planner, result, invalid-input, boundary, and recovery paths.
6. Complete accessibility, performance, deployment, and portfolio evidence checks.
