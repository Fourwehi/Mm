"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canSubmit =
    form.email.trim().length > 0 && form.password.trim().length >= 4;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      // Phase 1: Mock 로그인 (실제 인증 연동 전)
      await new Promise((r) => setTimeout(r, 350));
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            로그인
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            예약을 진행하려면 로그인이 필요해요.
          </p>
        </div>

        <Card className="border-0 bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              계정으로 로그인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="4자 이상"
                />
              </div>

              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="h-9 w-full text-xs font-medium"
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] text-muted-foreground">또는</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Link href="/api/auth/callback">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 w-full text-xs font-medium"
                >
                  Google로 계속하기 (Mock)
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
