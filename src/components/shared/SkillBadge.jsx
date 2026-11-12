import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SkillBadge({ skill, variant = "default" }) {
  const variants = {
    matched: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25",
    missing: "bg-red-500/15 text-red-700 border-red-500/30 hover:bg-red-500/25",
    default: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  };

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", variants[variant])}>
      {skill}
    </Badge>
  );
}