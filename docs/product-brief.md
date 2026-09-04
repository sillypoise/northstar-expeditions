# Northstar Expeditions Product Brief

## Status and ownership

- Status: Normative Phase 1 product contract.
- Owner: Northstar repository maintainer.
- Compatibility: Initial contract; no previous consumers exist.
- Confidence: Medium-high. The scope directly supports Northstar's assigned portfolio role, but the
  visual direction and static-host deployment remain unvalidated.
- Re-evaluation triggers: The representative art-direction prototype does not produce distinctive
  visual evidence; the planner cannot remain useful without collecting personal data; or the
  selected deployment cannot meet the accessibility and performance acceptance checks.

## Problem

Premium travel sites must create desire without making discovery or planning confusing. Many
experiences either provide attractive but disconnected editorial pages or send visitors directly to
an unstructured inquiry form. A visitor needs to understand an expedition, make bounded choices, and
leave with a clear summary before deciding whether to contact a real operator.

Northstar will demonstrate the frontend and marketing work needed to connect editorial storytelling
to a useful planning outcome.

## Product and truthfulness boundary

Northstar Expeditions is an independent product concept, not client work, an operating travel
company, or a booking service. All expeditions, routes, departure availability, and prices are
fictional seeded demonstration data. The interface and public documentation must label indicative
prices and simulated availability where a visitor could otherwise mistake them for an offer.

The project must not contain fabricated testimonials, customer counts, awards, review scores,
production metrics, or environmental claims. Licensed third-party media must have repository-visible
source and license records before public deployment.

## Audience

The demonstration is designed for:

- Prospective clients evaluating premium marketing and frontend delivery capability.
- Travelers exploring the fictional content and exercising the planner without an account.
- The repository maintainer operating and presenting the public portfolio demonstration.

There are no authenticated customers, travel advisors, content editors, or administrators in the
first release.

## Capability proof

Northstar will prove one complete frontend flow:

```text
expedition discovery
→ bounded planner selections
→ URL contract validation
→ deterministic plan and price derivation
→ printable or copyable result
→ edit, reset, and invalid-state recovery
```

The proof is the quality and correctness of this working flow across responsive, accessible, and
failure states. A visually attractive home page alone is not sufficient.

## Required screens

1. **Home:** Positioning, featured expeditions, editorial narrative, and a clear planner entry.
2. **Expeditions:** A bounded list with destination, season, duration, and activity filters.
3. **Expedition detail:** Route, itinerary, difficulty, duration, inclusions, and indicative price.
4. **Trip planner:** Expedition, departure season, group size, pace, and activity selections.
5. **Plan summary:** Validated choices, itinerary facts, indicative subtotal, assumptions, and edit,
   reset, copy, and print actions.

The planner and summary may be two states of one route. They count as distinct user views because
they have different content, actions, and error behavior.

## Primary behavior

Northstar must:

1. Render expedition content from a build-validated, repository-owned data collection.
2. Let visitors filter the expedition list using only fixed, documented values.
3. Represent planner state through the versioned URL query contract.
4. Validate all URL values before displaying a derived result.
5. Reject unknown, duplicate, out-of-range, or incompatible planner values explicitly.
6. Calculate the indicative subtotal using integer US-dollar values from validated content.
7. Derive the result from validated URL state without maintaining a second persisted state store.
8. Preserve valid state through refresh, browser history, and copied URLs.
9. Let the visitor recover by editing invalid fields or resetting the complete plan.
10. Support printing without requiring a PDF-generation service or runtime dependency.

Detailed input, output, and error semantics are normative in
[`planner-contract.md`](planner-contract.md).

## Frontend-only exception

The portfolio shipping standard normally expects a genuinely working backend flow. Northstar's first
release records a narrow exception:

- **Owner:** Northstar repository maintainer.
- **Scope:** First shipped release only.
- **Reason:** Northstar is assigned to frontend and marketing proof, while the first three portfolio
  projects provide backend evidence. A fictional inquiry backend would collect personal data and add
  spam, retention, authorization, and operational responsibilities without strengthening this
  project's selected capability.
- **Compensating behavior:** The planner is a real, deterministic stateful flow with explicit input,
  output, error, boundary, refresh, and recovery behavior.
- **Reconsider when:** A real operator owns inquiry handling and retention, or portfolio review
  shows that server-backed conversion behavior is necessary evidence.

The exception does not permit simulated submissions, fake success messages, or claims that a plan
was booked or sent to an advisor.

## Content and privacy boundaries

- Planner inputs are fixed, non-sensitive choices. There are no names, email addresses, exact travel
  dates, payment details, health details, free-form notes, or location tracking.
- Planner values may appear in the URL because the contract excludes personal information.
- The first release must not use cookies or browser storage for planner state.
- Analytics are deferred. If later admitted, they must be privacy-conscious, documented, and must
  not capture planner query values.
- Public content is read-only. A visitor cannot mutate shared content or another visitor's state.

## Visual direction

The target is an editorial expedition journal rather than a generic application dashboard or SaaS
landing-page template. The system should use strong typography, restrained natural colors,
responsive imagery, original route graphics, and purposeful composition. Motion must clarify
hierarchy or navigation, remain bounded, and honor reduced-motion preferences.

One home-page section, one expedition card, and one planner step must pass mobile and desktop review
before the full design system is expanded.

## Explicit non-goals

- Real booking, payments, inventory, inquiries, email delivery, or customer accounts.
- Authentication, roles, an administration interface, or cross-visitor state.
- A headless CMS, visual page builder, generalized component library, or theme framework.
- User-generated content, reviews, community features, or localization.
- Native applications, offline installation, or service workers.
- Scroll-jacking, unbounded animation, background video by default, or decorative 3D rendering.
- Fabricated business outcomes or claims of production traffic and conversion performance.

## Acceptance criteria

### Product

- The five required views present one coherent narrative and visual system.
- A visitor can complete, copy, print, edit, and reset a plan without assistance.
- The statically rendered directory has intentional initial, empty-filter, populated, and reset
  states; it must not simulate a network-loading state that does not exist.
- Expedition and pricing data are visibly identified as seeded and illustrative.

### Contract and correctness

- Content and URL inputs are validated before result calculation or rendering.
- Valid, incomplete, malformed, duplicate, out-of-range, and incompatible URL values have tests.
- Minimum and maximum group sizes and activity counts are tested at and across their boundaries.
- Browser history, refresh, direct-link, print, reset, and unknown-expedition behavior are tested.
- Errors use the stable classes defined by the planner contract and provide bounded recovery.

### Accessibility and responsive behavior

- Core flows work with a keyboard and expose useful landmarks, headings, labels, status, and focus.
- Motion honors `prefers-reduced-motion`; required information never depends on animation.
- Content is usable at representative 360, 768, and 1440 CSS-pixel viewport widths.
- Automated accessibility checks and manual keyboard review report no known critical violations in
  the primary flow.

### Performance

- Content pages ship no planner JavaScript.
- The planner is the only initial React island unless a measured interaction requirement justifies
  another one.
- The target first visual load is at most about 600 KB compressed, including its responsive hero
  image. This is a design budget, not a current measurement or production claim.
- Deployed Lighthouse results use a documented environment and configuration; target thresholds are
  set after the representative prototype establishes an honest baseline.

### Evidence and delivery

- `just check` passes with no ignored failures once executable tooling exists.
- The deployment uses a reviewed OpenTofu plan for supported project-owned resources.
- Media provenance, local setup, validation, deployment, rollback, and teardown are documented.
- Screenshots and a short walkthrough are captured only after acceptance checks pass.
- Public descriptions consistently identify independent, seeded, illustrative, and real behavior.

## Considered alternatives

### B2B SaaS launch site

A SaaS concept would align closely with common TypeScript job descriptions, but it would overlap the
application-oriented portfolio projects and risk looking like a familiar landing-page template.
Travel provides a stronger editorial and responsive design surface.

### Architecture studio

An architecture concept could provide excellent visual material, but its honest functional flow
would likely be limited to portfolio filtering or a personal-data inquiry form. The expedition
planner provides a more substantial interaction without inventing a backend.

### Real inquiry capture

A real inquiry endpoint would make conversion persistence observable, but it would require personal
data handling, retention, abuse controls, administrative access, and ongoing operations. It is
deferred until those responsibilities have a real owner and strengthen a current requirement.
