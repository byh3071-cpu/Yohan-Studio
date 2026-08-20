---
id: PAT-008
패턴명: Windows 작업트리의 외부 node_modules junction을 Turbopack이 거부
카테고리: build
증상: Next.js 16 Turbopack 빌드에서 "Symlink [project]/node_modules is invalid, it points out of the filesystem root" 오류로 중단.
원인: 의존성을 다시 설치하지 않기 위해 작업트리의 node_modules를 다른 체크아웃으로 junction 연결했지만, Turbopack이 프로젝트 파일시스템 루트 밖의 심볼릭 링크 대상을 허용하지 않음.
해결: lint·typecheck에는 junction을 사용할 수 있으나, 빌드는 `next build --webpack`으로 검증하거나 작업트리 안에 독립적인 node_modules를 설치. 검증 뒤 junction은 정확한 대상 확인 후 제거.
적용조건: Windows Git worktree에서 다른 체크아웃의 node_modules를 junction으로 재사용하며 Next.js 16 빌드를 검증할 때.
출처프로젝트: yohan-studio
태그: [nextjs, turbopack, worktree, junction, windows]
발견일: 2026-08-12
출처DevLog: docs/devlog/2026-08-12-instagram-design-archive.md
---

# PAT-007 — 작업트리 외부 의존성 연결과 Turbopack

## 판정

- 페이지 코드나 TypeScript 오류가 아니라 빌드 도구의 파일시스템 경계 검사입니다.
- `eslint`와 `tsc --noEmit`이 통과해도 Turbopack의 독립적인 경계 검사는 실패할 수 있습니다.

## 검증 순서

1. junction 대상이 승인된 주 체크아웃의 `node_modules`인지 확인합니다.
2. `npm run lint`와 `npm run typecheck`를 실행합니다.
3. `next build --webpack`으로 동일 소스의 프로덕션 정적 생성까지 확인합니다.
4. 빌드 뒤 작업트리 내부 junction만 제거합니다.

## 주의

Webpack 통과를 Turbopack 통과로 표현하면 안 됩니다. Turbopack 자체를 배포 게이트로 요구하는 프로젝트라면 작업트리 내부에 의존성을 별도로 설치해 다시 검증해야 합니다.
