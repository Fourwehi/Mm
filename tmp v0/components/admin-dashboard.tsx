"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Check,
  Clock,
  Edit,
  Plus,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { mockClasses, mockTimeSlots, mockReservations } from "@/lib/mock-data";
import type { ReservationStatus } from "@/lib/types";
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

export function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReservations =
    statusFilter === "all"
      ? mockReservations
      : mockReservations.filter((r) => r.status === statusFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Tabs defaultValue="classes" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
        <TabsTrigger value="classes" className="gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">클래스 관리</span>
          <span className="sm:hidden">클래스</span>
        </TabsTrigger>
        <TabsTrigger value="timeslots" className="gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">회차 관리</span>
          <span className="sm:hidden">회차</span>
        </TabsTrigger>
        <TabsTrigger value="reservations" className="gap-2">
          <Ticket className="h-4 w-4" />
          <span className="hidden sm:inline">예약 관리</span>
          <span className="sm:hidden">예약</span>
        </TabsTrigger>
      </TabsList>

      {/* Classes Tab */}
      <TabsContent value="classes" className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {mockClasses.length}개의 클래스
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                클래스 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 클래스 등록</DialogTitle>
                <DialogDescription>
                  새로운 클래스 정보를 입력하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="class-name">클래스명</Label>
                  <Input id="class-name" placeholder="클래스명을 입력하세요" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">가격 (원)</Label>
                    <Input id="price" type="number" placeholder="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">소요 시간 (분)</Label>
                    <Input id="duration" type="number" placeholder="120" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="요리">요리</SelectItem>
                      <SelectItem value="공예">공예</SelectItem>
                      <SelectItem value="미술">미술</SelectItem>
                      <SelectItem value="음악">음악</SelectItem>
                      <SelectItem value="운동">운동</SelectItem>
                      <SelectItem value="사진">사진</SelectItem>
                      <SelectItem value="댄스">댄스</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">등록하기</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {mockClasses.map((cls) => (
            <Card key={cls.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{cls.name}</h3>
                    <Badge variant="outline">{cls.category}</Badge>
                  </div>
                  <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                    <span>{cls.price.toLocaleString()}원</span>
                    <span>{cls.duration}분</span>
                    <span>{cls.studio.location}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Time Slots Tab */}
      <TabsContent value="timeslots" className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {mockTimeSlots.length}개의 회차
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                회차 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 회차 등록</DialogTitle>
                <DialogDescription>
                  새로운 회차 정보를 입력하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slot-class">클래스</Label>
                  <Select>
                    <SelectTrigger id="slot-class">
                      <SelectValue placeholder="클래스 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slot-date">날짜</Label>
                    <Input id="slot-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slot-time">시작 시간</Label>
                    <Input id="slot-time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">정원</Label>
                  <Input id="capacity" type="number" placeholder="8" />
                </div>
                <Button className="w-full">등록하기</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {mockTimeSlots.map((slot) => {
            const cls = mockClasses.find((c) => c.id === slot.classId);
            const remaining = slot.maxCapacity - slot.currentBookings;
            const isFull = remaining === 0;

            return (
              <Card key={slot.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {cls?.name || "알 수 없음"}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(slot.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {slot.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {slot.currentBookings}/{slot.maxCapacity}명
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={isFull ? "secondary" : "outline"}
                    className={cn(isFull && "bg-destructive/10 text-destructive")}
                  >
                    {isFull ? "마감" : `잔여 ${remaining}석`}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      {/* Reservations Tab */}
      <TabsContent value="reservations" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            총 {filteredReservations.length}개의 예약
          </p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="PENDING">대기중</SelectItem>
              <SelectItem value="CONFIRMED">확정</SelectItem>
              <SelectItem value="CANCELLED">취소됨</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredReservations.map((reservation) => {
            const status = statusConfig[reservation.status];
            const isPending = reservation.status === "PENDING";

            return (
              <Card key={reservation.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {reservation.className}
                        </h3>
                        <Badge className={cn(status.className)}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>
                          {formatDate(reservation.date)} {reservation.startTime}
                        </span>
                        <span>{reservation.guests}명</span>
                        <span>{reservation.studioName}</span>
                      </div>
                    </div>
                    {isPending && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-success hover:bg-success/10 hover:text-success bg-transparent"
                        >
                          <Check className="h-4 w-4" />
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
                        >
                          <X className="h-4 w-4" />
                          거절
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
