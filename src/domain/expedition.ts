import assert from "node:assert/strict";

import { z } from "zod";

export const maximum_catalog_entries = 24;
export const maximum_price_per_person_usd = 25_000;
export const minimum_price_per_person_usd = 1_000;

export const activity_slugs = [
    "culture",
    "paddling",
    "photography",
    "stargazing",
    "trekking",
    "wildlife",
] as const;

export const season_slugs = [
    "january-march",
    "april-june",
    "july-september",
    "october-december",
] as const;

export const activity_labels: Readonly<Record<(typeof activity_slugs)[number], string>> = {
    culture: "Culture",
    paddling: "Paddling",
    photography: "Photography",
    stargazing: "Stargazing",
    trekking: "Trekking",
    wildlife: "Wildlife",
};

export const season_labels: Readonly<Record<(typeof season_slugs)[number], string>> = {
    "january-march": "January–March",
    "april-june": "April–June",
    "july-september": "July–September",
    "october-december": "October–December",
};

const short_text_schema = z.string().trim().min(1).max(80);

export const expedition_schema = z
    .object({
        title: short_text_schema,
        summary: z.string().trim().min(1).max(180),
        region: short_text_schema,
        country: short_text_schema,
        seasons: z.array(z.enum(season_slugs)).min(1).max(season_slugs.length),
        activities: z.array(z.enum(activity_slugs)).min(1).max(activity_slugs.length),
        duration_days: z.number().int().min(3).max(21),
        base_price_per_person_usd: z
            .number()
            .int()
            .min(minimum_price_per_person_usd)
            .max(maximum_price_per_person_usd),
        difficulty: z.enum(["easy", "moderate", "demanding"]),
        route: z.array(short_text_schema).min(2).max(8),
        highlights: z.array(short_text_schema).min(2).max(4),
        featured: z.boolean(),
        order: z.number().int().min(1).max(maximum_catalog_entries),
    })
    .strict()
    .refine((expedition) => new Set(expedition.seasons).size === expedition.seasons.length, {
        message: "Season values must be unique.",
        path: ["seasons"],
    })
    .refine((expedition) => new Set(expedition.activities).size === expedition.activities.length, {
        message: "Activity values must be unique.",
        path: ["activities"],
    });

export type Expedition = z.infer<typeof expedition_schema>;

export interface ExpeditionCatalogEntry {
    readonly id: string;
    readonly data: Expedition;
}

export function assert_expedition_catalog(
    catalog_entries: readonly ExpeditionCatalogEntry[],
): void {
    assert(catalog_entries.length > 0, "The expedition catalog must not be empty.");
    assert(
        catalog_entries.length <= maximum_catalog_entries,
        `The expedition catalog must contain at most ${maximum_catalog_entries} entries.`,
    );

    const identifiers = new Set(catalog_entries.map((entry) => entry.id));
    const order_values = new Set(catalog_entries.map((entry) => entry.data.order));

    assert(identifiers.size === catalog_entries.length, "Expedition identifiers must be unique.");
    assert(order_values.size === catalog_entries.length, "Expedition order values must be unique.");
}

export function order_expedition_catalog<const Entry extends ExpeditionCatalogEntry>(
    catalog_entries: readonly Entry[],
): Entry[] {
    assert_expedition_catalog(catalog_entries);

    const ordered_entries = catalog_entries.toSorted(
        (left_entry, right_entry) => left_entry.data.order - right_entry.data.order,
    );

    assert(ordered_entries.length === catalog_entries.length);
    assert(ordered_entries[0] !== undefined);
    return ordered_entries;
}

export function format_usd(amount_usd: number): string {
    assert(
        Number.isSafeInteger(amount_usd),
        "A displayed US-dollar amount must be a safe integer.",
    );
    assert(amount_usd >= 0, "A displayed US-dollar amount must be zero or positive.");

    return new Intl.NumberFormat("en-US", {
        currency: "USD",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        style: "currency",
        useGrouping: true,
    }).format(amount_usd);
}
