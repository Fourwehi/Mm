// Next.js middleware (auth / request hooks)
// NOTE: Next.js expects `middleware` (or default) function export here.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // TODO: wire up auth checks when ready (Supabase, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
