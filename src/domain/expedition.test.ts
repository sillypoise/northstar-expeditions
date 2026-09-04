import { describe, expect, it } from "vitest";

import {
    assert_expedition_catalog,
    expedition_schema,
    format_usd,
    maximum_catalog_entries,
    order_expedition_catalog,
    type Expedition,
} from "./expedition";

// These tests cross every catalog limit because malformed Markdown must stop the static build.
const valid_expedition: Expedition = {
    activities: ["trekking", "photography"],
    base_price_per_person_usd: 4_800,
    country: "Norway",
    difficulty: "moderate",
    duration_days: 8,
    featured: true,
    highlights: ["Coastal trail", "Midnight light"],
    order: 1,
    region: "Northern Europe",
    route: ["Bodø", "Reine", "Svolvær"],
    seasons: ["july-september"],
    summary: "A bounded fixture for schema and catalog checks.",
    title: "Fixture expedition",
};

describe("expedition_schema", () => {
    it("accepts values at every numeric boundary", () => {
        const minimum = expedition_schema.safeParse({
            ...valid_expedition,
            base_price_per_person_usd: 1_000,
            duration_days: 3,
        });
        const maximum = expedition_schema.safeParse({
            ...valid_expedition,
            base_price_per_person_usd: 25_000,
            duration_days: 21,
        });

        expect(minimum.success).toBe(true);
        expect(maximum.success).toBe(true);
    });

    it.each([
        ["duration below minimum", { duration_days: 2 }],
        ["duration above maximum", { duration_days: 22 }],
        ["price below minimum", { base_price_per_person_usd: 999 }],
        ["price above maximum", { base_price_per_person_usd: 25_001 }],
        ["fractional price", { base_price_per_person_usd: 4_800.5 }],
        ["unknown activity", { activities: ["climbing"] }],
        ["duplicate season", { seasons: ["july-september", "july-september"] }],
    ])("rejects %s", (_description, changed_fields) => {
        const result = expedition_schema.safeParse({
            ...valid_expedition,
            ...changed_fields,
        });

        expect(result.success).toBe(false);
    });

    it("rejects unknown frontmatter fields", () => {
        const result = expedition_schema.safeParse({
            ...valid_expedition,
            unsupported: true,
        });

        expect(result.success).toBe(false);
    });
});

describe("assert_expedition_catalog", () => {
    it("accepts one entry and the maximum bounded entry count", () => {
        const maximum_catalog = Array.from({ length: maximum_catalog_entries }, (_, index) => ({
            data: { ...valid_expedition, order: index + 1 },
            id: `expedition-${index + 1}`,
        }));

        expect(() =>
            assert_expedition_catalog([{ data: valid_expedition, id: "expedition-1" }]),
        ).not.toThrow();
        expect(() => assert_expedition_catalog(maximum_catalog)).not.toThrow();
    });

    it("returns entries in explicit catalog order without mutating the input", () => {
        const unordered_catalog = [
            { data: { ...valid_expedition, order: 2 }, id: "expedition-2" },
            { data: valid_expedition, id: "expedition-1" },
        ];

        const ordered_catalog = order_expedition_catalog(unordered_catalog);

        expect(ordered_catalog.map((entry) => entry.id)).toEqual(["expedition-1", "expedition-2"]);
        expect(unordered_catalog[0]?.id).toBe("expedition-2");
    });

    it("rejects empty, oversized, and duplicate-order catalogs", () => {
        const oversized_catalog = Array.from(
            { length: maximum_catalog_entries + 1 },
            (_, index) => ({
                data: { ...valid_expedition, order: (index % maximum_catalog_entries) + 1 },
                id: `expedition-${index + 1}`,
            }),
        );
        const duplicate_order_catalog = [
            { data: valid_expedition, id: "expedition-1" },
            { data: valid_expedition, id: "expedition-2" },
        ];

        expect(() => assert_expedition_catalog([])).toThrow("must not be empty");
        expect(() => assert_expedition_catalog(oversized_catalog)).toThrow("at most 24");
        expect(() => assert_expedition_catalog(duplicate_order_catalog)).toThrow(
            "order values must be unique",
        );
    });
});

describe("format_usd", () => {
    it("formats integer US dollars and rejects unsafe values", () => {
        expect(format_usd(0)).toBe("$0");
        expect(format_usd(200_000)).toBe("$200,000");
        expect(() => format_usd(-1)).toThrow("zero or positive");
        expect(() => format_usd(1.5)).toThrow("safe integer");
    });
});
