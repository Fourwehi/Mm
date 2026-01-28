# WITH 프로젝트 문서

## 개요

WITH는 취미 클래스 예약 서비스입니다. Next.js 15 App Router와 Supabase를 기반으로 구축되었습니다.

## 문서 목록

- [기술 명세서](./tech-stack.md) - 사용된 기술 스택 및 컴포넌트 설계 원칙
- [데이터베이스 설계 가이드](./db-schema.md) - PostgreSQL 테이블 구조 및 RLS 정책

## 프로젝트 구조

자세한 폴더 구조는 [기술 명세서](./tech-stack.md)를 참고하세요.

## 시작하기

1. 환경 변수 설정: `.env.local` 파일 생성 (`.env.example` 참고)
2. 의존성 설치: `pnpm install`
3. 개발 서버 실행: `pnpm dev`

## Phase별 구현 범위

### Phase 1 (MVP)
- 클래스 탐색 및 필터링
- 클래스 상세 조회
- 타임테이블 기반 예약
- 내 예약 조회
- AI 요약 기능

### Phase 2 (고도화)
- 예약 승인 프로세스
- 후기 시스템
- 관리자 기능
- 결제 시스템
