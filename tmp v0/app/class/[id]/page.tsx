import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { ClassDetailContent } from "@/components/class-detail-content";
import { mockClasses } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params;
  const hobbyClass = mockClasses.find((c) => c.id === id);

  if (!hobbyClass) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
        </Link>
        <ClassDetailContent hobbyClass={hobbyClass} />
      </main>
    </div>
  );
}
