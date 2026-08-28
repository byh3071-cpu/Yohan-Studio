import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WARMUPS = 3;
const SAMPLES = 25;

function cleanEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is missing`);
  return value.replace(/^\uFEFF/, "").trim();
}

function summarize(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const percentile = (p: number) => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)];
  const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  return { mean: Number(mean.toFixed(2)), p50: Number(percentile(0.5).toFixed(2)), p95: Number(percentile(0.95).toFixed(2)), min: Number(sorted[0].toFixed(2)), max: Number(sorted[sorted.length - 1].toFixed(2)) };
}

async function probe(endpoint: string, headers: Record<string, string>): Promise<number> {
  const started = performance.now();
  const response = await fetch(endpoint, { headers, cache: "no-store" });
  await response.arrayBuffer();
  if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
  return performance.now() - started;
}

export async function GET() {
  try {
    const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
    const key = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
    const endpoint = `${url}/rest/v1/studio_products?select=id&limit=1`;
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    for (let i = 0; i < WARMUPS; i += 1) await probe(endpoint, headers);
    const samples: number[] = [];
    for (let i = 0; i < SAMPLES; i += 1) samples.push(await probe(endpoint, headers));
    return NextResponse.json({ region: process.env.VERCEL_REGION ?? null, target: "supabase-rest/studio_products", warmups: WARMUPS, sampleCount: SAMPLES, statsMs: summarize(samples), samplesMs: samples.map((value) => Number(value.toFixed(2))) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "benchmark failed", region: process.env.VERCEL_REGION ?? null }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
