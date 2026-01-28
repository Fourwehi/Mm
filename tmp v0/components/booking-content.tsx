"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Minus, Plus, Users, CheckCircle2 } from "lucide-react";
import type { HobbyClass, TimeSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookingContentProps {
  hobbyClass: HobbyClass;
  timeSlots: TimeSlot[];
}

export function BookingContent({ hobbyClass, timeSlots }: BookingContentProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [guests, setGuests] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const availableSeats = selectedSlot
    ? selectedSlot.maxCapacity - selectedSlot.currentBookings
    : 0;

  const handleGuestChange = (delta: number) => {
    const newGuests = guests + delta;
    if (newGuests >= 1 && newGuests <= availableSeats) {
      setGuests(newGuests);
    }
  };

  const handleBook = () => {
    setShowConfirmDialog(false);
    setIsBooked(true);
  };

  const totalPrice = hobbyClass.price * guests;

  // Group time slots by date
  const slotsByDate = timeSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    },
    {} as Record<string, TimeSlot[]>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
  };

  if (isBooked) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            예약이 완료되었습니다
          </h2>
          <p className="mt-2 text-muted-foreground">
            예약 내역은 내 예약 페이지에서 확인하실 수 있습니다.
          </p>
          <div className="mt-6 w-full space-y-2 rounded-lg bg-muted p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">클래스</span>
              <span className="font-medium text-foreground">
                {hobbyClass.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">상태</span>
              <Badge className="bg-success text-success-foreground">
                CONFIRMED
              </Badge>
            </div>
          </div>
          <Button className="mt-6 w-full" asChild>
            <a href="/reservations">내 예약 확인하기</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Class Summary */}
      <Card>
        <CardContent className="p-4">
          <h1 className="text-lg font-bold text-foreground">
            {hobbyClass.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hobbyClass.studio.name} · {hobbyClass.studio.location}
          </p>
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            회차 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(slotsByDate).map(([date, slots]) => (
            <div key={date}>
              <h3 className="mb-3 font-medium text-foreground">
                {formatDate(date)}
              </h3>
              <div className="space-y-2">
                {slots.map((slot) => {
                  const remaining = slot.maxCapacity - slot.currentBookings;
                  const isSoldOut = remaining === 0;
                  const isSelected = selectedSlot?.id === slot.id;

                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => {
                        if (!isSoldOut) {
                          setSelectedSlot(slot);
                          setGuests(1);
                        }
                      }}
                      disabled={isSoldOut}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border p-4 transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50",
                        isSoldOut && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {slot.startTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {isSoldOut ? (
                          <Badge variant="secondary">마감</Badge>
                        ) : (
                          <span
                            className={cn(
                              "text-sm",
                              remaining <= 2
                                ? "font-medium text-destructive"
                                : "text-muted-foreground"
                            )}
                          >
                            잔여 {remaining}석
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {timeSlots.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                현재 예약 가능한 회차가 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Selection */}
      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              인원 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">예약 인원</p>
                <p className="text-sm text-muted-foreground">
                  최대 {availableSeats}명까지 예약 가능
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGuestChange(-1)}
                  disabled={guests <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-lg font-bold text-foreground">
                  {guests}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGuestChange(1)}
                  disabled={guests >= availableSeats}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Summary & Book Button */}
      {selectedSlot && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {hobbyClass.price.toLocaleString()}원 x {guests}명
                </p>
                <p className="text-xl font-bold text-foreground">
                  총 {totalPrice.toLocaleString()}원
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setShowConfirmDialog(true)}
                className="px-8"
              >
                예약하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약을 확정하시겠습니까?</DialogTitle>
            <DialogDescription>
              아래 내용으로 예약이 진행됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">클래스</span>
              <span className="font-medium text-foreground">
                {hobbyClass.name}
              </span>
            </div>
            {selectedSlot && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">일시</span>
                  <span className="text-foreground">
                    {formatDate(selectedSlot.date)} {selectedSlot.startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">인원</span>
                  <span className="text-foreground">{guests}명</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-medium text-foreground">총 금액</span>
                  <span className="font-bold text-foreground">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              취소
            </Button>
            <Button onClick={handleBook}>예약 확정</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
