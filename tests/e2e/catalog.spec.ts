import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

test("renders the complete design-system catalog without serious accessibility violations", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", {
      name: "One interface language for every Souk SaaS.",
    })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", {
      name: "Operational data without rebuilding the plumbing.",
    })
  ).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  const materialViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? "")
  )
  expect(materialViolations).toEqual([])

  await page.getByRole("button", { name: "Toggle theme" }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  const darkResults = await new AxeBuilder({ page }).analyze()
  const darkMaterialViolations = darkResults.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? "")
  )
  expect(darkMaterialViolations).toEqual([])
})

test("supports the DataTable's core workflow", async ({ page }) => {
  const section = page.locator("#datatable")
  await section.scrollIntoViewIfNeeded()

  const search = section.getByRole("textbox", { name: "Search projects…" })
  await search.fill("Mina")
  await expect(section.getByText("Mina Finance")).toBeVisible()
  await expect(section.getByText("Souk Capture")).toBeHidden()

  await search.fill("")
  await section.getByRole("button", { name: "Status", exact: true }).click()
  await page.getByRole("menuitemcheckbox", { name: /Active/ }).click()
  await page.keyboard.press("Escape")
  await expect(section.getByText("Souk Capture")).toBeVisible()
  await expect(section.getByText("Mina Finance")).toBeHidden()

  await section.getByRole("button", { name: "Toggle columns" }).click()
  await page.getByRole("menuitemcheckbox", { name: "Updated" }).click()
  await expect(
    section.getByRole("columnheader", { name: "Updated" })
  ).toBeHidden()
})

test("has no horizontal page overflow", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
})
