import { mkdir, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

const loadSharp = () => {
  try {
    return createRequire(import.meta.url)("sharp");
  } catch (localError) {
    try {
      const commonGitDir = execFileSync(
        "git",
        ["rev-parse", "--path-format=absolute", "--git-common-dir"],
        { cwd: process.cwd(), encoding: "utf8", windowsHide: true },
      ).trim();
      const primaryCheckoutRoot = path.dirname(commonGitDir);
      return createRequire(path.join(primaryCheckoutRoot, "package.json"))("sharp");
    } catch (primaryError) {
      console.error("sharp를 찾지 못했습니다. Yohan Studio 주 작업트리에서 의존성을 먼저 설치한 뒤 다시 실행하세요.");
      console.error(`로컬 탐색: ${localError.message}`);
      console.error(`주 작업트리 탐색: ${primaryError.message}`);
      process.exit(2);
    }
  }
};

const sharp = loadSharp();

const args = process.argv.slice(2);
const valueOf = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
};

const inputArg = valueOf("--input");
const outputArg = valueOf("--output");

if (!inputArg) {
  console.error("사용법: node validate-carousel.mjs --input <PNG 폴더> [--output <미리보기 폴더>]");
  process.exit(2);
}

const inputDir = path.resolve(inputArg);
const outputDir = path.resolve(outputArg ?? inputDir);
const entries = await readdir(inputDir, { withFileTypes: true });
const cardPattern = /^(\d{2})-[a-z0-9][a-z0-9-]*\.png$/i;
const cards = entries
  .filter((entry) => entry.isFile() && cardPattern.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => Number(a.slice(0, 2)) - Number(b.slice(0, 2)) || a.localeCompare(b, "en"));

if (cards.length === 0) {
  console.error("검사할 번호 PNG가 없습니다. 예: 01-cover.png");
  process.exit(1);
}

const failures = [];
const seenNumbers = new Map();
for (const [index, name] of cards.entries()) {
  const number = name.slice(0, 2);
  if (seenNumbers.has(number)) {
    failures.push(`${name}: ${number}번이 중복됐습니다. 기존 파일 ${seenNumbers.get(number)}`);
  } else {
    seenNumbers.set(number, name);
  }

  const metadata = await sharp(path.join(inputDir, name)).metadata();
  if (metadata.format !== "png") failures.push(`${name}: PNG가 아닙니다.`);
  if (metadata.width !== 1080 || metadata.height !== 1350) {
    failures.push(`${name}: ${metadata.width}×${metadata.height}, 예상 1080×1350`);
  }
  if (metadata.channels !== 3) {
    failures.push(`${name}: ${metadata.channels}채널, RGB 3채널이어야 합니다.`);
  }
}

const uniqueNumbers = [...seenNumbers.keys()].sort();
for (const [index, number] of uniqueNumbers.entries()) {
  const expected = String(index + 1).padStart(2, "0");
  if (number !== expected) failures.push(`${number}번: 순차 번호가 아닙니다. 예상 ${expected}`);
}

if (failures.length > 0) {
  console.error("카드뉴스 규격 검증 실패");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

await mkdir(outputDir, { recursive: true });

const compositeSheet = async ({ width, height, columns, filename }) => {
  const rows = Math.ceil(cards.length / columns);
  const composites = await Promise.all(cards.map(async (name, index) => ({
    input: await sharp(path.join(inputDir, name))
      .resize(width, height, { fit: "fill", kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer(),
    left: (index % columns) * width,
    top: Math.floor(index / columns) * height,
  })));

  await sharp({
    create: {
      width: width * columns,
      height: height * rows,
      channels: 3,
      background: { r: 6, g: 6, b: 8 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(outputDir, filename));
};

await compositeSheet({
  width: 270,
  height: 338,
  columns: 4,
  filename: "preview-contact-sheet.png",
});

await compositeSheet({
  width: 540,
  height: 675,
  columns: 2,
  filename: "preview-instagram-scale.png",
});

console.log(`PASS: ${cards.length}장, 1080×1350 RGB PNG`);
console.log(`미리보기: ${path.join(outputDir, "preview-contact-sheet.png")}`);
console.log(`축소 검토본: ${path.join(outputDir, "preview-instagram-scale.png")}`);
