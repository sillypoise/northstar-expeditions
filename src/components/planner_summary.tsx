import { useState } from "react";
import { activity_labels, format_usd, season_labels } from "../domain/expedition";
import { invariant } from "../domain/invariant";
import { planner_steps, planner_url, type PlannerResult } from "../domain/planner";

export function PlannerSummary({ result }: { readonly result: PlannerResult }) {
    const entry = result.entry;
    invariant(entry !== undefined);
    invariant(result.subtotal_usd !== null);
    const activities = Object.keys(activity_labels)
        .filter((activity) => result.parameters.getAll("activity").includes(activity))
        .map((activity) => activity_labels[activity as keyof typeof activity_labels])
        .join(", ");
    const facts = [
        ["Version", "1"],
        ["Season", season_labels[result.parameters.get("season") as keyof typeof season_labels]],
        ["Travelers", result.parameters.get("group_size")],
        ["Pace preference", result.parameters.get("pace")],
        ["Duration", `${entry.data.duration_days} days`],
        ["Difficulty", entry.data.difficulty],
        ["Route", entry.data.route.join(" → ")],
        ["Activities", activities],
        ["Per person", format_usd(entry.data.base_price_per_person_usd)],
        ["Indicative subtotal", format_usd(result.subtotal_usd)],
    ];
    return (
        <section aria-labelledby="summary-heading">
            <h2 id="summary-heading">Your illustrative plan</h2>
            <h3>{entry.data.title}</h3>
            <dl className="metadata">
                {facts.map(([label, value]) => (
                    <div className="metadata-row" key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                    </div>
                ))}
            </dl>
            <p>
                Fictional itinerary and prices, not a quote, booking, or inquiry. Transport to the
                starting location, insurance, taxes, optional additions, and real availability are
                not included or verified.
            </p>
            <p>
                Pace and activities record preferences; they do not change the fixed route,
                duration, or price.
            </p>
            <p>
                <a href={`/expeditions/${entry.id}`}>Read itinerary and illustrative inclusions</a>
            </p>
            <PlannerSummaryActions result={result} />
        </section>
    );
}

function PlannerSummaryActions({ result }: { readonly result: PlannerResult }) {
    const [copy_status, set_copy_status] = useState("");
    const canonical = new URL(planner_url(result.parameters), window.location.origin).href;
    async function copy_link() {
        try {
            await navigator.clipboard.writeText(canonical);
            set_copy_status("Plan link copied.");
        } catch {
            set_copy_status("Copy unavailable. Select and copy the link below instead.");
        }
    }
    return (
        <div className="no-print">
            <h3>Edit selections</h3>
            <ul>
                {planner_steps.slice(0, 4).map((step) => {
                    const parameters = new URLSearchParams(result.parameters);
                    parameters.set("step", step);
                    return (
                        <li key={step}>
                            <a href={planner_url(parameters)}>Edit {step}</a>
                        </li>
                    );
                })}
            </ul>
            <button type="button" onClick={() => void copy_link()}>
                Copy plan link
            </button>{" "}
            <button type="button" onClick={() => window.print()}>
                Print plan
            </button>
            <p role="status">{copy_status}</p>
            <label>
                Shareable plan URL
                <input
                    readOnly
                    value={canonical}
                    onFocus={(event) => event.currentTarget.select()}
                />
            </label>
            <p>
                <a href="/plan">Reset plan</a>
            </p>
        </div>
    );
}
