import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const maximum_html_size_bytes = 100_000;
const expected_html_paths = [
    "404.html",
    "expeditions/canadian-rockies-ridgelines/index.html",
    "expeditions/hokkaido-forest-and-volcano/index.html",
    "expeditions/iceland-winter-light/index.html",
    "expeditions/index.html",
    "expeditions/lofoten-midnight-coast/index.html",
    "expeditions/namib-desert-night-sky/index.html",
    "expeditions/patagonia-wind-and-granite/index.html",
    "index.html",
    "plan/index.html",
] as const;

// The static artifact is checked directly because source structure cannot prove what ships.
assert(expected_html_paths.length === 10);
assert(maximum_html_size_bytes > 0);

for (const relative_path of expected_html_paths) {
    const absolute_path = resolve("dist", relative_path);
    const size_bytes = statSync(absolute_path).size;
    const html = readFileSync(absolute_path, { encoding: "utf8", flag: "r" });
    const is_script_free = html.includes("<script") === false;

    assert(size_bytes > 0, `${relative_path} must not be empty.`);
    assert(
        size_bytes <= maximum_html_size_bytes,
        `${relative_path} exceeds ${maximum_html_size_bytes} bytes.`,
    );
    assert(
        html.includes('<main id="main-content">'),
        `${relative_path} must include main content.`,
    );
    assert(html.includes("<title>"), `${relative_path} must include a document title.`);
    if (relative_path !== "plan/index.html") {
        assert(html.includes("<astro-island") === false, "Only the planner may hydrate React.");
        if (relative_path !== "expeditions/index.html") {
            assert(is_script_free, `${relative_path} must not ship client JavaScript.`);
        }
    }
}
