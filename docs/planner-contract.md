# Trip Planner Contract

## Contract metadata

- Owner: Northstar repository maintainer.
- Status: Normative initial contract.
- Version: `1`.
- Compatibility: No previous consumers exist. Once published, existing version 1 URLs must retain
  their meaning for the first release.
- Boundary: The query string on the public `/plan` route.

## Purpose

The planner converts bounded, non-sensitive URL selections into one transparent, illustrative trip
summary. The URL is the persisted source of truth so refresh, browser history, and sharing do not
require an account, cookie, browser-storage record, or server database.

The planner is not a booking engine, availability check, quote, or inquiry submission.

## Limits

These compile-time limits apply to every input and content record:

| Property | Limit |
| --- | --- |
| Contract version | Exactly `1` |
| Query-string length | At most 512 UTF-8 bytes |
| Group size | 1 through 8 people |
| Selected activities | 1 through 3 unique values |
| Activity values in the catalog | At most 12 |
| Expeditions in the catalog | At most 24 |
| Expedition duration | 3 through 21 days |
| Base price per person | USD 1,000 through USD 25,000 |
| Indicative subtotal | At most USD 200,000 |

Values outside these limits are invalid rather than truncated or silently corrected.

## Version 1 inputs

Every completed plan uses exactly these fields:

| Query field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `version` | Fixed string `1` | Yes | Selects this contract. |
| `step` | Enum | Yes | Selects `expedition`, `season`, `group`, `activities`, or `summary`. |
| `expedition` | Catalog slug | By step | Selects one active seeded expedition. |
| `season` | Catalog season slug | By step | Selects one season offered by the expedition. |
| `group_size` | Base-10 integer | By step | Number of travelers, from 1 through 8. |
| `pace` | Enum | By step | One of `relaxed`, `balanced`, or `active`. |
| `activity` | Repeated enum | By step | One through three unique catalog activities. |

The empty `/plan` query initializes `version=1&step=expedition`. Any non-empty query must include
both `version` and `step`. Required prior selections are:

| Step | Required selections |
| --- | --- |
| `expedition` | None |
| `season` | `expedition` |
| `group` | `expedition`, `season` |
| `activities` | `expedition`, `season`, `group_size`, `pace` |
| `summary` | `expedition`, `season`, `group_size`, `pace`, and `activity` |

If a prior field is absent, the planner returns `incomplete_plan` and resumes at the first missing
step rather than deriving a partial result.

Unknown fields are rejected. Duplicate scalar fields are invalid. Repeated `activity` fields are
expected, but duplicate activity values are invalid. Parsing must not coerce floats, signs,
whitespace, hexadecimal values, empty strings, or mixed alphanumeric strings into an integer.

## Validation order

A summary request must validate in this order before calculating a result:

1. Query-string byte limit.
2. Known field names and scalar-field uniqueness.
3. Contract version.
4. Presence of fields required by the selected step.
5. Primitive shape and enum membership.
6. Numeric and count bounds.
7. Expedition existence and active status.
8. Season support for the selected expedition.
9. Activity support for the selected expedition.
10. Content-record invariants required by the calculation.

No indicative subtotal may be displayed if any validation step fails.

## Successful output

A valid completed plan produces:

- Contract version.
- Expedition title and slug.
- Selected season label.
- Group size and pace label.
- Selected activity labels in catalog order.
- Expedition duration in days.
- Base price per person in integer US dollars.
- Indicative subtotal in integer US dollars.
- A statement that transport to the starting location, insurance, taxes, optional additions, and
  real availability are not included or verified.
- Edit, reset, copy-link, and print actions.

The subtotal is calculated exactly as:

```text
indicative_subtotal_usd = base_price_per_person_usd × group_size
```

There are no implicit discounts, fees, currency conversions, floating-point calculations, or
activity surcharges in version 1.

## Stable error classes

- `query_too_large`: The query exceeds 512 UTF-8 bytes. Reset the complete plan.
- `unknown_field`: The query contains a field outside version 1. Remove unknown fields or reset.
- `duplicate_field`: A scalar field or activity value appears more than allowed. Edit or reset.
- `unsupported_version`: `version` is missing or is not `1`. Start a version 1 plan.
- `incomplete_plan`: A selection required by the requested step is absent. Resume at the first
  missing step.
- `invalid_value`: A value has the wrong primitive shape or enum membership. Edit the affected step.
- `value_out_of_range`: A numeric or count value crosses a documented bound. Edit the affected step.
- `unknown_expedition`: The expedition slug is absent or inactive in the catalog. Choose an active
  expedition.
- `unsupported_season`: The expedition does not offer the selected season. Choose an offered season.
- `unsupported_activity`: The expedition does not offer a selected activity. Choose supported
  activities.
- `invalid_content`: Catalog invariants prevent a valid calculation. Show a safe unavailable state.

An error display may report multiple field-level issues from the same validation stage. It must not
continue into later calculation stages after an invariant failure. Error text must not expose stack
traces, source paths, or raw serialized records.

## Navigation and mutation semantics

- Planner controls create a new validated URL state; they do not mutate catalog content.
- Back and forward navigation restore the selections represented by that history entry.
- Refresh and direct navigation derive the same output from the same valid URL and content version.
- Reset removes all planner fields and returns to the first step.
- Edit preserves fields valid for the selected earlier choices and removes newly incompatible later
  choices.
- Copy-link uses a canonical bounded URL with scalar fields in contract-table order and activities
  in catalog order.
- Print renders the current validated summary and the illustrative-data disclaimer.

## Compatibility rules

Version 1 field meanings, enum meanings, arithmetic, and stable error classes must not be silently
repurposed. Additive catalog entries are compatible if existing slugs retain their meaning. Removing
or materially changing a published expedition requires either preserving its version 1 record or a
documented controlled cutover before deployment.

A future incompatible planner shape must use a new explicit contract version. Unknown versions fail
closed with `unsupported_version`; they must not be interpreted as version 1.

## Required tests

Tests must cover:

- One fully valid plan and deterministic refresh/direct-link output.
- Every stable error class.
- Group sizes 1, 8, 0, and 9.
- Activity counts 1, 3, 0, and 4.
- Duplicate scalar and activity values.
- Empty-query initialization and non-empty queries missing `version` or `step`.
- Exact 512-byte and over-512-byte raw query boundaries, excluding the leading `?`.
- Unknown, inactive, and removed expedition slugs.
- Supported and unsupported expedition-season and expedition-activity pairs.
- Maximum legal subtotal and prevention of out-of-contract arithmetic.
- Reset, edit invalidation, browser history, copy, and print behavior.
