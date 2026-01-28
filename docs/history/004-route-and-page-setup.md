# 004 Route and Page Setup

## 변경 요약

- 메인 페이지에서 접근 가능한 링크/버튼들의 경로를 `docs/FLOW.md`, `docs/PRD.md`에 정의된 페이지 구조와 비교하여 점검했습니다.
- 헤더의 "로그인" 버튼이 실제로 네비게이션을 하지 않고 있었던 문제를 수정했습니다.

## 상세 변경 내역

### 1) 헤더 로그인 버튼 링크 연결

- 파일: `components/common/Header.tsx`
- 변경: 데스크탑 헤더의 "로그인" 버튼을 `/login`으로 이동하도록 `Link`로 감쌌습니다.
- 근거:
  - `docs/PRD.md`의 Phase 1 인증 흐름(로그인 필요 시 로그인 유도)
  - `docs/FLOW.md`에서 예약/내 예약 플로우에 로그인 유도가 존재

## 현재 주요 라우트 상태(Phase 1)

- `/`: 메인(클래스 탐색) ✅
- `/classes/[id]`: 클래스 상세 ✅
- `/classes/[id]/book`: 예약 페이지 ✅
- `/reservations`: 내 예약 ✅
- `/login`: 로그인 ✅ (최소 UI)
- `/admin`: 관리자 ✅ (문서 상 흐름에 존재, Phase 1 범위 외이지만 페이지는 존재)

