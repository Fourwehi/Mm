import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import type { HobbyClass } from "@/lib/types";

interface ClassCardProps {
  hobbyClass: HobbyClass;
}

export function ClassCard({ hobbyClass }: ClassCardProps) {
  return (
    <Link href={`/class/${hobbyClass.id}`} className="block">
      <Card className="group h-full overflow-hidden border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
            <span className="text-3xl font-semibold text-primary/25">
              {hobbyClass.category.charAt(0)}
            </span>
          </div>
          <Badge className="absolute left-2 top-2 bg-card/90 text-foreground text-[10px] font-medium px-2 py-0.5 backdrop-blur-sm">
            {hobbyClass.category}
          </Badge>
        </div>
        <CardContent className="p-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {hobbyClass.name}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {hobbyClass.studio.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {hobbyClass.duration}분
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50">
            <span className="text-sm font-bold text-foreground">
              {hobbyClass.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground ml-0.5">원</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
