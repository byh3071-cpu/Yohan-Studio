// SVG 다이어그램을 PNG 로 렌더한다 (네이버 등 SVG 미지원 채널용).
//   node scripts/svg-to-png.mjs <svg경로> [<svg경로> ...]
import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const inputs = process.argv.slice(2)
if (!inputs.length) {
  console.error("사용법: node scripts/svg-to-png.mjs <svg경로> [...]")
  process.exit(1)
}

for (const rel of inputs) {
  const abs = path.resolve(rel)
  if (!fs.existsSync(abs)) { console.error(`✖ 없음: ${rel}`); continue }
  const out = abs.replace(/\.svg$/i, ".png")
  await sharp(fs.readFileSync(abs), { density: 192 })
    .flatten({ background: "#ffffff" })
    .resize(1600, 900, { fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile(out)
  const meta = await sharp(out).metadata()
  console.log(`생성: ${path.relative(process.cwd(), out)} (${meta.width}x${meta.height}, ${(fs.statSync(out).size/1024).toFixed(0)}KB)`)
}
