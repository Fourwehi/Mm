"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Clock, MapPin, Store, Sparkles } from "lucide-react";
import type { HobbyClass } from "@/lib/types";

interface ClassDetailContentProps {
  hobbyClass: HobbyClass;
}

export function ClassDetailContent({ hobbyClass }: ClassDetailContentProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Class Info Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {hobbyClass.category}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                {hobbyClass.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {hobbyClass.duration}분
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {hobbyClass.studio.location}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-foreground">
                {hobbyClass.price.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground">원</span>
              <p className="mt-1 text-sm text-muted-foreground">1인 기준</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-foreground">클래스 소개</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {hobbyClass.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Studio Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Store className="h-5 w-5 text-primary" />
            스튜디오 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-foreground">
              {hobbyClass.studio.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {hobbyClass.studio.location}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {hobbyClass.studio.description}
          </p>
        </CardContent>
      </Card>

      {/* AI Summary Section */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-accent" />
            AI 요약
            <Badge variant="outline" className="text-xs font-normal">
              자동 생성
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            이 클래스는 {hobbyClass.category} 카테고리에 속하며,{" "}
            {hobbyClass.studio.location}에 위치한 {hobbyClass.studio.name}
            에서 진행됩니다. 약 {hobbyClass.duration}분 동안 진행되며, 가격은{" "}
            {hobbyClass.price.toLocaleString()}원입니다. 초보자부터 경험자까지
            모두 참여할 수 있는 클래스입니다.
          </p>
        </CardContent>
      </Card>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 md:static md:border-0 md:bg-transparent md:p-0">
        <div className="container mx-auto flex items-center justify-between gap-4 md:justify-end">
          <div className="md:hidden">
            <span className="text-xl font-bold text-foreground">
              {hobbyClass.price.toLocaleString()}
            </span>
            <span className="text-muted-foreground">원</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(true)}
              className="flex-1 md:flex-none"
            >
              문의하기
            </Button>
            <Link href={`/class/${hobbyClass.id}/book`}>
              <Button className="flex-1 md:flex-none">예약하기</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로그인이 필요합니다</DialogTitle>
            <DialogDescription>
              문의하기 기능을 사용하려면 먼저 로그인해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              취소
            </Button>
            <Button>로그인</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
