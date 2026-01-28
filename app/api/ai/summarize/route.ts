import { NextResponse } from "next/server";

export type SummarizeRequestBody = {
  text: string;
};

export type SummarizeResponseBody = {
  summary: string;
  model: "mock";
};

export type ErrorResponseBody = {
  error: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Phase 1: 클래스 설명 요약(Mock)
 * - 실제 AI 연동 대신 입력 텍스트 기반 Mock 요약을 반환합니다.
 */
export async function POST(
  request: Request,
): Promise<ReturnType<typeof NextResponse.json<SummarizeResponseBody | ErrorResponseBody>>> {
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const text = (body as Partial<SummarizeRequestBody> | null | undefined)?.text;

  if (!isNonEmptyString(text)) {
    return NextResponse.json(
      { error: "`text` is required" },
      { status: 400 },
    );
  }

  const summary = `AI 요약: ${text.trim()}...`;

  return NextResponse.json({
    summary,
    model: "mock",
  });
}
