import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <span className="text-xs font-semibold text-primary-foreground">W</span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">WITH</span>
            </div>
            <p className="text-xs text-muted-foreground">
              취미 클래스를 탐색하고 예약하세요
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              클래스 탐색
            </Link>
            <Link href="/reservations" className="hover:text-foreground transition-colors">
              내 예약
            </Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">
              관리자
            </Link>
          </nav>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} WITH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
