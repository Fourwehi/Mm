import { NextResponse } from "next/server";
import { mockClasses } from "@/lib/mock-data";

// Phase 1: 클래스 목록 조회 및 필터링 API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const location = searchParams.get("location");

    let filteredClasses = mockClasses;

    // 카테고리 필터링
    if (category && category !== "전체") {
      filteredClasses = filteredClasses.filter((c) => c.category === category);
    }

    // 지역 필터링
    if (location && location !== "전체") {
      filteredClasses = filteredClasses.filter(
        (c) => c.studio.location === location
      );
    }

    return NextResponse.json(filteredClasses);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}