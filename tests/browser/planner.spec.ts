import { expect, test } from "@playwright/test";

const summary =
    "/plan?version=1&step=summary&expedition=lofoten-midnight-coast&season=july-september" +
    "&group_size=2&pace=balanced&activity=trekking";

// Test the static build so routing, hydration, history, and fallback cannot be mocked away.
test("complete, reload, copy, edit, history, print, and reset a plan", async ({
    page,
    context,
}) => {
    await page.goto("/expeditions/lofoten-midnight-coast");
    await page.getByRole("link", { name: "Plan this expedition" }).click();
    await page.getByLabel("Departure season").selectOption("july-september");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Travelers").fill("2");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Show plan" }).click();
    await expect(page.getByRole("alert")).toContainText("missing");
    await page.getByLabel("Trekking", { exact: true }).check();
    await page.getByRole("button", { name: "Show plan" }).click();
    await expect(page.getByRole("heading", { name: "Your illustrative plan" })).toBeVisible();
    await expect(page.getByText("$9,600", { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByText("$9,600", { exact: true })).toBeVisible();
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Copy plan link" }).click();
    await expect(page.getByRole("status")).toHaveText("Plan link copied.");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("group_size=2");
    await page.getByRole("link", { name: "Edit group", exact: true }).click();
    await expect(page.getByLabel("Travelers")).toHaveValue("2");
    await page.goBack();
    await expect(page.getByText("$9,600", { exact: true })).toBeVisible();
    await page.goForward();
    await expect(page.getByLabel("Travelers")).toHaveValue("2");
    await page.goto(summary);
    await page.evaluate(() => {
        window.print = () => {
            document.title = "Print requested";
        };
    });
    await page.getByRole("button", { name: "Print plan" }).click();
    await expect(page).toHaveTitle("Print requested");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByText("$9,600", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Print plan" })).toBeHidden();
    await page.emulateMedia({ media: "screen" });
    await page.getByRole("link", { name: "Reset plan", exact: true }).click();
    await expect(page.getByRole("combobox", { name: "Expedition", exact: true })).toHaveValue("");
});

test("malformed links never show prices and provide working recovery", async ({ page }) => {
    await page.goto(summary + "&group_size=3");
    await expect(page.getByRole("alert")).toContainText("repeated");
    await expect(page.getByText("$9,600", { exact: true })).toHaveCount(0);
    await page.getByRole("link", { name: "Review selections" }).click();
    await expect(page.getByLabel("Travelers")).toBeVisible();
    await page.goto(summary.replace("july-september", "january-march"));
    await expect(page.getByRole("alert")).toContainText("season");
    await page.getByRole("link", { name: "Review selections" }).click();
    await expect(page.getByLabel("Departure season")).toBeVisible();
});

test("clipboard denial has a manual recovery path", async ({ page }) => {
    await page.goto(summary);
    await page.evaluate(() => {
        Object.defineProperty(navigator, "clipboard", {
            value: {
                writeText: () => Promise.reject(new Error("Permission denied")),
            },
        });
    });
    await page.getByRole("button", { name: "Copy plan link" }).click();
    await expect(page.getByRole("status")).toContainText("Copy unavailable");
    await expect(page.getByLabel("Shareable plan URL")).toHaveValue(/version=1/);
});

test("directory filters support empty results, reset, and combined matches", async ({ page }) => {
    await page.goto("/expeditions");
    await page.getByRole("combobox", { name: "Destination", exact: true }).selectOption("Norway");
    await page.getByRole("combobox", { name: "Activity", exact: true }).selectOption("culture");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page.getByRole("status")).toContainText("No expeditions match");
    await expect(page.locator("[data-expedition]:visible")).toHaveCount(0);
    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page.locator("[data-expedition]:visible")).toHaveCount(6);
    await page.getByRole("combobox", { name: "Duration", exact: true }).selectOption("long");
    await page.getByRole("combobox", { name: "Activity", exact: true }).selectOption("culture");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page.locator("[data-expedition]:visible")).toHaveCount(1);
});

test("content remains usable without JavaScript and the planner explains its fallback", async ({
    browser,
}) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4322/expeditions");
    await expect(page.locator("[data-expedition]:visible")).toHaveCount(6);
    await expect(page.getByRole("button", { name: "Apply filters" })).toBeHidden();
    await page.goto("http://127.0.0.1:4322/plan");
    await expect(page.getByText(/Interactive planning requires JavaScript/)).toBeVisible();
    await context.close();
});

for (const width of [360, 768, 1440]) {
    test(`planner and directory fit ${width}px with reduced motion`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ reducedMotion: "reduce" });
        for (const route of ["/expeditions", summary]) {
            await page.goto(route);
            await expect(page.getByRole("main")).toBeVisible();
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= window.innerWidth,
                ),
            ).toBe(true);
        }
    });
}
