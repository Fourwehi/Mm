import { NextResponse } from "next/server";
import { mockReservations } from "@/lib/mock-data";

// Phase 1: 예약 상세 정보 조회 및 취소 API
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const reservation = mockReservations.find((r) => r.id === id);

    if (!reservation) {
      return NextResponse.json(
        { error: "존재하지 않는 예약입니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Phase 1: 실제 데이터 삭제 로직 대신 성공 응답만 반환 (Mocking)
    return NextResponse.json({ 
      message: "예약이 성공적으로 취소되었습니다.",
      id 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}