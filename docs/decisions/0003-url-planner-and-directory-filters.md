# 0003: URL Planner and Directory Filters

- Status: Implemented; art direction and deployment remain deferred.
- Owner: `@sillypoise`.
- Confidence: High for the tested local static flow; hosting behavior remains unverified.

## Content review

The Stage 2 review identified missing season metadata in directory cards, missing detail-to-planner
links, and future-tense placeholder copy. Stage 3 adds season labels and direct expedition entry,
and updates the home, directory, and planner introduction to describe working behavior.

Pace is explicitly a preference, not a promise that a demanding route becomes easy. Neither pace nor
activity choice changes fixed duration or price. Broad seasons are illustrative planning windows,
not dates or live inventory. Existing expedition slugs, durations, and prices are unchanged.

## Decision

Use one client-only React island on `/plan`. Native full-document navigation commits each validated
step to its URL. React retains only transient validation and clipboard feedback; selections are read
from the URL and editable controls. Reload and history therefore use browser navigation rather than
a custom history synchronization layer. Unsaved control edits are not persisted; Continue commits
them. Summary edit links retain existing choices. Changing expedition removes incompatible
season/activity choices while retaining group and pace.

Alternative: an SPA-style history adapter could avoid document navigation, but adds history-event,
focus, and state synchronization responsibilities with no current need. No router, form framework,
state store, browser storage, or server mutation was admitted.

The directory uses one small vanilla TypeScript enhancement over static HTML. Its controls remain
hidden until initialization succeeds; all six content entries remain available without JavaScript.
Only `/plan` loads React, the planner parser, or its catalog payload.

## Directory filter contract

- Owner: Repository maintainer.
- Version/compatibility: Initial local UI contract. No query or storage persistence exists.
- Inputs: Destination is an exact current catalog country label; season and activity use the catalog
  vocabulary; duration is empty, `short` (3–8 days), or `long` (9–21 days).
- Empty values mean no constraint. Multiple selected constraints are combined with AND.
- Apply evaluates at most 24 entries against four constraints. Unknown non-empty values match no
  entries. No arbitrary regular expression, HTML, or remote request is accepted.
- Output: A visible subset and a polite result count, or an explicit no-match recovery message.
- Reset: Restore all controls and entries without mutating shared data.
- Lifecycle: Filters live only in the current document. Reload returns to the full collection.
- Changes to persistence or existing duration meanings require explicit contract review.

## Planner compatibility clarifications

This is the first executable implementation of version 1; there are no deployed planner consumers.
Existing declared field meanings, arithmetic, and stable error names are preserved. Clarifications
before release are recorded in the planner contract:

- Group integers use canonical unsigned decimal syntax; leading zeros are invalid.
- Missing activities are `incomplete_plan`; a present empty activity is `invalid_value`.
- Every present optional field is validated, even before its step is required.
- Registry membership defines active expedition status; removed entries fail `unknown_expedition`.
- Catalog shape is validated before inspecting its arrays, so corrupted records fail safely with
  `invalid_content` rather than throwing while checking a season or activity.
- Recovery links copy only a validated prefix, never raw unknown fields. Unsupported versions return
  to a new plan rather than being reinterpreted.
- Copy uses the catalog vocabulary order, not the incidental order of query parameters. Clipboard
  denial provides a selectable canonical URL rather than a false success message.

## Privacy and cost boundaries

No personal fields, analytics, cookies, storage, backend, booking, or inquiry submission are added.
The document referrer policy is `no-referrer`. Query strings still appear in browser history and may
reach static-host request logs; URL choices are deliberately non-sensitive, not confidential.

Resource design: at most 24 catalog entries, four filters, seven query field names, and a 512-byte
query keep work bounded. Parsing rejects excessive character length before UTF-8 encoding. The
planner ships React and Zod only on its route; editorial pages require no such transfer. The
production artifact check preserves the no-island boundary on every content route.

## Evidence and limitations

- `src/domain/planner.test.ts` exercises every stable error, numeric/activity boundaries, duplicate
  and malformed input, canonicalization, edit invalidation, and exact/over-limit query lengths.
- `tests/browser/` exercises native navigation, refresh/history, error recovery, clipboard success
  and denial, print visibility, keyboard controls, responsive widths, reduced motion, missing
  JavaScript, failed hydration, filtering, and unknown routes against the built static site.
- Browser checks currently use Chromium only. They do not establish a complete accessibility audit,
  cross-browser guarantee, hosted performance score, or final visual quality claim.

Revisit full-document navigation only if review identifies a concrete usability problem. Begin art
direction only when the repository owner requests it; no visual-system work is part of Stage 3.
