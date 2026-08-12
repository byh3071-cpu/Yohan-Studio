# 디자인 산출물 보관 계약

## 소유권

- 실제 PNG·영상·HTML·PPT·생성 원본과 게시 문구는 해당 콘텐츠를 발행하는 프로젝트 저장소가 소유합니다.
- `yohan-brain` 디자인 인텔리전스는 실제 바이너리를 복제하지 않고 `design-intelligence.yaml`의 상대경로·해시·승인 이유·계보를 색인합니다.
- Codex 임시 작업 폴더와 채팅 첨부 파일은 제작 공간일 뿐 장기 정본이 아닙니다.

## Yohan Studio 구조

```text
docs/content/exports/<slug>/
├─ instagram-cardnews.md
├─ design-philosophy.md
├─ design-generation-notes.md
├─ design-intelligence.yaml
└─ assets/
   ├─ final/    # 승인된 게시용 결과와, 결함 발견 시 superseded로 보존되는 이력
   └─ source/   # 재편집에 필요한 생성 원본
```

중간 시안과 실패본은 기본적으로 보관하지 않습니다. 비교 근거로 명시 승인된 경우에만 `assets/variants/`를 추가합니다.

## 보관 명령

제작 작업 폴더에 `design-archive.json`을 만든 뒤 Yohan Studio 저장소에서 실행합니다.

```powershell
npm run content:archive-design -- --source-root "C:\path\to\workspace" --manifest design-archive.json
```

카드뉴스의 기획·모바일 검수·댓글→DM 문구·승인 게이트는 `skills/yohan-instagram-cardnews/SKILL.md`를 따릅니다. 스킬은 작업본을 먼저 만들고, 이 보관 명령은 사용자가 승인한 최종본에만 실행합니다.

명령은 다음을 보장합니다.

- slug 경로 이탈 차단
- 기존 보관물 덮어쓰기 거부
- 최종본·생성 원본·문서 분리
- 모든 보관 파일의 SHA-256 기록
- PC 절대경로를 Git 추적 메타데이터에 기록하지 않음

## 승인과 디자인 인텔리전스

- `status: approved`는 해당 프로젝트 결과물로 승인됐다는 뜻입니다.
- 승인 뒤 사실·명령어 오류가 발견되면 기존 바이너리를 덮어쓰지 않고 `status: superseded`, `golden_candidate: false`로 강등합니다.
- 교정본은 작업공간에서 다시 검증하고, 사용자 승인 뒤 새 revision slug로 보관합니다.
- `golden_candidate: true`는 디자인 인텔리전스의 재사용 후보일 뿐 전역 취향 정본으로 자동 승격되지 않습니다.
- 전역 골든·안정 취향 승격은 관제탑 또는 Brain CLI에서 사람 승인을 거친 뒤 별도로 기록합니다.
