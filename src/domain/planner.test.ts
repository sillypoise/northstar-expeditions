import { describe, expect, it } from "vitest";
import type { ExpeditionCatalogEntry } from "./expedition";
import { parse_planner, planner_recovery, planner_url } from "./planner";
import { planner_submission } from "./planner_submission";

// Table-driven mutations exercise the external URL boundary before any price can be produced.
const entry: ExpeditionCatalogEntry = {
    id: "test-expedition",
    data: {
        title: "Test expedition",
        summary: "A bounded fixture.",
        region: "Europe",
        country: "Norway",
        seasons: ["july-september"],
        activities: ["trekking", "photography", "paddling", "wildlife"],
        duration_days: 8,
        base_price_per_person_usd: 25_000,
        difficulty: "moderate",
        route: ["Start", "End"],
        highlights: ["First", "Second"],
        featured: true,
        order: 1,
    },
};
const catalog = [entry];
const query =
    "version=1&step=summary&expedition=test-expedition&season=july-september" +
    "&group_size=8&pace=balanced&activity=trekking";

function changed(field: string, value: string): string {
    const parameters = new URLSearchParams(query);
    parameters.set(field, value);
    return parameters.toString();
}

describe("planner URL boundary", () => {
    it("calculates exactly at the maximum and keeps canonical URLs deterministic", () => {
        const result = parse_planner(query, catalog);
        expect(result.error).toBeNull();
        expect(result.subtotal_usd).toBe(200_000);
        expect(parse_planner(planner_url(result.parameters).split("?")[1] ?? "", catalog)).toEqual(
            result,
        );
        expect(parse_planner(changed("group_size", "1"), catalog).subtotal_usd).toBe(25_000);
    });

    it.each([
        [query + "&unknown=x", "unknown_field"],
        [query + "&version=1", "duplicate_field"],
        [query + "&activity=trekking", "duplicate_field"],
        [changed("version", "2"), "unsupported_version"],
        [query.replace("version=1&", ""), "unsupported_version"],
        [query.replace("&step=summary", ""), "incomplete_plan"],
        [query.replace("&activity=trekking", ""), "incomplete_plan"],
        [changed("group_size", "0"), "value_out_of_range"],
        [changed("group_size", "9"), "value_out_of_range"],
        [changed("group_size", "1.5"), "invalid_value"],
        [changed("group_size", "+1"), "invalid_value"],
        [changed("group_size", " 1"), "invalid_value"],
        [changed("group_size", "01"), "invalid_value"],
        [changed("group_size", "0x1"), "invalid_value"],
        [changed("group_size", "1x"), "invalid_value"],
        [changed("group_size", ""), "invalid_value"],
        [changed("pace", "fast"), "invalid_value"],
        [changed("step", "payment"), "invalid_value"],
        [changed("activity", "climbing"), "invalid_value"],
        [changed("expedition", "removed-expedition"), "unknown_expedition"],
        [changed("expedition", "%FF"), "invalid_value"],
        [changed("season", "january-march"), "unsupported_season"],
        [changed("activity", "culture"), "unsupported_activity"],
        [query + "&activity=photography&activity=paddling&activity=wildlife", "value_out_of_range"],
    ])("rejects %s with %s and no subtotal", (input, error) => {
        const result = parse_planner(input, catalog);
        expect(result.error).toBe(error);
        expect(result.subtotal_usd).toBeNull();
        expect(
            parse_planner(planner_recovery(result, catalog).split("?")[1] ?? "", catalog).error,
        ).toBeNull();
    });

    it("accepts three activities and orders the canonical link by catalog vocabulary", () => {
        const result = parse_planner(query + "&activity=photography&activity=paddling", catalog);
        expect(result.error).toBeNull();
        expect(planner_url(result.parameters)).toContain(
            "activity=paddling&activity=photography&activity=trekking",
        );
    });

    it("initializes empty links and refuses invalid content without arithmetic", () => {
        expect(parse_planner("", catalog).parameters.get("step")).toBe("expedition");
        expect(parse_planner("", catalog).subtotal_usd).toBeNull();
        expect(parse_planner(query, []).error).toBe("invalid_content");
        expect(parse_planner(query, [entry, entry]).error).toBe("invalid_content");
        expect(
            parse_planner(
                query,
                Array.from({ length: 25 }, () => entry),
            ).error,
        ).toBe("invalid_content");
        const corrupt = [{ ...entry, data: { ...entry.data, base_price_per_person_usd: 25_001 } }];
        expect(parse_planner(query, corrupt).error).toBe("invalid_content");
        expect(parse_planner(query, corrupt).subtotal_usd).toBeNull();
    });

    it("enforces raw UTF-8 bytes before allocating parsed fields", () => {
        const boundary = "x=" + "a".repeat(510);
        expect(parse_planner(boundary, catalog).error).toBe("unknown_field");
        expect(parse_planner("?" + boundary, catalog).error).toBe("unknown_field");
        expect(parse_planner(boundary + "a", catalog).error).toBe("query_too_large");
        expect(parse_planner("x=" + "é".repeat(256), catalog).error).toBe("query_too_large");
    });
});

it("preserves independent choices while removing incompatible expedition edits", () => {
    const replacement = {
        ...entry,
        id: "replacement",
        data: {
            ...entry.data,
            seasons: ["january-march"] as const,
            activities: ["photography"] as const,
        },
    };
    const next_catalog = [
        entry,
        {
            ...replacement,
            data: {
                ...replacement.data,
                seasons: [...replacement.data.seasons],
                activities: [...replacement.data.activities],
            },
        },
    ];
    const parameters = new URLSearchParams(query);
    parameters.set("step", "expedition");
    parameters.set("expedition", "replacement");
    const result = planner_submission(parameters, next_catalog);
    expect(result.error).toBeNull();
    expect(result.parameters.has("season")).toBe(false);
    expect(result.parameters.has("activity")).toBe(false);
    expect(result.parameters.get("group_size")).toBe("8");
    expect(parameters.get("season")).toBe("july-september");
});
