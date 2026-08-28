import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WARMUPS = 3;
const SAMPLES = 25;
const ENDPOINT = "https://uizwhuhlqxcfjgfdvblf.supabase.co/rest/v1/stories?select=id&limit=1";
const API_KEY = "sb_publishable_qxmdaylQ_Uw1Vzs_3yMqsw_hjA_59ZI";

function summarize(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const percentile = (p: number) => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)];
  const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  return {
    mean: Number(mean.toFixed(2)),
    p50: Number(percentile(0.5).toFixed(2)),
    p95: Number(percentile(0.95).toFixed(2)),
    min: Number(sorted[0].toFixed(2)),
    max: Number(sorted[sorted.length - 1].toFixed(2)),
  };
}

async function probe(): Promise<number> {
  const started = performance.now();
  const response = await fetch(ENDPOINT, { headers: { apikey: API_KEY }, cache: "no-store" });
  await response.arrayBuffer();
  if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
  return performance.now() - started;
}

export async function GET() {
  try {
    for (let i = 0; i < WARMUPS; i += 1) await probe();
    const samples: number[] = [];
    for (let i = 0; i < SAMPLES; i += 1) samples.push(await probe());
    return NextResponse.json({
      region: process.env.VERCEL_REGION ?? null,
      target: "aroo-supabase-rest/stories",
      warmups: WARMUPS,
      sampleCount: SAMPLES,
      statsMs: summarize(samples),
      samplesMs: samples.map((value) => Number(value.toFixed(2))),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "benchmark failed", region: process.env.VERCEL_REGION ?? null }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
