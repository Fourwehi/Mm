"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, LOCATIONS } from "@/types/domain.types";

interface ClassFilterProps {
  selectedCategory: string;
  selectedLocation: string;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
}

export function ClassFilter({
  selectedCategory,
  selectedLocation,
  onCategoryChange,
  onLocationChange,
}: ClassFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border/50 rounded-full">
          <SelectValue placeholder="지역 선택" />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS.map((location) => (
            <SelectItem key={location} value={location} className="text-xs">
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border/50 rounded-full">
          <SelectValue placeholder="카테고리 선택" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category} className="text-xs">
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
