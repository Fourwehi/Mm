import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

/**
 * Next.js App Router (요청사항: params/searchParams는 Promise로 받고 await 처리)
 */
export default async function PostsPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  // Phase 1: Mock 데이터 (추후 DB 연동)
  const posts = [
    {
      id: "welcome",
      title: "첫 모집글(예시)",
      category: "모집",
      excerpt: "클래스 후기/모집글 기능은 Phase 2에서 확장 예정입니다.",
    },
  ].filter((p) => (q ? p.title.includes(q) || p.excerpt.includes(q) : true));

  return (
    <div className="container mx-auto px-4 py-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            모집글
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            클래스 관련 모집/공지 글을 확인하거나 작성할 수 있어요.
          </p>
        </div>

        <Link href="/posts/new">
          <Button size="sm" className="h-9 px-4 text-xs font-medium">
            글 작성
          </Button>
        </Link>
      </div>

      <form className="mb-4 flex gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="검색어를 입력하세요"
          className="h-9"
        />
        <Button type="submit" variant="secondary" className="h-9 px-4 text-xs">
          검색
        </Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="border-0 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {post.title}
                </CardTitle>
                <Badge className="bg-primary/10 text-primary text-[10px] font-medium">
                  {post.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

