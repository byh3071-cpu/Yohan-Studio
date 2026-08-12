import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const valueOf = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
};

const sourceRoot = valueOf("--source-root");
const manifestArg = valueOf("--manifest");

if (!sourceRoot || !manifestArg) {
  console.error("사용법: npm run content:archive-design -- --source-root <경로> --manifest <JSON 경로>");
  process.exit(1);
}

const repositoryRoot = process.cwd();
const sourceRootAbs = path.resolve(sourceRoot);
const manifestAbs = path.resolve(sourceRootAbs, manifestArg);
const manifest = JSON.parse(await readFile(manifestAbs, "utf8"));

if (manifest.schemaVersion !== 1) throw new Error("지원하지 않는 schemaVersion입니다.");
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.slug)) throw new Error("slug 형식이 올바르지 않습니다.");
if (!Array.isArray(manifest.finalAssets) || manifest.finalAssets.length === 0) throw new Error("finalAssets가 비어 있습니다.");

const exportsRoot = path.resolve(repositoryRoot, "docs", "content", "exports");
const targetRoot = path.resolve(exportsRoot, manifest.slug);
if (!targetRoot.startsWith(`${exportsRoot}${path.sep}`)) throw new Error("대상 경로가 exports 루트를 벗어났습니다.");

try {
  const existing = await readdir(targetRoot);
  if (existing.length > 0) throw new Error(`이미 보관된 slug입니다: ${manifest.slug}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const resolveSource = (relativePath) => {
  const absolutePath = path.resolve(sourceRootAbs, relativePath);
  if (!absolutePath.startsWith(`${sourceRootAbs}${path.sep}`)) throw new Error(`소스 루트를 벗어난 경로입니다: ${relativePath}`);
  return absolutePath;
};

const sha256 = async (filePath) => {
  const data = await readFile(filePath);
  return createHash("sha256").update(data).digest("hex");
};

const copyJobs = [
  ...manifest.finalAssets.map((asset) => ({ source: asset, target: path.join("assets", "final", path.basename(asset)), role: "final" })),
  ...(manifest.sourceAssets ?? []).map((asset) => ({ source: asset, target: path.join("assets", "source", path.basename(asset)), role: "generated-source" })),
  ...(manifest.documents ?? []).map((document) => ({ source: document.source, target: document.target, role: "document" })),
];

const targetNames = new Set();
for (const job of copyJobs) {
  const sourcePath = resolveSource(job.source);
  const info = await stat(sourcePath);
  if (!info.isFile()) throw new Error(`파일이 아닙니다: ${job.source}`);
  const targetPath = path.resolve(targetRoot, job.target);
  if (!targetPath.startsWith(`${targetRoot}${path.sep}`)) throw new Error(`대상 루트를 벗어난 경로입니다: ${job.target}`);
  if (targetNames.has(targetPath)) throw new Error(`중복 대상 경로입니다: ${job.target}`);
  targetNames.add(targetPath);
}

const copiedFiles = [];
const copyTracked = async (sourceRelative, targetRelative, role) => {
  const sourcePath = resolveSource(sourceRelative);
  const targetPath = path.resolve(targetRoot, targetRelative);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  copiedFiles.push({ path: path.relative(repositoryRoot, targetPath).replaceAll("\\", "/"), role, sha256: await sha256(targetPath) });
};

for (const job of copyJobs) {
  await copyTracked(job.source, job.target, job.role);
}

const yamlQuote = (value) => JSON.stringify(String(value));
const yamlList = (key, values) => values.length
  ? [`${key}:`, ...values.map((value) => `  - ${yamlQuote(value)}`)]
  : [`${key}: []`];

const metadata = [
  "schema_version: 1",
  `id: ${yamlQuote(manifest.id)}`,
  `kind: ${yamlQuote(manifest.kind)}`,
  `title: ${yamlQuote(manifest.title)}`,
  `media: ${yamlQuote(manifest.media)}`,
  `owner: ${yamlQuote(manifest.owner)}`,
  `status: ${yamlQuote(manifest.status)}`,
  `golden_candidate: ${Boolean(manifest.goldenCandidate)}`,
  `source_ref: ${yamlQuote(path.relative(repositoryRoot, targetRoot).replaceAll("\\", "/"))}`,
  `preview_ref: ${yamlQuote(path.relative(repositoryRoot, path.join(targetRoot, "assets", "final", "preview-contact-sheet.png")).replaceAll("\\", "/"))}`,
  `approved_by: ${yamlQuote(manifest.approvedBy)}`,
  `approved_at: ${yamlQuote(manifest.approvedAt)}`,
  ...yamlList("reusable_parts", manifest.reusableParts ?? []),
  ...yamlList("avoid_patterns", manifest.avoidPatterns ?? []),
  ...yamlList("provenance", manifest.provenance ?? []),
  "files:",
  ...copiedFiles.flatMap((file) => [
    `  - path: ${yamlQuote(file.path)}`,
    `    role: ${yamlQuote(file.role)}`,
    `    sha256: ${yamlQuote(file.sha256)}`,
  ]),
  "",
].join("\n");

await writeFile(path.join(targetRoot, "design-intelligence.yaml"), metadata, "utf8");
console.log(`보관 완료: ${path.relative(repositoryRoot, targetRoot)}`);
console.log(`파일 ${copiedFiles.length}개 + design-intelligence.yaml`);
