import { expect, test } from "@playwright/test";

const summary =
    "/plan?version=1&step=summary&expedition=lofoten-midnight-coast&season=july-september" +
    "&group_size=8&pace=active&activity=paddling";

// These scenarios deliberately cross capability boundaries instead of relying on hidden controls.
test("keyboard navigation, invalid numeric boundaries, and native constraint recovery", async ({
    page,
}) => {
    await page.goto("/plan");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    const expedition = page.getByRole("combobox", { name: "Expedition", exact: true });
    await expect(expedition).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: /Step 2/ })).toBeVisible();
    await page.goto(summary.replace("step=summary", "step=group"));
    const travelers = page.getByLabel("Travelers");
    await travelers.fill("9");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(travelers).toBeFocused();
    expect(
        await travelers.evaluate((element: HTMLInputElement) => element.validity.rangeOverflow),
    ).toBe(true);
    await travelers.fill("1");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: /Step 4/ })).toBeVisible();
});

test("changing expedition discards incompatible choices but retains group and pace", async ({
    page,
}) => {
    await page.goto(summary);
    await page.getByRole("link", { name: "Edit expedition", exact: true }).click();
    await page
        .getByRole("combobox", { name: "Expedition", exact: true })
        .selectOption("iceland-winter-light");
    await page.getByRole("button", { name: "Continue" }).click();
    const parameters = new URL(page.url()).searchParams;
    expect(parameters.has("season")).toBe(false);
    expect(parameters.has("activity")).toBe(false);
    expect(parameters.get("group_size")).toBe("8");
    expect(parameters.get("pace")).toBe("active");
    await page
        .getByRole("combobox", { name: "Departure season", exact: true })
        .selectOption("january-march");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByLabel("Travelers")).toHaveValue("8");
});

test("failed hydration keeps the static recovery message visible", async ({ page }) => {
    await page.route("**/_astro/*.js", (route) => route.abort("failed"));
    await page.goto(summary);
    await expect(page.getByText(/Interactive planning requires JavaScript/)).toBeVisible();
    await expect(page.getByText("Indicative subtotal", { exact: true })).toHaveCount(0);
});

test("directory loads no planner or React scripts and unknown routes return 404", async ({
    page,
}) => {
    const script_urls: string[] = [];
    page.on("request", (request) => {
        if (request.resourceType() === "script") script_urls.push(request.url());
    });
    await page.goto("/expeditions");
    await expect(page.getByRole("button", { name: "Apply filters" })).toBeVisible();
    expect(script_urls).toEqual([]);
    const response = await page.goto("/expeditions/no-such-expedition");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: "Browse expeditions", exact: true })).toBeVisible();
});
