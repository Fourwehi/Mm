# 005 Fix Next.js “async params/searchParams” & Forms

## 배경

- 일부 페이지가 비어있거나(placeholder), 링크는 연결되어 있으나 실제 입력 가능한 폼 UI가 없어 사용 흐름(글 작성/로그인)이 끊겼습니다.
- Next.js 최신 App Router 가이드에서 `params`/`searchParams`가 비동기(Promise)로 다뤄질 수 있으므로, 해당 패턴을 따르는 신규 페이지를 추가했습니다(요청사항).

## 변경 사항

### 1) `/posts` 목록 페이지 추가

- 파일: `app/posts/page.tsx`
- 내용:
  - `searchParams?: Promise<Record<string, string | string[] | undefined>>` 형태로 받고 **`await` 처리**
  - `q` 검색어를 받아서 Mock 목록을 필터링
  - `/posts/new`로 이동하는 “글 작성” CTA 제공

### 2) `/posts/new` 모집글 작성 폼 추가

- 파일: `app/posts/new/page.tsx`
- 내용:
  - 실제 입력 가능한 Form(UI) 구현(제목/분류/내용)
  - 최소 검증(제목 2자+, 내용 10자+)
  - Phase 1에서는 Mock 저장 후 `/posts`로 이동

### 3) `/login` 로그인 폼 구현

- 파일: `app/(auth)/login/page.tsx`
- 내용:
  - 실제 입력 가능한 로그인 Form(UI) 구현(이메일/비밀번호)
  - Phase 1에서는 Mock 로그인 후 `/`로 이동
  - “Google로 계속하기(Mock)” 버튼은 `/api/auth/callback`로 연결

### 4) 빌드 오류 수정 (CSS import)

- 문제: `app/globals.css`에서 `@import "tw-animate-css";`를 추가했지만 의존성이 없어 빌드 실패
- 조치: `tw-animate-css`를 devDependency로 설치하여 해결

## 자가 검증 결과

- `pnpm build` 성공 확인 (Next.js 16.1.6 / Turbopack)
- 생성/추가 라우트:
  - `/posts` (동적)
  - `/posts/new` (정적)
  - `/login` (정적)

