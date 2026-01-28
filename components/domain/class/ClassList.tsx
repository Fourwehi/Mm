"use client";

import { useState, useMemo } from "react";
import { ClassCard } from "./ClassCard";
import { ClassFilter } from "./ClassFilter";
import { mockClasses } from "@/lib/mock-data";

export function ClassList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedLocation, setSelectedLocation] = useState("전체");

  const filteredClasses = useMemo(() => {
    return mockClasses.filter((c) => {
      const matchesCategory =
        selectedCategory === "전체" || c.category === selectedCategory;
      const matchesLocation =
        selectedLocation === "전체" || c.studio.location === selectedLocation;
      return matchesCategory && matchesLocation;
    });
  }, [selectedCategory, selectedLocation]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <ClassFilter
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
          onCategoryChange={setSelectedCategory}
          onLocationChange={setSelectedLocation}
        />
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          {filteredClasses.length}개
        </p>
      </div>

      {filteredClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-card py-12">
          <p className="text-sm font-medium text-foreground">
            검색 결과가 없습니다
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            다른 필터를 선택해보세요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredClasses.map((hobbyClass) => (
            <ClassCard key={hobbyClass.id} hobbyClass={hobbyClass} />
          ))}
        </div>
      )}
    </div>
  );
}
