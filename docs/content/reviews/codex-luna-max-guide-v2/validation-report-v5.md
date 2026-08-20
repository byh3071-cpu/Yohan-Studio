# Luna MAX 카드뉴스 v5 검증 보고

판정: 작업본 PASS / 실플랫폼 확인 필요

## 자동 검사

- 8장, 순차 파일명 중복 없음
- 모든 카드 1080×1350, RGB PNG
- 원본과 50% 인스타 축소 검토본 생성
- 전역 스킬 경로에서 검사 실행 PASS

## 내용 검사

- Luna는 모델, Max는 추론 강도로 구분
- Luna 작업은 Native V2가 아닌 사용자에게 보이는 별도 Codex 앱 작업으로 설명
- `Use the Luna task lane for this feature.`를 현재 요청의 명시적 승인 문장으로 표시
- `gpt-5.6-luna`와 `max`를 작업 생성 시 함께 지정
- `codex -e max` 제거: 현재 CLI에서 `-e`는 `exec`의 별칭
- Luna 전용 사용자는 `install-agents.sh`가 불필요하다는 현재 원문 계약 반영
- Bun·앱 작업 도구·Luna·Max 가용성 요구와 무대체 중단 반영
- 설치 명령 두 줄은 로컬 Codex CLI 도움말의 실제 명령 표면과 대조
- Windows용 Bun 설치 명령과 설치 후 확인 절차는 Bun 공식 설치 문서와 대조

## 시각 검사

- 표지에서 Luna를 Native 작업 에이전트로 오해할 표현 제거
- 카드 4 제목을 `플러그인 등록은 두 줄`로 좁혀 Bun 선행조건과 충돌하지 않게 수정
- 6번 카드 이미지와 텍스트 비겹침
- 7번 카드 번호 원과 텍스트 블록의 수직 중심 일치
- 50% 축소본에서 제목·명령어·핵심 보조문구 판독 가능
- 모든 카드 하단 계정명과 페이지 번호 기준선 일치

## 아직 남은 실플랫폼 검사

- Instagram 업로드 편집 화면에서 압축 뒤 흐림·잘림·UI 가림 확인
- 게시 후 ManyChat의 특정 게시물 선택기에 노출되는지 확인
- 테스트 계정 첫 댓글에서 공개 답글과 private reply 확인
- `가이드 받기` 버튼 이후 24시간 창과 후속 DM 확인

## 승인 상태

- 현재 V5는 게시 가능한 형식의 교정 작업본입니다.
- 사용자의 실제 Instagram 화면 확인과 최종 승인 전에는 Yohan Studio `approved/final`로 보관하지 않습니다.
- 내용 오류가 발견된 V1은 `superseded`, `golden_candidate: false`로 강등했습니다.
