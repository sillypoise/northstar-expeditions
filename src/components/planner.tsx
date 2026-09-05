import { useState, type SubmitEvent } from "react";
import type { ExpeditionCatalogEntry } from "../domain/expedition";
import {
    parse_planner,
    planner_recovery,
    planner_steps,
    planner_url,
    type PlannerResult,
    type PlannerStep,
} from "../domain/planner";
import { planner_submission } from "../domain/planner_submission";
import { PlannerFields } from "./planner_fields";
import { PlannerSummary } from "./planner_summary";

interface Props {
    readonly catalog: readonly ExpeditionCatalogEntry[];
}

export default function Planner({ catalog }: Props) {
    const result = parse_planner(window.location.search, catalog);
    if (result.error !== null) {
        return (
            <section aria-labelledby="planner-error">
                <h2 id="planner-error">This plan needs attention</h2>
                <p role="alert">{error_messages[result.error]}</p>
                <p>
                    <code>{result.error}</code>
                </p>
                <p>
                    <a href={planner_recovery(result, catalog)}>Review selections</a>
                </p>
                <p>
                    <a href="/plan">Reset plan</a>
                </p>
            </section>
        );
    }
    if (result.subtotal_usd !== null) return <PlannerSummary result={result} />;
    return <PlannerForm result={result} catalog={catalog} />;
}

const error_messages = {
    query_too_large: "This link is too long. Reset to start a bounded plan.",
    unknown_field: "This link contains an unrecognized field. Review known selections or reset.",
    duplicate_field: "A selection is repeated. Review your choices before continuing.",
    unsupported_version: "This planner version is not supported. Start a version 1 plan.",
    incomplete_plan: "Some required selections are missing. Continue from the first missing step.",
    invalid_value: "A selection is not a recognized choice. Review the affected step.",
    value_out_of_range: "Choose 1–8 travelers and 1–3 activities.",
    unknown_expedition:
        "This expedition is no longer in the active collection. Choose another journey.",
    unsupported_season: "That season is not offered for this expedition. Choose an offered season.",
    unsupported_activity:
        "An activity is not offered for this expedition. Choose supported activities.",
    invalid_content: "The expedition information is unavailable. No price has been calculated.",
};

function PlannerForm({ result, catalog }: Props & { readonly result: PlannerResult }) {
    const step = result.parameters.get("step") as PlannerStep;
    const [submission_error, set_submission_error] = useState("");
    function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        const parameters = new URLSearchParams();
        for (const [key, value] of fields) {
            if (typeof value !== "string") {
                set_submission_error("Only fixed text choices are supported.");
                return;
            }
            parameters.append(key, value);
        }
        const next = planner_submission(parameters, catalog);
        if (next.error !== null) {
            set_submission_error(error_messages[next.error]);
            return;
        }
        window.location.assign(planner_url(next.parameters));
    }
    return (
        <section aria-labelledby="step-heading">
            <h2 id="step-heading">
                Step {planner_steps.indexOf(step) + 1} of 4: {step}
            </h2>
            <form onSubmit={submit}>
                <PlannerFields result={result} catalog={catalog} />
                <p role="alert">{submission_error}</p>
                <button type="submit">{step === "activities" ? "Show plan" : "Continue"}</button>
            </form>
            <p>
                <a href="/plan">Reset plan</a>
            </p>
        </section>
    );
}
