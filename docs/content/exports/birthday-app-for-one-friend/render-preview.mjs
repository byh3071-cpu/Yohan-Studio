import { execFileSync } from "node:child_process"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, "../../../..")
const assetRoot = join(repoRoot, "public", "images", "blog", "birthday-app-for-one-friend")
const outputPath = join(scriptDir, "birthday-app-reel-preview-v01.mp4")
const workDir = await mkdtemp(join(tmpdir(), "yohan-birthday-reel-"))

const WIDTH = 1080
const HEIGHT = 1920
const COLORS = {
  cream: "#F4F1EA",
  black: "#0A0A0A",
  orange: "#FF5C28",
  gray: "#D8D3CA",
  muted: "#6B665E",
}

const scenes = [
  {
    duration: 3,
    theme: "dark",
    eyebrow: "RESULT FIRST · B1 PLACEHOLDER",
    caption: ["친구 한 명을 위해", "14장짜리 생일 앱"],
    placeholder: "최종 장면 실물 촬영으로 교체",
  },
  {
    duration: 3.5,
    theme: "light",
    eyebrow: "THE FIRST PLAN",
    caption: ["AI로 장면만 만들면", "끝날 줄 알았다"],
    placeholder: "시작 → 다음 장면 촬영으로 교체",
  },
  {
    duration: 3.5,
    theme: "orange",
    eyebrow: "WHAT DIDN'T WORK",
    caption: ["숫자와 동작이", "계속 어긋났다"],
    asset: "image-generation-failures.svg",
  },
  {
    duration: 4,
    theme: "dark",
    eyebrow: "CHANGE THE METHOD",
    caption: ["이미지 대신", "콘티 편집기를 만들었다"],
    asset: "storyboard-editor-safe.png",
  },
  {
    duration: 4,
    theme: "light",
    eyebrow: "HUMAN INTENT × AI IMPLEMENTATION",
    caption: ["의도는 내가 정하고", "AI와 함께 구현했다"],
    asset: "story-flow-14.svg",
  },
  {
    duration: 4,
    theme: "dark",
    eyebrow: "THE FINISH LINE",
    caption: ["완성 기준", "실물 노트북 완주"],
    placeholder: "시작 → 중간 → 마지막 촬영으로 교체",
  },
  {
    duration: 4,
    theme: "light",
    eyebrow: "WHAT REMAINED",
    caption: ["친구는 나중에", "울었다고 했다"],
    placeholder: "노트북을 닫는 아웃트로 촬영으로 교체",
  },
  {
    duration: 2,
    theme: "end",
    eyebrow: "ONE-PERSON AI STUDIO",
    caption: ["Yohan Studio", "만들고 검증한 기록"],
  },
]

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

function themeColors(theme) {
  if (theme === "dark") return { bg: COLORS.black, fg: COLORS.cream, sub: "#B8B1A5" }
  if (theme === "orange") return { bg: COLORS.orange, fg: COLORS.black, sub: COLORS.black }
  if (theme === "end") return { bg: COLORS.cream, fg: COLORS.black, sub: COLORS.orange }
  return { bg: COLORS.cream, fg: COLORS.black, sub: COLORS.muted }
}

function textSvg(scene, index, totalDuration) {
  const { bg, fg, sub } = themeColors(scene.theme)
  const line1 = escapeXml(scene.caption[0])
  const line2 = escapeXml(scene.caption[1])
  const eyebrow = escapeXml(scene.eyebrow)
  const elapsed = scenes.slice(0, index).reduce((sum, item) => sum + item.duration, 0)
  const progress = Math.max(18, Math.round((elapsed / totalDuration) * 840))
  const placeholder = scene.placeholder ? escapeXml(scene.placeholder) : ""

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="${bg}"/>
      <text x="120" y="150" fill="${sub}" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="28" font-weight="700" letter-spacing="2">${eyebrow}</text>
      <text x="960" y="150" text-anchor="end" fill="${sub}" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="26" font-weight="600">${String(index + 1).padStart(2, "0")} / 08</text>
      ${scene.placeholder ? `
        <rect x="120" y="300" width="840" height="780" fill="none" stroke="${sub}" stroke-width="3"/>
        <rect x="210" y="410" width="660" height="420" fill="${scene.theme === "dark" ? COLORS.cream : COLORS.black}"/>
        <rect x="250" y="450" width="580" height="340" fill="${COLORS.orange}"/>
        <circle cx="540" cy="620" r="72" fill="none" stroke="${COLORS.black}" stroke-width="8"/>
        <path d="M500 620h80M540 580v80" stroke="${COLORS.black}" stroke-width="8" stroke-linecap="square"/>
        <path d="M180 850h720l60 110H120z" fill="${scene.theme === "dark" ? COLORS.cream : COLORS.black}"/>
        <text x="540" y="1025" text-anchor="middle" fill="${sub}" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="25" font-weight="600">${placeholder}</text>
      ` : ""}
      <text x="540" y="1325" text-anchor="middle" fill="${fg}" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="72" font-weight="700" letter-spacing="-2">${line1}</text>
      <text x="540" y="1435" text-anchor="middle" fill="${scene.theme === "orange" ? COLORS.black : COLORS.orange}" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="72" font-weight="750" letter-spacing="-2">${line2}</text>
      <rect x="120" y="1530" width="840" height="6" fill="${scene.theme === "dark" ? "#36332E" : COLORS.gray}"/>
      <rect x="120" y="1530" width="${progress}" height="6" fill="${COLORS.orange}"/>
      <text x="120" y="1620" fill="${sub}" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="24" font-weight="500">PREVIEW · 실물 영상과 요한 목소리 삽입 전</text>
    </svg>
  `)
}

async function renderScene(scene, index, totalDuration) {
  const output = join(workDir, `scene-${String(index).padStart(2, "0")}.png`)
  const composites = [{ input: textSvg(scene, index, totalDuration), top: 0, left: 0 }]

  if (scene.asset) {
    const asset = await sharp(join(assetRoot, scene.asset))
      .resize({ width: 800, height: 760, fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer()
    const metadata = await sharp(asset).metadata()
    composites.push({
      input: asset,
      left: Math.round((WIDTH - (metadata.width ?? 800)) / 2),
      top: Math.round(300 + (760 - (metadata.height ?? 760)) / 2),
    })
  }

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(composites)
    .png()
    .toFile(output)

  return output
}

try {
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0)
  const sceneFiles = []

  for (let index = 0; index < scenes.length; index += 1) {
    sceneFiles.push(await renderScene(scenes[index], index, totalDuration))
  }

  const concatLines = []
  for (let index = 0; index < sceneFiles.length; index += 1) {
    concatLines.push(`file '${sceneFiles[index].replaceAll("'", "'\\''")}'`)
    concatLines.push(`duration ${scenes[index].duration}`)
  }
  concatLines.push(`file '${sceneFiles.at(-1).replaceAll("'", "'\\''")}'`)

  const concatPath = join(workDir, "scenes.txt")
  await writeFile(concatPath, `${concatLines.join("\n")}\n`, "utf8")

  execFileSync("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel", "warning",
    "-f", "concat",
    "-safe", "0",
    "-i", concatPath,
    "-t", String(totalDuration),
    "-vf", "fps=30,fade=t=out:st=27.5:d=0.5,format=yuv420p",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "18",
    "-movflags", "+faststart",
    outputPath,
  ], { stdio: "inherit" })

  const probe = execFileSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,avg_frame_rate:format=duration,size",
    "-of", "default=noprint_wrappers=1",
    outputPath,
  ], { encoding: "utf8" })

  process.stdout.write(`${outputPath}\n${probe}`)
} finally {
  await rm(workDir, { recursive: true, force: true })
}
