import {
    activity_slugs,
    expedition_schema,
    maximum_catalog_entries,
    season_slugs,
    type ExpeditionCatalogEntry,
} from "./expedition";
import { invariant } from "./invariant";

export const planner_steps = ["expedition", "season", "group", "activities", "summary"] as const;
export type PlannerStep = (typeof planner_steps)[number];
export const planner_fields = [
    "version",
    "step",
    "expedition",
    "season",
    "group_size",
    "pace",
    "activity",
] as const;
export const pace_values = ["relaxed", "balanced", "active"] as const;
export type PlannerError =
    | "query_too_large"
    | "unknown_field"
    | "duplicate_field"
    | "unsupported_version"
    | "incomplete_plan"
    | "invalid_value"
    | "value_out_of_range"
    | "unknown_expedition"
    | "unsupported_season"
    | "unsupported_activity"
    | "invalid_content";

export type PlannerResult = {
    readonly error: PlannerError | null;
    readonly parameters: URLSearchParams;
    readonly entry: ExpeditionCatalogEntry | undefined;
    readonly subtotal_usd: number | null;
};

// Only URLs are persisted. No parsing failure is allowed to produce an illustrative subtotal.
export function parse_planner(
    query: string,
    catalog: readonly ExpeditionCatalogEntry[],
): PlannerResult {
    const empty = new URLSearchParams();
    if (query.length > 513) return planner_failure("query_too_large", empty);
    const raw = query.replace(/^\?/, "");
    if (new TextEncoder().encode(raw).length > 512)
        return planner_failure("query_too_large", empty);
    const parameters = new URLSearchParams(raw);
    if (raw === "") {
        parameters.set("version", "1");
        parameters.set("step", "expedition");
    }
    const structure_error = parse_planner_structure(parameters);
    if (structure_error !== null) return planner_failure(structure_error, parameters);
    if (parameters.get("version") !== "1")
        return planner_failure("unsupported_version", parameters);
    const step = parameters.get("step");
    if (step === null) return planner_failure("incomplete_plan", parameters);
    if (planner_steps.includes(step as PlannerStep) === false) {
        return planner_failure("invalid_value", parameters);
    }
    const missing = required_fields[step as PlannerStep].some(
        (field) => parameters.has(field) === false,
    );
    if (missing) return planner_failure("incomplete_plan", parameters);
    const value_error = parse_planner_values(parameters);
    if (value_error !== null) return planner_failure(value_error, parameters);
    if (catalog.length === 0) return planner_failure("invalid_content", parameters);
    if (catalog.length > maximum_catalog_entries)
        return planner_failure("invalid_content", parameters);
    if (new Set(catalog.map((candidate) => candidate.id)).size !== catalog.length) {
        return planner_failure("invalid_content", parameters);
    }
    const entry = catalog.find((candidate) => candidate.id === parameters.get("expedition"));
    if (parameters.has("expedition")) {
        if (entry === undefined) return planner_failure("unknown_expedition", parameters);
    }
    if (entry !== undefined) {
        if (expedition_schema.safeParse(entry.data).success === false) {
            return planner_failure("invalid_content", parameters);
        }
        const season = parameters.get("season");
        if (season !== null) {
            if (entry.data.seasons.includes(season as (typeof season_slugs)[number]) === false) {
                return planner_failure("unsupported_season", parameters);
            }
        }
        const supported = parameters
            .getAll("activity")
            .every((activity) =>
                entry.data.activities.includes(activity as (typeof activity_slugs)[number]),
            );
        if (supported === false) return planner_failure("unsupported_activity", parameters);
    }
    let subtotal_usd: number | null = null;
    if (step === "summary") {
        invariant(entry !== undefined);
        subtotal_usd = entry.data.base_price_per_person_usd * Number(parameters.get("group_size"));
        invariant(Number.isSafeInteger(subtotal_usd));
        invariant(subtotal_usd <= 200_000);
    }
    return { error: null, parameters, entry, subtotal_usd };
}

const required_fields: Readonly<Record<PlannerStep, readonly string[]>> = {
    expedition: [],
    season: ["expedition"],
    group: ["expedition", "season"],
    activities: ["expedition", "season", "group_size", "pace"],
    summary: ["expedition", "season", "group_size", "pace", "activity"],
};

function planner_failure(error: PlannerError, parameters: URLSearchParams): PlannerResult {
    return { error, parameters, entry: undefined, subtotal_usd: null };
}

function parse_planner_structure(parameters: URLSearchParams): PlannerError | null {
    for (const key of parameters.keys()) {
        if (planner_fields.includes(key as (typeof planner_fields)[number]) === false)
            return "unknown_field";
    }
    for (const key of planner_fields) {
        if (key !== "activity") {
            if (parameters.getAll(key).length > 1) return "duplicate_field";
        }
    }
    const activities = parameters.getAll("activity");
    if (new Set(activities).size !== activities.length) return "duplicate_field";
    return null;
}

function parse_planner_values(parameters: URLSearchParams): PlannerError | null {
    const expedition = parameters.get("expedition");
    if (expedition !== null) {
        if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(expedition) === false) return "invalid_value";
    }
    const season = parameters.get("season");
    if (season !== null) {
        if (season_slugs.includes(season as (typeof season_slugs)[number]) === false)
            return "invalid_value";
    }
    const pace = parameters.get("pace");
    if (pace !== null) {
        if (pace_values.includes(pace as (typeof pace_values)[number]) === false)
            return "invalid_value";
    }
    const group = parameters.get("group_size");
    if (group !== null) {
        if (/^(0|[1-9][0-9]*)$/.test(group) === false) return "invalid_value";
    }
    const activities = parameters.getAll("activity");
    for (const activity of activities) {
        if (activity_slugs.includes(activity as (typeof activity_slugs)[number]) === false)
            return "invalid_value";
    }
    if (group !== null) {
        if (Number(group) < 1) return "value_out_of_range";
        if (Number(group) > 8) return "value_out_of_range";
    }
    if (activities.length > 3) return "value_out_of_range";
    return null;
}

export function planner_url(parameters: URLSearchParams): string {
    const canonical = new URLSearchParams();
    for (const field of planner_fields) {
        if (field !== "activity") {
            const value = parameters.get(field);
            if (value !== null) canonical.set(field, value);
        }
    }
    for (const activity of activity_slugs) {
        if (parameters.getAll("activity").includes(activity))
            canonical.append("activity", activity);
    }
    const query = canonical.toString();
    invariant(query.length <= 512);
    invariant(canonical.get("version") === "1");
    return `/plan?${query}`;
}

// Recover only validated prefixes; malicious and duplicate values never enter recovery links.
export function planner_recovery(
    result: PlannerResult,
    catalog: readonly ExpeditionCatalogEntry[],
): string {
    if (result.error === "unsupported_version") return "/plan";
    if (result.error === "invalid_content") return "/plan";
    const safe = new URLSearchParams("version=1&step=expedition");
    for (const step of planner_steps.slice(1)) {
        for (const field of required_fields[step]) {
            safe.delete(field);
            for (const value of result.parameters.getAll(field)) safe.append(field, value);
        }
        safe.set("step", step);
        if (parse_planner(safe.toString(), catalog).error !== null) {
            const previous = planner_steps[planner_steps.indexOf(step) - 1];
            invariant(previous !== undefined);
            const prefix = new URLSearchParams("version=1");
            prefix.set("step", previous);
            for (const field of required_fields[previous]) {
                for (const value of safe.getAll(field)) prefix.append(field, value);
            }
            return planner_url(prefix);
        }
    }
    return "/plan";
}
