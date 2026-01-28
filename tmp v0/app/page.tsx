import { Header } from "@/components/header";
import { ClassList } from "@/components/class-list";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-5">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            클래스 탐색
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            다양한 취미 클래스를 탐색하고 예약해보세요
          </p>
        </div>
        <ClassList />
      </main>
    </div>
  );
}
