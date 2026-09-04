import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

import { expedition_schema } from "./domain/expedition";

const expeditions = defineCollection({
    loader: glob({
        base: "./src/content/expeditions",
        deferRender: false,
        pattern: "**/*.md",
        retainBody: true,
    }),
    schema: expedition_schema,
});

const pages = defineCollection({
    loader: glob({
        base: "./src/content/pages",
        deferRender: false,
        pattern: "**/*.md",
        retainBody: true,
    }),
    schema: z
        .object({
            title: z.string().trim().min(1).max(80),
            description: z.string().trim().min(1).max(180),
            eyebrow: z.string().trim().min(1).max(40),
        })
        .strict(),
});

export const collections = { expeditions, pages };
