import { NextResponse } from "next/server";
import { mockReservations } from "@/lib/mock-data";

// Phase 1: 예약 목록 조회 API
export async function GET(request: Request) {
  try {
    // 실제 구현 시에는 세션에서 User ID를 가져와 필터링해야 합니다.
    // Phase 1에서는 모든 Mock 데이터를 반환합니다.
    return NextResponse.json(mockReservations);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// Phase 1: 예약 생성 API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, timeSlotId, guests } = body;

    if (!classId || !timeSlotId || !guests) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 새로운 예약 객체 생성 (Mock)
    const newReservation = {
      id: `r${Date.now()}`,
      classId,
      timeSlotId,
      guests,
      status: "CONFIRMED", // Phase 1: 즉시 확정
      userId: "user_1", // Mock User
      createdAt: new Date().toISOString(),
      // Mock 데이터 구조상 필요한 추가 정보들 (실제 DB에서는 조인으로 해결)
      className: "예약된 클래스", 
      studioName: "스튜디오",
      date: "2024-01-01",
      startTime: "10:00"
    };

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "예약 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}