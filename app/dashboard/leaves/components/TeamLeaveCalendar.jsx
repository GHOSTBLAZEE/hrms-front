"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, Briefcase } from "lucide-react";
import { formatDate, formatDateRange, parseLocalDate } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

export default function TeamLeaveCalendar({ teamLeaves, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const next30Days = new Date(today);
  next30Days.setDate(today.getDate() + 30);

  // Filter upcoming and current leaves
  const upcomingLeaves = (teamLeaves || [])
    .filter((leave) => {
      const startDate = parseLocalDate(leave.start_date);
      const endDate = parseLocalDate(leave.end_date);
      return (
        leave.status === "approved" &&
        endDate >= today &&
        startDate <= next30Days
      );
    })
    .sort((a, b) => {
      const dateA = parseLocalDate(a.start_date);
      const dateB = parseLocalDate(b.start_date);
      return dateA - dateB;
    });

  // Group leaves: on leave now, upcoming this week, upcoming this month
  const onLeaveNow = upcomingLeaves.filter((leave) => {
    const startDate = parseLocalDate(leave.start_date);
    const endDate = parseLocalDate(leave.end_date);
    return startDate <= today && endDate >= today;
  });

  const thisWeek = upcomingLeaves.filter((leave) => {
    const startDate = parseLocalDate(leave.start_date);
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    return startDate > today && startDate <= next7Days;
  });

  const thisMonth = upcomingLeaves.filter((leave) => {
    const startDate = parseLocalDate(leave.start_date);
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    return startDate > next7Days && startDate <= next30Days;
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Team Availability</h3>
              <p className="text-sm text-blue-100">
                Upcoming leaves for the next 30 days
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{upcomingLeaves.length}</p>
            <p className="text-xs text-blue-100">Total Leaves</p>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Briefcase className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{onLeaveNow.length}</p>
              <p className="text-xs text-muted-foreground">On Leave Now</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{thisWeek.length}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{thisMonth.length}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {upcomingLeaves.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Upcoming Leaves
          </h3>
          <p className="text-sm text-muted-foreground">
            Your team is fully available for the next 30 days
          </p>
        </Card>
      )}

      {/* On Leave Now */}
      {onLeaveNow.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-1 h-4 bg-red-500 rounded" />
            On Leave Now ({onLeaveNow.length})
          </h3>
          <div className="grid gap-3">
            {onLeaveNow.map((leave) => (
              <LeaveCard key={leave.id} leave={leave} highlight />
            ))}
          </div>
        </div>
      )}

      {/* This Week */}
      {thisWeek.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-1 h-4 bg-amber-500 rounded" />
            This Week ({thisWeek.length})
          </h3>
          <div className="grid gap-3">
            {thisWeek.map((leave) => (
              <LeaveCard key={leave.id} leave={leave} />
            ))}
          </div>
        </div>
      )}

      {/* This Month */}
      {thisMonth.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded" />
            Later This Month ({thisMonth.length})
          </h3>
          <div className="grid gap-3">
            {thisMonth.map((leave) => (
              <LeaveCard key={leave.id} leave={leave} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LeaveCard({ leave, highlight = false }) {
  const initials = leave.employee?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <Card 
      className={cn(
        "p-4 hover:shadow-md transition-all",
        highlight && "border-l-4 border-l-red-500 bg-red-50/30"
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-slate-200">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900 truncate">
              {leave.employee?.name}
            </h4>
            <Badge variant="outline" className="flex-shrink-0 font-mono text-xs">
              {leave.employee?.code}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <span className="font-medium text-slate-700">
              {formatDateRange(leave.start_date, leave.end_date)}
            </span>
            <span>•</span>
            <span className="font-semibold">
              {leave.days} {leave.days === 1 ? 'day' : 'days'}
            </span>
            <span>•</span>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 border-blue-200"
            >
              {leave.leave_type?.name}
            </Badge>
          </div>
          
          {leave.reason && (
            <p className="text-xs text-muted-foreground mt-2 truncate">
              {leave.reason}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}