# Luna · Max 카드뉴스 게시 기록

상태: **게시 및 댓글 자동화 실전 검증 완료**

## 게시 결과

- 채널: Instagram `@yohanstudio_ai`
- 게시일: 2026-08-13
- 게시물: https://www.instagram.com/yohanstudio_ai/p/Db_mFmJkoW5/
- 게시 자산: `output/carousel-v6/01-cover.png`부터 `08-cta.png`까지 8장
- 캡션 CTA: 댓글에 `루나` 입력 시 DM으로 설치 가이드 안내

## ManyChat 실전 검증

- 자동화: `Auto-DM links from comments`
- 상태: `LIVE`
- 트리거: 특정 게시물의 `루나` 댓글
- 별도 테스트 계정 댓글 감지: PASS
- Yohan Studio 공개 자동 답글: PASS
- Opening DM 발송: PASS
- `가이드 받기` 선택 뒤 설치 가이드 안내: PASS
- 2026-08-14 확인 집계: Sends 1, Clicks 1, CTR 100%

개별 댓글 작성자나 DM 수신자의 식별정보는 보관하지 않고 집계 결과만 기록합니다.

## 상태 구분

이 기록은 **콘텐츠 게시와 ManyChat 운영 경로가 통과했다는 증거**입니다. Sol Advisor 자체의 Luna 작업 경로 E2E 통과를 뜻하지 않습니다. 검증 당시 현재 Codex 호스트에는 필수 앱 작업 도구 `wait_threads`가 없어 Luna 작업 경로는 fail-closed 상태였습니다.

따라서 다음 두 상태를 분리해 읽어야 합니다.

- Instagram 게시·댓글→DM→링크 클릭: 완료
- Sol Advisor Luna·Max 실제 task lane E2E: 미완료

