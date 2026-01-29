"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ApprovalSlaBadge({ step }) {
  if (!step || !step.sla_hours) return null;

  // Calculate SLA deadline
  const createdAt = step.created_at ? new Date(step.created_at) : new Date();
  const slaHours = step.sla_hours;
  const slaDeadline = new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000);
  
  // Calculate remaining time
  const now = new Date();
  const remainingMs = slaDeadline - now;
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  // Check if overdue
  const isOverdue = remainingMs < 0;
  const isUrgent = remainingMs > 0 && remainingMs < 2 * 60 * 60 * 1000; // Less than 2 hours

  if (isOverdue) {
    const overdueHours = Math.abs(remainingHours);
    const overdueMinutes = Math.abs(remainingMinutes);
    
    return (
      <Badge variant="destructive" className="gap-1.5 text-xs">
        <AlertTriangle className="h-3 w-3" />
        Overdue by {overdueHours > 0 && `${overdueHours}h `}
        {overdueMinutes}m
      </Badge>
    );
  }

  if (isUrgent) {
    return (
      <Badge variant="outline" className="gap-1.5 text-xs border-amber-500 text-amber-700">
        <Clock className="h-3 w-3" />
        {remainingHours > 0 && `${remainingHours}h `}
        {remainingMinutes}m remaining
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 text-xs text-muted-foreground">
      <Clock className="h-3 w-3" />
      {remainingHours > 0 && `${remainingHours}h `}
      {remainingMinutes}m remaining
    </Badge>
  );
}