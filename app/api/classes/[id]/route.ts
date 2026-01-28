import { NextResponse } from "next/server";
import { mockClasses } from "@/lib/mock-data";

// Phase 1: 클래스 상세 정보 조회 API
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 최신 버전에서는 params가 Promise입니다.
    const { id } = await params;
    
    const hobbyClass = mockClasses.find((c) => c.id === id);

    if (!hobbyClass) {
      return NextResponse.json(
        { error: "존재하지 않는 클래스입니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(hobbyClass);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}