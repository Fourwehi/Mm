"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PostFormState = {
  title: string;
  category: string;
  content: string;
};

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<PostFormState>({
    title: "",
    category: "모집",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canSubmit = useMemo(() => {
    return (
      form.title.trim().length >= 2 &&
      form.category.trim().length > 0 &&
      form.content.trim().length >= 10
    );
  }, [form]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      // Phase 1: Mock 저장. (추후 /api/posts 또는 DB 연동)
      await new Promise((r) => setTimeout(r, 350));
      router.push("/posts");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            모집글 작성
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            간단한 정보를 입력해 글을 작성해보세요.
          </p>
        </div>
        <Link href="/posts" className="shrink-0">
          <Button variant="ghost" size="sm" className="h-9 px-3 text-xs">
            목록으로
          </Button>
        </Link>
      </div>

      <Card className="border-0 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs">
                제목
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="예: 함께 도자기 클래스 들으실 분 구해요"
              />
              <p className="text-[11px] text-muted-foreground">
                2자 이상 입력해주세요.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs">
                분류
              </Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="예: 모집 / 공지 / 질문"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs">
                내용
              </Label>
              <textarea
                id="content"
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="모집 내용, 일정, 연락 방법 등을 입력해주세요."
                rows={8}
                className={cn(
                  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              />
              <p className="text-[11px] text-muted-foreground">
                10자 이상 입력해주세요.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="h-9 px-4 text-xs font-medium"
              >
                {isSubmitting ? "저장 중..." : "작성 완료"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

