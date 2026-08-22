// 공개용 생일 앱 데모(shooting-demo.html)의 각 장면을 캡처한다.
//   node scripts/shoot-demo-scenes.mjs <html경로> <출력디렉터리>
import pw from "playwright"
const { chromium } = pw
import path from "node:path"
import fs from "node:fs"
import { pathToFileURL } from "node:url"

const [htmlPath, outDir] = process.argv.slice(2)
if (!htmlPath || !outDir) { console.error("사용법: node scripts/shoot-demo-scenes.mjs <html> <outDir>"); process.exit(1) }
fs.mkdirSync(outDir, { recursive: true })

// 설치된 헤드리스 셸을 직접 지정한다 (playwright 사전릴리스가 요구하는 빌드가 CDN 에 없음)
const shellDir = "C:/Users/user/AppData/Local/ms-playwright"
const shells = fs.readdirSync(shellDir).filter((d) => d.startsWith("chromium_headless_shell-"))
  .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
const exe = path.join(shellDir, shells[0], "chrome-headless-shell-win64", "chrome-headless-shell.exe")
const browser = await chromium.launch({ executablePath: exe })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
await page.goto(pathToFileURL(path.resolve(htmlPath)).href, { waitUntil: "load" })
await page.waitForTimeout(800)

// 시작 버튼이 있으면 눌러 데모로 진입
const startBtn = page.locator("button, .start, #start").first()
if (await startBtn.count()) { try { await startBtn.click({ timeout: 2000 }) } catch {} }
await page.waitForTimeout(1200)

const total = await page.locator("[data-scene]").count()
console.log(`장면 ${total}개 발견`)

for (let i = 0; i < total; i++) {
  await page.evaluate((n) => {
    document.querySelectorAll("[data-scene]").forEach((el) => el.classList.remove("is-active"))
    const t = document.querySelector(`[data-scene="${n}"]`)
    if (t) t.classList.add("is-active")
  }, i)
  await page.waitForTimeout(700)
  const out = path.join(outDir, `scene-${i}.png`)
  await page.screenshot({ path: out })
  console.log(`  scene-${i}.png`)
}

await browser.close()
