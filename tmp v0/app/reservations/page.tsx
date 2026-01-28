import { Header } from "@/components/header";
import { ReservationList } from "@/components/reservation-list";

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            내 예약
          </h1>
          <p className="mt-2 text-muted-foreground">
            예약한 클래스 목록을 확인하세요
          </p>
        </div>
        <ReservationList />
      </main>
    </div>
  );
}
