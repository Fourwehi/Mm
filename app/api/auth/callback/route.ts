import { NextResponse } from "next/server";

// Phase 1: OAuth 콜백 Mock 처리
// 실제 Google 로그인 연동 전, 콜백 URL이 호출되면 메인으로 리다이렉트 처리하여 빌드 오류 방지
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  
  // 로그인 성공 후 메인으로 이동한다고 가정
  const redirectUrl = new URL("/", requestUrl.origin);
  
  // (선택 사항) 클라이언트에서 로그인 상태를 인식하도록 쿼리 파라미터 추가 가능
  // redirectUrl.searchParams.set("login", "success");

  return NextResponse.redirect(redirectUrl);
}