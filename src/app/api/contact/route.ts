import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

import { getSupabaseServer } from '@/lib/supabase-server';
import { getResend, NOTIFY_TO, RESEND_FROM } from '@/lib/resend';
import { createRateLimiter, getClientKey } from '@/lib/rateLimit';

export const runtime = 'nodejs';

/**
 * 문의 요청 1건이 DB 행 + 메일 발송을 만든다. 상한이 없으면 스크립트 하나로
 * 메일 쿼터를 소진시키고 인박스를 덮을 수 있다 — 그러면 정상 문의 알림도 끊긴다.
 * 사람이 10분에 5번 넘게 문의를 보낼 일은 없으므로 창을 넓게, 횟수를 낮게 잡는다.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX = 5;

const limiter = createRateLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
});

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  source?: string;
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SOURCE_LABELS: Record<string, string> = {
  contact_page: '/contact 페이지',
  footer_newsletter: '푸터 뉴스레터',
  service_cta: '서비스 카드 CTA',
  hero_cta: '홈 Hero CTA',
};

function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;
}

export async function POST(req: Request) {
  // 본문 파싱보다 앞에서 끊는다 — 초과 요청이 JSON 파싱·DB·메일에 도달하지 않게.
  if (!limiter.check(getClientKey(req))) {
    return NextResponse.json(
      { ok: false, error: '요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429, headers: { 'retry-after': String(RATE_LIMIT_WINDOW_MS / 1000) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const phone = (body.phone ?? '').trim();
  const subject = (body.subject ?? '').trim();
  const message = (body.message ?? '').trim();
  const source = (body.source ?? 'contact_page').trim().slice(0, 60);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: '이름·이메일·메시지는 필수 입력 항목입니다.' },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: '이메일 형식을 확인해주세요.' },
      { status: 400 },
    );
  }
  if (name.length > 80 || phone.length > 40 || subject.length > 120) {
    return NextResponse.json(
      { ok: false, error: '입력 길이를 확인해주세요.' },
      { status: 400 },
    );
  }
  if (message.length < 1 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: '메시지는 1~5000자 사이로 작성해주세요.' },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServer();
  const { data: inserted, error: dbError } = await supabase
    .from('studio_contacts')
    .insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      source,
    })
    .select('id, created_at')
    .single();

  if (dbError) {
    console.error('[contact] supabase insert failed', dbError);
    Sentry.captureException(dbError);
    return NextResponse.json(
      { ok: false, error: '문의 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }

  const safeSubject = subject || '(제목 없음)';
  const emailSubject = `[요한 스튜디오 문의] ${safeSubject}`;
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.65;color:#0A0A0A;">
      <h2 style="margin:0 0 16px;font-size:18px;">새 문의가 도착했습니다</h2>
      <table style="border-collapse:collapse;width:100%;max-width:560px;">
        <tbody>
          <tr><td style="padding:6px 12px;background:#F4F1EA;width:90px;font-weight:600;">이름</td><td style="padding:6px 12px;border-bottom:1px solid #EEEAE0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 12px;background:#F4F1EA;font-weight:600;">이메일</td><td style="padding:6px 12px;border-bottom:1px solid #EEEAE0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          ${phone ? `<tr><td style="padding:6px 12px;background:#F4F1EA;font-weight:600;">연락처</td><td style="padding:6px 12px;border-bottom:1px solid #EEEAE0;">${escapeHtml(phone)}</td></tr>` : ''}
          <tr><td style="padding:6px 12px;background:#F4F1EA;font-weight:600;">제목</td><td style="padding:6px 12px;border-bottom:1px solid #EEEAE0;">${escapeHtml(safeSubject)}</td></tr>
          <tr><td style="padding:6px 12px;background:#F4F1EA;font-weight:600;">출처</td><td style="padding:6px 12px;border-bottom:1px solid #EEEAE0;">${escapeHtml(sourceLabel(source))}</td></tr>
        </tbody>
      </table>
      <h3 style="margin:24px 0 8px;font-size:15px;">메시지</h3>
      <div style="white-space:pre-wrap;padding:14px 16px;background:#F4F1EA;border-left:3px solid #FF5C28;">${escapeHtml(message)}</div>
      <p style="margin:24px 0 0;font-size:12px;color:#6B6357;">
        Row ID: ${inserted?.id ?? 'unknown'}<br>
        Supabase Table Editor → studio_contacts 에서 status 갱신 가능.
      </p>
    </div>
  `.trim();

  const text = [
    '새 문의가 도착했습니다',
    '',
    `이름: ${name}`,
    `이메일: ${email}`,
    phone ? `연락처: ${phone}` : null,
    `제목: ${safeSubject}`,
    `출처: ${sourceLabel(source)}`,
    '',
    '메시지:',
    message,
    '',
    `Row ID: ${inserted?.id ?? 'unknown'}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const resend = getResend();
    const { error: sendError } = await resend.emails.send({
      from: RESEND_FROM,
      to: NOTIFY_TO,
      replyTo: email,
      subject: emailSubject,
      html,
      text,
    });
    if (sendError) {
      console.error('[contact] resend send failed', sendError);
      Sentry.captureException(sendError);
    }
  } catch (err) {
    console.error('[contact] resend threw', err);
    Sentry.captureException(err);
  }

  return NextResponse.json({ ok: true, id: inserted?.id }, { status: 201 });
}
