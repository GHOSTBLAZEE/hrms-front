"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  CalendarDays,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/* --------------------------------
 | Helpers
 |---------------------------------*/
function getEventIcon(status) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "skipped":
      return <XCircle className="h-4 w-4 text-gray-400" />;
    default:
      return <Clock className="h-4 w-4 text-amber-500" />;
  }
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDateTime(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Relative time for recent events
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  // Absolute time for older events
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* --------------------------------
 | Component
 |---------------------------------*/
export default function ApprovalHistoryTimeline({ steps = [] }) {
  if (!steps.length) return null;

  // Get all events (acted steps) sorted by date
  const events = steps
    .filter((step) => step.acted_at)
    .map((step) => {
      // Actor is the person who actually acted
      const actorName = step.actor?.name || "System";
      
      // Approver is their role/designation
      const approverInfo = step.approver?.name 
        ? `${step.approver.name}${step.approver_type === 'role' ? ' (Role)' : ''}`
        : step.approver_type === 'role' ? 'Role Approver' : 'User Approver';
      
      return {
        id: step.id,
        type: step.status,
        actor: actorName,
        approverInfo: approverInfo,
        actorType: step.approver_type,
        timestamp: step.acted_at,
        remarks: step.remarks,
        stepOrder: step.step_order,
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!events.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No actions taken yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
            )}

            {/* Event card */}
            <div className="flex gap-4">
              {/* Avatar with icon */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarFallback
                    className={
                      event.type === "approved"
                        ? "bg-green-100 text-green-700"
                        : event.type === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {getInitials(event.actor)}
                  </AvatarFallback>
                </Avatar>

                {/* Status badge on avatar */}
                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                  {getEventIcon(event.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="rounded-lg border bg-card p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          {event.actor}
                        </span>
                        <Badge
                          variant={
                            event.type === "approved"
                              ? "default"
                              : event.type === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {event.type === "approved"
                            ? "Approved"
                            : event.type === "rejected"
                            ? "Rejected"
                            : "Skipped"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{event.approverInfo}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>{formatDateTime(event.timestamp)}</span>
                        <span className="mx-1">•</span>
                        <span>Step {event.stepOrder}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  {event.remarks && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-start gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Remarks
                          </div>
                          <p className="text-sm text-foreground italic">
                            "{event.remarks}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}