import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { BookingContent } from "@/components/booking-content";
import { mockClasses, mockTimeSlots } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const hobbyClass = mockClasses.find((c) => c.id === id);
  const timeSlots = mockTimeSlots.filter((ts) => ts.classId === id);

  if (!hobbyClass) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Link href={`/class/${id}`}>
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            클래스 정보로 돌아가기
          </Button>
        </Link>
        <BookingContent hobbyClass={hobbyClass} timeSlots={timeSlots} />
      </main>
    </div>
  );
}
