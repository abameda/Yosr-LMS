import { expect, test } from "@playwright/test";

test("renders the Arabic identity foundation at 360px without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(
    page.getByRole("heading", { name: "أساس واجهة الحسابات جاهز" }),
  ).toBeVisible();

  const documentWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(documentWidth).toBeLessThanOrEqual(360);

  await expect(page.getByText("hello@example.com")).toHaveAttribute(
    "dir",
    "ltr",
  );
  await expect(page.getByText("YSR-1024")).toHaveAttribute("dir", "ltr");
  await expect(page.getByText("2026")).toHaveAttribute("dir", "ltr");
});

test("shows a visible keyboard focus indicator", async ({
  browserName,
  page,
}) => {
  await page.goto("/");

  const skipLink = page.getByRole("link", { name: "انتقل إلى المحتوى" });
  if (browserName === "webkit") {
    await skipLink.focus();
  } else {
    await page.keyboard.press("Tab");
  }

  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveCSS("outline-style", "solid");
});
