import { activity_labels, season_labels, type ExpeditionCatalogEntry } from "../domain/expedition";
import { planner_fields, type PlannerResult, type PlannerStep } from "../domain/planner";

export function PlannerFields({
    result,
    catalog,
}: {
    readonly result: PlannerResult;
    readonly catalog: readonly ExpeditionCatalogEntry[];
}) {
    const step = result.parameters.get("step") as PlannerStep;
    return (
        <>
            <PlannerHiddenFields result={result} step={step} />
            {step === "expedition" && (
                <label>
                    Expedition
                    <select
                        name="expedition"
                        required
                        defaultValue={result.parameters.get("expedition") ?? ""}
                    >
                        <option value="" disabled>
                            Choose an expedition
                        </option>
                        {catalog.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                                {entry.data.title}
                            </option>
                        ))}
                    </select>
                </label>
            )}
            {step === "season" && (
                <label>
                    Departure season
                    <select
                        name="season"
                        required
                        defaultValue={result.parameters.get("season") ?? ""}
                    >
                        <option value="" disabled>
                            Choose a season
                        </option>
                        {result.entry?.data.seasons.map((season) => (
                            <option key={season} value={season}>
                                {season_labels[season]}
                            </option>
                        ))}
                    </select>
                </label>
            )}
            {step === "group" && <PlannerGroupFields result={result} />}
            {step === "activities" && <PlannerActivityFields result={result} />}
        </>
    );
}

const step_fields: Readonly<Record<PlannerStep, readonly string[]>> = {
    expedition: ["expedition"],
    season: ["season"],
    group: ["group_size", "pace"],
    activities: ["activity"],
    summary: [],
};

function PlannerHiddenFields({
    result,
    step,
}: {
    readonly result: PlannerResult;
    readonly step: PlannerStep;
}) {
    const hidden_fields = planner_fields.filter(
        (field) => ["version", "step", ...step_fields[step]].includes(field) === false,
    );
    return (
        <>
            <input type="hidden" name="version" value="1" />
            <input type="hidden" name="step" value={step} />
            {hidden_fields.flatMap((field) =>
                result.parameters
                    .getAll(field)
                    .map((value) => (
                        <input key={`${field}-${value}`} type="hidden" name={field} value={value} />
                    )),
            )}
        </>
    );
}

function PlannerGroupFields({ result }: { readonly result: PlannerResult }) {
    return (
        <fieldset>
            <legend>Group and pace</legend>
            <label>
                Travelers
                <input
                    name="group_size"
                    type="number"
                    min="1"
                    max="8"
                    step="1"
                    required
                    defaultValue={result.parameters.get("group_size") ?? "1"}
                />
            </label>
            <label>
                Pace
                <select
                    name="pace"
                    required
                    defaultValue={result.parameters.get("pace") ?? "balanced"}
                >
                    <option value="relaxed">Relaxed</option>
                    <option value="balanced">Balanced</option>
                    <option value="active">Active</option>
                </select>
            </label>
            <p>
                Pace records a preference; it does not change route difficulty, duration, or price.
            </p>
        </fieldset>
    );
}

function PlannerActivityFields({ result }: { readonly result: PlannerResult }) {
    return (
        <fieldset>
            <legend>Choose 1–3 activities</legend>
            {result.entry?.data.activities.map((activity) => (
                <label key={activity}>
                    <input
                        type="checkbox"
                        name="activity"
                        value={activity}
                        defaultChecked={result.parameters.getAll("activity").includes(activity)}
                    />{" "}
                    {activity_labels[activity]}
                </label>
            ))}
        </fieldset>
    );
}
