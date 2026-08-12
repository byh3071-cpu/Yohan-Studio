import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "archive-design-output.mjs");

const baseManifest = {
  schemaVersion: 1,
  id: "design-test-v1",
  title: "테스트 디자인",
  kind: "design-asset",
  media: "instagram-cardnews",
  owner: "yohan-studio",
  goldenCandidate: false,
  finalAssets: ["output/01.png"],
};

const runArchive = (repositoryRoot, sourceRoot, manifestName) => spawnSync(
  process.execPath,
  [scriptPath, "--source-root", sourceRoot, "--manifest", manifestName],
  { cwd: repositoryRoot, encoding: "utf8" },
);

const withFixture = async (callback) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "yohan-design-archive-"));
  const repositoryRoot = path.join(root, "repository");
  const sourceRoot = path.join(root, "source");
  await mkdir(path.join(repositoryRoot, "docs", "content", "exports"), { recursive: true });
  await mkdir(path.join(sourceRoot, "output"), { recursive: true });
  await writeFile(path.join(sourceRoot, "output", "01.png"), "fixture", "utf8");

  try {
    await callback({ repositoryRoot, sourceRoot });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};

test("미승인 작업본은 파일 복사 전에 거부한다", async () => {
  await withFixture(async ({ repositoryRoot, sourceRoot }) => {
    const manifest = {
      ...baseManifest,
      slug: "pending-design",
      status: "pending-approval",
      approvedBy: "",
      approvedAt: "",
    };
    await writeFile(path.join(sourceRoot, "pending.json"), JSON.stringify(manifest), "utf8");

    const result = runArchive(repositoryRoot, sourceRoot, "pending.json");

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /status는 approved여야 합니다/);
    await assert.rejects(readFile(path.join(repositoryRoot, "docs", "content", "exports", "pending-design", "assets", "final", "01.png")));
  });
});

test("승인자가 없으면 승인 상태여도 거부한다", async () => {
  await withFixture(async ({ repositoryRoot, sourceRoot }) => {
    const manifest = {
      ...baseManifest,
      slug: "missing-approver",
      status: "approved",
      approvedBy: "",
      approvedAt: "2026-08-12",
    };
    await writeFile(path.join(sourceRoot, "missing-approver.json"), JSON.stringify(manifest), "utf8");

    const result = runArchive(repositoryRoot, sourceRoot, "missing-approver.json");

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /approvedBy가 필요합니다/);
  });
});

test("승인일 형식이 틀리면 승인 상태여도 거부한다", async () => {
  await withFixture(async ({ repositoryRoot, sourceRoot }) => {
    const manifest = {
      ...baseManifest,
      slug: "invalid-approval-date",
      status: "approved",
      approvedBy: "yohan",
      approvedAt: "2026/08/12",
    };
    await writeFile(path.join(sourceRoot, "invalid-date.json"), JSON.stringify(manifest), "utf8");

    const result = runArchive(repositoryRoot, sourceRoot, "invalid-date.json");

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /YYYY-MM-DD/);
  });
});

test("승인 상태·승인자·승인일이 있으면 새 revision을 보관한다", async () => {
  await withFixture(async ({ repositoryRoot, sourceRoot }) => {
    const manifest = {
      ...baseManifest,
      slug: "approved-design",
      status: "approved",
      approvedBy: "yohan",
      approvedAt: "2026-08-12",
    };
    await writeFile(path.join(sourceRoot, "approved.json"), JSON.stringify(manifest), "utf8");

    const result = runArchive(repositoryRoot, sourceRoot, "approved.json");

    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      await readFile(path.join(repositoryRoot, "docs", "content", "exports", "approved-design", "assets", "final", "01.png"), "utf8"),
      "fixture",
    );
    const metadata = await readFile(path.join(repositoryRoot, "docs", "content", "exports", "approved-design", "design-intelligence.yaml"), "utf8");
    assert.match(metadata, /status: "approved"/);
    assert.match(metadata, /approved_by: "yohan"/);
    assert.match(metadata, /approved_at: "2026-08-12"/);
  });
});
