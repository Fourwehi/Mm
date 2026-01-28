"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { mockReservations } from "@/lib/mock-data";
import type { Reservation, ReservationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ReservationStatus,
  { label: string; className: string }
> = {
  CONFIRMED: {
    label: "확정",
    className: "bg-success text-success-foreground",
  },
  PENDING: {
    label: "대기중",
    className: "bg-warning text-warning-foreground",
  },
  CANCELLED: {
    label: "취소됨",
    className: "bg-muted text-muted-foreground",
  },
};

export function ReservationList() {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
  };

  if (mockReservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium text-foreground">
          예약 내역이 없습니다
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          클래스를 탐색하고 예약해보세요
        </p>
        <Button className="mt-6" asChild>
          <a href="/">클래스 탐색하기</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {mockReservations.map((reservation) => {
          const status = statusConfig[reservation.status];
          return (
            <Card
              key={reservation.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
              onClick={() => setSelectedReservation(reservation)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {reservation.className}
                      </h3>
                      <Badge className={cn(status.className)}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(reservation.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {reservation.startTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {reservation.guests}명
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {reservation.studioName}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reservation Detail Dialog */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={(open) => !open && setSelectedReservation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 상세 정보</DialogTitle>
            <DialogDescription>예약 내역을 확인하세요</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">클래스</span>
                  <span className="font-medium text-foreground">
                    {selectedReservation.className}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">스튜디오</span>
                  <span className="text-foreground">
                    {selectedReservation.studioName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">날짜</span>
                  <span className="text-foreground">
                    {formatDate(selectedReservation.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">시간</span>
                  <span className="text-foreground">
                    {selectedReservation.startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">인원</span>
                  <span className="text-foreground">
                    {selectedReservation.guests}명
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">상태</span>
                  <Badge
                    className={cn(
                      statusConfig[selectedReservation.status].className
                    )}
                  >
                    {statusConfig[selectedReservation.status].label}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {selectedReservation.status !== "CANCELLED" && (
                  <Button variant="outline" className="text-destructive bg-transparent">
                    예약 취소
                  </Button>
                )}
                <Button onClick={() => setSelectedReservation(null)}>
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
