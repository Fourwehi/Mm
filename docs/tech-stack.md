# 기술 명세서 (Tech Stack)

## 개요

WITH 프로젝트는 Next.js 15 App Router와 Supabase를 기반으로 한 취미 클래스 예약 서비스입니다. 유지보수성과 확장성을 최우선으로 고려한 기술 스택을 채택했습니다.

---

## 핵심 기술 스택

### 프론트엔드 프레임워크

- **Next.js 15** (App Router)
  - 서버 컴포넌트 우선 아키텍처
  - Route Groups를 활용한 레이아웃 분리
  - Server Actions 및 API Routes
  - 자동 코드 스플리팅 및 최적화

- **React 19**
  - 최신 React 기능 활용
  - 서버 컴포넌트 지원

- **TypeScript 5**
  - 엄격한 타입 체크
  - Supabase 자동 생성 타입 활용
  - 도메인 타입 정의로 타입 안정성 확보

### 스타일링

- **Tailwind CSS 4**
  - 유틸리티 퍼스트 CSS 프레임워크
  - 반응형 디자인 지원
  - 커스텀 디자인 시스템 구축

- **shadcn/ui**
  - 접근성과 커스터마이징이 용이한 컴포넌트 라이브러리
  - Radix UI 기반
  - 컴포넌트를 프로젝트에 직접 복사하여 관리

- **Lucide React**
  - 아이콘 라이브러리
  - 트리 쉐이킹 지원
  - 일관된 아이콘 스타일

### 백엔드 & 데이터베이스

- **Supabase**
  - PostgreSQL 데이터베이스
  - Row Level Security (RLS) 정책
  - 실시간 구독 (Phase 2 활용 가능)
  - 인증 시스템 (Google OAuth)
  - 자동 API 생성

### 인증

- **Supabase Auth**
  - Google OAuth 2.0
  - 세션 관리
  - 서버/클라이언트 인증 분리

### 유틸리티 라이브러리

- **Zod**
  - 런타임 타입 검증
  - API 요청/응답 스키마 검증
  - 폼 유효성 검사

- **clsx** / **tailwind-merge**
  - className 병합 유틸리티
  - 조건부 스타일링

- **date-fns** (예정)
  - 날짜 포맷팅 및 계산
  - 타임테이블 날짜 처리

---

## 컴포넌트 설계 원칙

### 1. 계층 구조

```
components/
├── ui/          # 순수 UI 컴포넌트 (비즈니스 로직 없음)
├── domain/      # 도메인별 비즈니스 컴포넌트
├── layout/      # 레이아웃 컴포넌트
└── providers/   # Context Providers
```

### 2. UI 컴포넌트 (`components/ui/`)

- **원칙**: 재사용 가능한 순수 UI 컴포넌트
- **특징**:
  - shadcn/ui 기반
  - Props로 제어되는 범용 컴포넌트
  - 비즈니스 로직 포함 금지
  - 스타일링은 Tailwind로 통일

**예시 컴포넌트**:
- `Button`, `Card`, `Input`, `Select`, `Dialog`, `Badge`, `Skeleton`

### 3. 도메인 컴포넌트 (`components/domain/`)

- **원칙**: 도메인별 비즈니스 로직이 포함된 컴포넌트
- **특징**:
  - 도메인별 폴더로 분리 (`class/`, `reservation/`, `studio/`)
  - API 호출 및 상태 관리 포함
  - UI 컴포넌트를 조합하여 구성
  - 재사용 가능하지만 특정 도메인에 특화

**예시 컴포넌트**:
- `ClassCard`: 클래스 정보 표시 + 클릭 이벤트
- `ClassFilter`: 필터 로직 + UI
- `SessionSelector`: 회차 선택 로직 + UI

### 4. 컴포넌트 조합 패턴

```tsx
// 도메인 컴포넌트는 UI 컴포넌트를 조합
import { Card, Button } from '@/components/ui'
import { useClasses } from '@/hooks/useClasses'

export function ClassCard({ classId }: Props) {
  const { data } = useClasses(classId)
  return (
    <Card>
      <Button onClick={handleClick}>예약하기</Button>
    </Card>
  )
}
```

---

## 폴더 구조 원칙

### 1. Route Groups 활용

- `(auth)`: 인증 관련 페이지 (공통 레이아웃 없음)
- `(main)`: 메인 사용자 페이지 (헤더/네비게이션 포함)
- `(admin)`: 관리자 페이지 (관리자 전용 레이아웃)

### 2. 관심사 분리

- **`lib/api/`**: API 호출 함수만 (비즈니스 로직 없음)
- **`hooks/`**: 상태 관리 및 사이드 이펙트
- **`components/domain/`**: UI + 비즈니스 로직 조합
- **`types/`**: 타입 정의만

### 3. 코드 중복 최소화 전략

1. **커스텀 훅 활용**
   ```tsx
   // hooks/useClasses.ts
   export function useClasses(filters) {
     // 공통 로직: 데이터 fetching, 필터링, 캐싱
   }
   ```

2. **API 레이어 분리**
   ```tsx
   // lib/api/classes.ts
   export async function getClasses(filters) {
     // Supabase 쿼리 로직
   }
   ```

3. **타입 재사용**
   ```tsx
   // types/domain.types.ts
   export type Class = Database['public']['tables']['classes']['Row']
   ```

---

## 데이터 흐름

### 1. 서버 컴포넌트 우선

```tsx
// app/classes/[id]/page.tsx (Server Component)
import { getClass } from '@/lib/api/classes'

export default async function ClassDetailPage({ params }) {
  const classData = await getClass(params.id) // 서버에서 직접 데이터 fetching
  return <ClassDetail data={classData} />
}
```

### 2. 클라이언트 상호작용

```tsx
// components/domain/class/ClassFilter.tsx (Client Component)
'use client'
import { useClasses } from '@/hooks/useClasses'

export function ClassFilter() {
  const { filters, setFilters } = useClasses()
  // 클라이언트 상태 관리
}
```

### 3. API Routes (필요 시)

```tsx
// app/api/classes/route.ts
// 외부 API 연동, 복잡한 서버 로직 처리
```

---

## 상태 관리 전략

### Phase 1: React 기본 기능

- **서버 상태**: React Server Components + 직접 데이터 fetching
- **클라이언트 상태**: `useState`, `useReducer`
- **전역 상태**: Context API (인증 상태 등)

### Phase 2 확장 가능성

- **TanStack Query (React Query)**: 서버 상태 캐싱 및 동기화
- **Zustand**: 클라이언트 전역 상태 (필요 시)

---

## 성능 최적화

1. **코드 스플리팅**: Next.js 자동 처리
2. **이미지 최적화**: `next/image` 사용
3. **폰트 최적화**: `next/font` 사용
4. **서버 컴포넌트**: 불필요한 JavaScript 번들 감소

---

## 개발 도구

- **ESLint**: 코드 품질 검사
- **TypeScript**: 타입 체크
- **Prettier** (권장): 코드 포맷팅

---

## 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI Service (Phase 1)
AI_API_KEY=
```

---

## 참고 자료

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
