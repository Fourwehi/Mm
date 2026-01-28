# 데이터베이스 설계 가이드 (Database Schema)

## 개요

WITH 프로젝트의 PostgreSQL 데이터베이스 스키마 설계 문서입니다. Supabase를 사용하며, Row Level Security (RLS) 정책을 통해 데이터 보안을 보장합니다.

---

## 테이블 구조

### 1. Users (사용자)

Supabase Auth의 `auth.users` 테이블을 확장하는 프로필 테이블입니다.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 조회/수정 가능
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

**설명**:
- `auth.users`와 1:1 관계
- 모든 사용자 활동의 기준 엔티티
- 예약, 후기, 찜 등에서 참조

---

### 2. Studios (스튜디오)

클래스를 운영하는 가게(스튜디오) 정보를 저장합니다.

```sql
CREATE TABLE public.studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  region TEXT NOT NULL, -- 지역 필터링용 (예: "강남구", "서초구")
  phone TEXT,
  email TEXT,
  approval_method TEXT NOT NULL DEFAULT 'INSTANT', -- 'INSTANT' | 'APPROVAL' (Phase 2)
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Phase 2: 관리자
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_studios_region ON public.studios(region);

-- RLS 정책
ALTER TABLE public.studios ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 스튜디오 조회 가능 (비로그인 포함)
CREATE POLICY "Anyone can view studios"
  ON public.studios FOR SELECT
  USING (true);

-- Phase 2: 소유자만 수정 가능
CREATE POLICY "Owners can update studios"
  ON public.studios FOR UPDATE
  USING (auth.uid() = owner_id);
```

**설명**:
- 지역 필터링을 위한 `region` 필드
- Phase 2에서 `approval_method`로 예약 승인 방식 제어
- `owner_id`로 관리자 기능 구현 (Phase 2)

---

### 3. Classes (클래스)

스튜디오에서 제공하는 취미 클래스 정보입니다.

```sql
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 카테고리 필터링용 (예: "요리", "댄스", "미술")
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- 가격 (원 단위)
  duration_minutes INTEGER NOT NULL, -- 소요 시간 (분)
  ai_summary TEXT, -- Phase 1: AI 요약 결과 저장
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_classes_studio_id ON public.classes(studio_id);
CREATE INDEX idx_classes_category ON public.classes(category);
CREATE INDEX idx_classes_created_at ON public.classes(created_at DESC); -- 최신순 정렬

-- RLS 정책
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 클래스 조회 가능
CREATE POLICY "Anyone can view classes"
  ON public.classes FOR SELECT
  USING (true);

-- Phase 2: 스튜디오 소유자만 생성/수정 가능
CREATE POLICY "Studio owners can manage classes"
  ON public.classes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.studios
      WHERE studios.id = classes.studio_id
      AND studios.owner_id = auth.uid()
    )
  );
```

**설명**:
- `category`로 카테고리 필터링
- `created_at` 인덱스로 최신순 정렬 최적화
- `ai_summary`는 Phase 1에서 AI 요약 결과 저장용

---

### 4. Sessions (회차)

클래스가 열리는 특정 날짜/시간의 회차 정보입니다. **예약은 클래스가 아닌 회차에 대해 발생**합니다.

```sql
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL, -- 시작 시간
  capacity INTEGER NOT NULL DEFAULT 10, -- 정원
  booked_count INTEGER NOT NULL DEFAULT 0, -- 예약 인원 (계산 필드)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_capacity CHECK (capacity > 0),
  CONSTRAINT valid_booked_count CHECK (booked_count >= 0 AND booked_count <= capacity)
);

-- 인덱스
CREATE INDEX idx_sessions_class_id ON public.sessions(class_id);
CREATE INDEX idx_sessions_start_time ON public.sessions(start_time);

-- RLS 정책
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 회차 조회 가능
CREATE POLICY "Anyone can view sessions"
  ON public.sessions FOR SELECT
  USING (true);

-- Phase 2: 스튜디오 소유자만 생성/수정 가능
CREATE POLICY "Studio owners can manage sessions"
  ON public.sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      JOIN public.studios ON studios.id = classes.studio_id
      WHERE classes.id = sessions.class_id
      AND studios.owner_id = auth.uid()
    )
  );
```

**설명**:
- `booked_count`는 예약 생성/취소 시 트리거로 자동 업데이트 (또는 애플리케이션 레벨에서 관리)
- `capacity` 제약조건으로 정원 초과 예약 방지
- `start_time` 인덱스로 날짜별 조회 최적화

---

### 5. Reservations (예약)

사용자와 회차를 연결하는 예약 기록입니다.

```sql
CREATE TYPE reservation_status AS ENUM (
  'CONFIRMED',  -- Phase 1: 즉시 확정
  'PENDING',    -- Phase 2: 승인 대기
  'APPROVED',   -- Phase 2: 승인 완료
  'CANCELLED'   -- Phase 2: 취소됨
);

CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  guest_count INTEGER NOT NULL DEFAULT 1, -- 예약 인원
  status reservation_status NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_guest_count CHECK (guest_count > 0),
  CONSTRAINT unique_user_session UNIQUE (user_id, session_id) -- 사용자는 같은 회차에 중복 예약 불가
);

-- 인덱스
CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX idx_reservations_session_id ON public.reservations(session_id);
CREATE INDEX idx_reservations_status ON public.reservations(status);

-- RLS 정책
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 예약만 조회 가능
CREATE POLICY "Users can view own reservations"
  ON public.reservations FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 예약만 생성 가능
CREATE POLICY "Users can create own reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Phase 2: 사용자는 자신의 예약 취소 가능
CREATE POLICY "Users can cancel own reservations"
  ON public.reservations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Phase 2: 스튜디오 소유자는 자신의 스튜디오 예약 조회/승인 가능
CREATE POLICY "Studio owners can manage reservations"
  ON public.reservations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      JOIN public.classes ON classes.id = sessions.class_id
      JOIN public.studios ON studios.id = classes.studio_id
      WHERE sessions.id = reservations.session_id
      AND studios.owner_id = auth.uid()
    )
  );
```

**설명**:
- `status`는 ENUM 타입으로 Phase별 확장 가능
- `unique_user_session` 제약조건으로 중복 예약 방지
- 예약 생성 시 트랜잭션으로 `sessions.booked_count` 업데이트 필요

---

### 6. Reviews (후기) - Phase 2

클래스에 대한 사용자 후기입니다.

```sql
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL, -- 예약 완료 확인용
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- 평점 (1-5)
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_class_review UNIQUE (user_id, class_id) -- 사용자는 클래스당 1개 후기만 작성
);

-- 인덱스
CREATE INDEX idx_reviews_class_id ON public.reviews(class_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- RLS 정책
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 후기 조회 가능
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- 예약 완료 사용자만 후기 작성 가능
CREATE POLICY "Users with completed reservations can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.reservations
      WHERE reservations.id = reviews.reservation_id
      AND reservations.user_id = auth.uid()
      AND reservations.status IN ('CONFIRMED', 'APPROVED')
    )
  );

-- 작성자만 수정/삭제 가능
CREATE POLICY "Users can manage own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);
```

**설명**:
- `reservation_id`로 예약 완료 사용자만 후기 작성 가능하도록 제한
- `unique_user_class_review`로 중복 후기 방지

---

### 7. Payments (결제) - Phase 2

예약과 연결된 결제 정보입니다.

```sql
CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'SUCCESS',
  'FAILED',
  'REFUNDED'
);

CREATE TYPE payment_type AS ENUM (
  'FULL',      -- 전액 결제
  'DEPOSIT'    -- 예약금 결제
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- 결제 금액 (원 단위)
  payment_type payment_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'PENDING',
  payment_method TEXT, -- 결제 수단 (예: "카드", "계좌이체")
  transaction_id TEXT, -- 외부 결제 시스템 트랜잭션 ID
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_payments_reservation_id ON public.payments(reservation_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- RLS 정책
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 예약 결제만 조회 가능
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reservations
      WHERE reservations.id = payments.reservation_id
      AND reservations.user_id = auth.uid()
    )
  );
```

**설명**:
- 결제 상태와 예약 상태는 분리 관리
- 결제 실패 시 예약 만료 처리 및 좌석 복구 로직 필요

---

## 데이터 정합성 원칙

### 1. 예약 생성 시 트랜잭션

```sql
BEGIN;

-- 1. 잔여석 확인
SELECT (capacity - booked_count) as available
FROM public.sessions
WHERE id = :session_id
FOR UPDATE; -- 락 획득

-- 2. 예약 생성
INSERT INTO public.reservations (user_id, session_id, guest_count)
VALUES (:user_id, :session_id, :guest_count);

-- 3. 예약 인원 업데이트
UPDATE public.sessions
SET booked_count = booked_count + :guest_count
WHERE id = :session_id;

COMMIT;
```

### 2. 정원 초과 방지

- 애플리케이션 레벨: 예약 전 잔여석 확인
- 데이터베이스 레벨: `sessions.booked_count <= capacity` 제약조건
- 트랜잭션 + FOR UPDATE로 동시성 제어

---

## 인덱스 전략

### 조회 최적화를 위한 인덱스

1. **필터링**: `studios.region`, `classes.category`
2. **정렬**: `classes.created_at` (최신순)
3. **조인**: `classes.studio_id`, `sessions.class_id`, `reservations.user_id`
4. **상태 조회**: `reservations.status`, `payments.status`

---

## 마이그레이션 전략

### Phase 1 → Phase 2

1. `reservation_status` ENUM에 `PENDING`, `APPROVED`, `CANCELLED` 추가
2. `studios.approval_method` 컬럼 추가
3. `reviews` 테이블 생성
4. `payments` 테이블 생성
5. RLS 정책 확장

---

## 보안 고려사항

1. **RLS 활성화**: 모든 테이블에 RLS 정책 적용
2. **서비스 롤 키 보호**: 서버 사이드에서만 사용
3. **익명 키**: 클라이언트에서 공개 사용 가능 (RLS로 보호)
4. **인증 필수 작업**: 예약 생성 등은 인증된 사용자만 가능

---

## 참고 자료

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Database Best Practices](https://supabase.com/docs/guides/database)
