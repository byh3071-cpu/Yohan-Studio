/**
 * 공용 in-memory 레이트리미터.
 *
 * chat·tts 라우트가 같은 구현을 각자 복사해 두고 있었고 contact 는 아예 없었다.
 * 세 곳을 여기로 모은다.
 *
 * ⚠️ 단일 인스턴스 전용이다. Vercel 서버리스는 인스턴스가 여러 개 뜨고 콜드스타트마다
 * 메모리가 비므로, 이건 **남용 완화이지 강한 보증이 아니다**. 실제 상한이 필요해지면
 * (예: 유료 API 호출을 막아야 할 때) KV·Redis 같은 공유 저장소로 교체한다.
 */

export type RateLimiter = {
  /** 허용이면 true, 초과면 false. 호출 자체가 카운트를 증가시킨다. */
  check(key: string): boolean
  /** 테스트·관측용 — 현재 추적 중인 키 수 */
  size(): number
}

type Bucket = { count: number; resetAt: number }

export type RateLimiterOptions = {
  /** 창 길이(ms) */
  windowMs: number
  /** 창당 허용 횟수 */
  max: number
  /**
   * 추적할 키 수 상한. 초과하면 만료분을 쓸어내고, 그래도 넘으면 가장 먼저 만료될
   * 키부터 버린다. 상한이 없으면 IP 를 바꿔 가며 때리는 것만으로 메모리가 무한히 는다
   * (기존 chat·tts 구현의 결함).
   */
  maxKeys?: number
}

export function createRateLimiter({
  windowMs,
  max,
  maxKeys = 10_000,
}: RateLimiterOptions): RateLimiter {
  const buckets = new Map<string, Bucket>()

  /** 만료 엔트리 제거. Map 은 삽입 순서를 유지하지만 만료 순서와는 다르므로 전수 순회한다. */
  function sweep(now: number): void {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k)
    }
  }

  /** sweep 후에도 상한을 넘으면 가장 먼저 만료될 키부터 버린다. */
  function evictOldest(): void {
    let oldestKey: string | null = null
    let oldestResetAt = Infinity
    for (const [k, b] of buckets) {
      if (b.resetAt < oldestResetAt) {
        oldestResetAt = b.resetAt
        oldestKey = k
      }
    }
    if (oldestKey !== null) buckets.delete(oldestKey)
  }

  return {
    check(key: string): boolean {
      const now = Date.now()
      const bucket = buckets.get(key)

      if (bucket && bucket.resetAt > now) {
        if (bucket.count >= max) return false
        bucket.count++
        return true
      }

      // 신규 키이거나 창이 지난 키. 넣기 전에 용량을 확보한다.
      if (!bucket && buckets.size >= maxKeys) {
        sweep(now)
        while (buckets.size >= maxKeys) evictOldest()
      }

      buckets.set(key, { count: 1, resetAt: now + windowMs })
      return true
    },

    size(): number {
      return buckets.size
    },
  }
}

/**
 * 프록시 헤더에서 클라이언트 식별자를 뽑는다.
 *
 * ⚠️ `x-forwarded-for` 는 클라이언트가 위조할 수 있다. Vercel 은 엣지에서 이 헤더를
 * 덮어쓰므로 프로덕션에서는 신뢰 가능하지만, 다른 곳에 배포하면 앞단 프록시가 같은 보장을
 * 하는지 확인해야 한다.
 */
export function getClientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const raw = forwarded?.split(',')[0]?.trim() || realIp || 'anonymous'
  return raw.slice(0, 128)
}
