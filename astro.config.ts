import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
    build: {
        format: "directory",
    },
    integrations: [react()],
    compressHTML: true,
    output: "static",
    trailingSlash: "never",
});
