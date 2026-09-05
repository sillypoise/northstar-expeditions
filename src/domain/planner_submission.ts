import type { ExpeditionCatalogEntry } from "./expedition";
import { invariant } from "./invariant";
import { parse_planner, planner_steps, type PlannerResult, type PlannerStep } from "./planner";

// Edits retain independent choices but drop season/activity values incompatible with a new journey.
export function planner_submission(
    parameters: URLSearchParams,
    catalog: readonly ExpeditionCatalogEntry[],
): PlannerResult {
    const step = parameters.get("step") as PlannerStep;
    const step_index = planner_steps.indexOf(step);
    invariant(step_index >= 0);
    invariant(step_index < 4);
    const next = new URLSearchParams(parameters);
    if (step === "expedition") {
        const entry = catalog.find((candidate) => candidate.id === next.get("expedition"));
        if (entry !== undefined) {
            const season = next.get("season");
            if (entry.data.seasons.some((offered) => offered === season) === false)
                next.delete("season");
            const activities = next.getAll("activity");
            next.delete("activity");
            for (const activity of activities) {
                if (entry.data.activities.some((offered) => offered === activity))
                    next.append("activity", activity);
            }
        }
    }
    const next_step = planner_steps[step_index + 1];
    invariant(next_step !== undefined);
    next.set("step", next_step);
    return parse_planner(next.toString(), catalog);
}
