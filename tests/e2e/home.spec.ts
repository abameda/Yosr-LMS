import { expect, test } from "@playwright/test";

test("shows the application readiness page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Ready for development." }),
  ).toBeVisible();
});
