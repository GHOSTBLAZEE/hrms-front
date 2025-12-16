"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAttendanceMonth } from "@/hooks/attendance/useAttendanceMonth";

export default function MiniCalendar({ onDayClick }) {
  const [month, setMonth] = useState(new Date());

  // Fetch attendance for the month
  const { data: attendance = [] } = useAttendanceMonth(month);

  // Map attendance by date for quick lookup
  const attendanceMap = attendance.reduce((acc, a) => {
    acc[a.date] = a;
    return acc;
  }, {});

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="border rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMonth(subMonths(month, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-sm font-medium">
          {format(month, "MMMM yyyy")}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-xs text-muted-foreground mb-1">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const dateKey = format(d, "yyyy-MM-dd");
          const record = attendanceMap[dateKey];
          const isToday = isSameDay(d, new Date());

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick?.(record)}
              className={cn(
                "h-8 text-xs rounded-md flex items-center justify-center transition",
                !isSameMonth(d, month) && "text-muted-foreground opacity-40",
                isToday && "border border-primary",
                record?.status === "present" &&
                  "bg-green-100 text-green-700",
                record?.status === "absent" &&
                  "bg-red-100 text-red-700",
                record?.status === "leave" &&
                  "bg-yellow-100 text-yellow-700",
                !record && "hover:bg-muted"
              )}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
