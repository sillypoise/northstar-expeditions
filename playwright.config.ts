import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/browser",
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 30_000,
    use: { baseURL: "http://127.0.0.1:4322", browserName: "chromium", trace: "retain-on-failure" },
    webServer: {
        command: "just preview",
        url: "http://127.0.0.1:4322",
        reuseExistingServer: false,
        timeout: 30_000,
    },
});
