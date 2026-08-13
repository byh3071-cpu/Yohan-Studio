import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const ROUTES = [
  "/",
  "/blog",
  "/learning-log",
  "/showroom",
  "/diagnosis",
  "/services",
  "/store",
  "/guides/luna-max",
] as const

const IGNORE_CONSOLE = [
  /favicon/i,
  /Failed to load resource.*404/i,
  /net::ERR_/i,
]

function collectConsoleErrors(page: import("@playwright/test").Page) {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text())
  })
  page.on("pageerror", (err) => errors.push(err.message))
  page.on("response", (response) => {
    if (response.status() >= 500) {
      errors.push(`HTTP ${response.status()} ${response.url()}`)
    }
  })
  return errors
}

test("플렉시블 대표 사례 — 근거·한계·개인정보 회고 노출", async ({ page }) => {
  const response = await page.goto("/showroom/flexible-seat-randomizer", {
    waitUntil: "networkidle",
  })

  expect(response?.status()).toBe(200)
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "출석 기반 랜덤 자리배치기",
  )
  await expect(page.getByText("2~3분 → 10초 이내").first()).toBeVisible()
  await expect(page.getByText("개인정보와 운영 책임")).toBeVisible()
  await expect(page.getByText("평상시 기준으로만 표기").first()).toBeVisible()

  // 히어로 데모 영상 + 썸네일 poster
  const heroVideo = page.locator("video")
  await expect(heroVideo).toHaveCount(1)
  await expect(heroVideo).toHaveAttribute("poster", /cover\.png/)

  // 공개 저장소이므로 노출 금지 대상(과거 데모 URL·기관 실명) 원문을 테스트에 두지 않는다.
  // 이 페이지의 배포·저장소 링크는 익명 재구축판만 허용한다.
  await expect(
    page.locator(
      'a[href*="vercel.app"]:not([href*="flexible-seat-randomizer.vercel.app"])',
    ),
  ).toHaveCount(0)
  await expect(
    page.locator(
      'a[href*="github.com"][href*="flexible"]:not([href*="flexible-seat-randomizer"])',
    ),
  ).toHaveCount(0)
  await expect(
    page.locator('a[href="https://flexible-seat-randomizer.vercel.app"]').first(),
  ).toBeVisible()
})

test("쇼룸 — 대표 사례와 기존 프로젝트를 분리", async ({ page }) => {
  await page.goto("/showroom", { waitUntil: "networkidle" })

  await expect(page.getByText("대표 문제 해결 사례").first()).toBeVisible()
  await expect(page.getByText("출석 기반 랜덤 자리배치기").first()).toBeVisible()
  await expect(page.getByRole("heading", { name: /기존 프로젝트/ })).toBeVisible()

  const flagshipLinks = page.getByRole("link", {
    name: "출석 기반 랜덤 자리배치기",
  })
  await expect(flagshipLinks).toHaveCount(1)
})

function filterConsoleErrors(errors: string[]) {
  return errors.filter((e) => !IGNORE_CONSOLE.some((re) => re.test(e)))
}

for (const path of ROUTES) {
  test(`${path} — 200, h1, console clean, a11y smoke`, async ({ page }) => {
    const errors = collectConsoleErrors(page)

    const res = await page.goto(path, { waitUntil: "networkidle" })
    expect(res?.status(), `HTTP status for ${path}`).toBe(200)

    await expect(page.locator("h1").first(), `h1 on ${path}`).toBeVisible()

    const criticalConsole = filterConsoleErrors(errors)
    expect(
      criticalConsole,
      `console errors on ${path}: ${criticalConsole.join(" | ")}`,
    ).toEqual([])

    const axe = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze()
    const serious = axe.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    )
    expect(
      serious,
      `a11y serious/critical on ${path}: ${serious.map((v) => v.id).join(", ")}`,
    ).toEqual([])
  })
}
