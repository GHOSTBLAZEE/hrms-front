"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

const leaveColors = {
  casual: "bg-blue-100 border-blue-300 text-blue-700",
  sick: "bg-red-100 border-red-300 text-red-700",
  earned: "bg-emerald-100 border-emerald-300 text-emerald-700",
  comp_off: "bg-purple-100 border-purple-300 text-purple-700",
  approved: "bg-emerald-50 border-emerald-200",
  pending: "bg-amber-50 border-amber-200",
  rejected: "bg-red-50 border-red-200",
};

export default function LeaveCalendar({ leaves, onApplyLeave }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get days in month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Previous month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Next month
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get leaves for a specific date
  const getLeavesForDate = (date) => {
    return leaves.filter((leave) => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      const checkDate = new Date(year, month, date);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  // Generate calendar days
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null); // Empty cells for previous month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="overflow-hidden border-slate-200 shadow-lg">
      {/* Calendar Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMonth}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="text-white hover:bg-white/10"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wide py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayLeaves = getLeavesForDate(day);
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();
            const isPast = new Date(year, month, day) < new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={day}
                className={cn(
                  "aspect-square border rounded-lg p-2 relative hover:shadow-md transition-all cursor-pointer",
                  isToday && "ring-2 ring-blue-500 bg-blue-50",
                  isPast && "bg-slate-50",
                  dayLeaves.length > 0 && "bg-gradient-to-br from-white to-slate-50"
                )}
                onClick={() => !isPast && onApplyLeave(new Date(year, month, day))}
              >
                {/* Day Number */}
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isToday && "text-blue-600 font-bold",
                    isPast && "text-slate-400"
                  )}
                >
                  {day}
                </div>

                {/* Leave Indicators */}
                <div className="space-y-1">
                  {dayLeaves.slice(0, 2).map((leave) => (
                    <div
                      key={leave.id}
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border truncate",
                        leaveColors[leave.leave_type?.code?.toLowerCase()] ||
                          leaveColors[leave.status?.toLowerCase()] ||
                          "bg-slate-100 border-slate-300"
                      )}
                      title={`${leave.leave_type?.name} - ${leave.status}`}
                    >
                      {leave.leave_type?.code || leave.status}
                    </div>
                  ))}
                  {dayLeaves.length > 2 && (
                    <div className="text-[9px] text-muted-foreground px-1">
                      +{dayLeaves.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
          <span className="text-muted-foreground">Casual Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
          <span className="text-muted-foreground">Sick Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
          <span className="text-muted-foreground">Earned Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300" />
          <span className="text-muted-foreground">Comp Off</span>
        </div>
      </div>
    </Card>
  );
}