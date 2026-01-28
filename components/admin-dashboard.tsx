"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockClasses, mockReservations, mockTimeSlots } from "@/lib/mock-data";
import type { ReservationStatus } from "@/types/domain.types";

const statusLabel: Record<ReservationStatus, string> = {
  PENDING: "대기",
  CONFIRMED: "확정",
  CANCELLED: "취소",
};

export function AdminDashboard() {
  return (
    <Tabs defaultValue="classes" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
        <TabsTrigger value="classes">클래스 관리</TabsTrigger>
        <TabsTrigger value="sessions">회차 관리</TabsTrigger>
        <TabsTrigger value="reservations">예약 관리</TabsTrigger>
      </TabsList>

      <TabsContent value="classes" className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>클래스</CardTitle>
            <CardDescription>
              총 {mockClasses.length}개 (Mock)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockClasses.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">
                      {c.name}
                    </p>
                    <Badge variant="outline">{c.category}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.studio.name} · {c.studio.location} · {c.duration}분 ·{" "}
                    {c.price.toLocaleString()}원
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    수정
                  </Button>
                  <Button variant="destructive" size="sm">
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sessions" className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>회차</CardTitle>
            <CardDescription>
              총 {mockTimeSlots.length}개 (Mock)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockTimeSlots.map((s) => {
              const cls = mockClasses.find((c) => c.id === s.classId);
              const remaining = s.maxCapacity - s.currentBookings;
              return (
                <div
                  key={s.id}
                  className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {cls?.name ?? "알 수 없는 클래스"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.date} · {s.startTime} · {s.currentBookings}/
                      {s.maxCapacity}명
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={remaining <= 0 ? "secondary" : "outline"}>
                      {remaining <= 0 ? "마감" : `잔여 ${remaining}석`}
                    </Badge>
                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reservations" className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>예약</CardTitle>
            <CardDescription>
              총 {mockReservations.length}개 (Mock)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockReservations.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">
                      {r.className}
                    </p>
                    <Badge variant="outline">{statusLabel[r.status]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.date} {r.startTime} · {r.guests}명 · {r.studioName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    승인
                  </Button>
                  <Button variant="outline" size="sm">
                    거절
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

