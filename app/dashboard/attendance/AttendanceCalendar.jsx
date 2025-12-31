"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
} from "date-fns";
import { Button } from "@/components/ui/button";

const STATUS_CLASSES = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  half_day: "bg-amber-100 text-amber-800",
  leave: "bg-blue-100 text-blue-800",
  holiday: "bg-purple-100 text-purple-800",
  weekly_off: "bg-gray-100 text-gray-700",
  missed_punch: "bg-orange-100 text-orange-800",
};

export default function AttendanceCalendar({
  month,
  setMonth,
  monthAttendance = [],
  onDayClick,
}) {
  // Map attendance by date for O(1) lookup
  const attendanceMap = {};
  monthAttendance.forEach((a) => {
    attendanceMap[a.date.slice(0, 10)] = a;
  });

  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  const days = [];
  let d = start;
  while (d <= end) {
    days.push(d);
    d = addDays(d, 1);
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">
          {format(month, "MMMM yyyy")}
        </h3>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMonth(subMonths(month, 1))}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMonth(addMonths(month, 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const att = attendanceMap[key];
          const status = att?.status ?? null;

          const isDisabled = !isSameMonth(day, month) || !att;
          const statusClass = STATUS_CLASSES[status] ?? "";

          return (
            <button
              key={key}
              disabled={isDisabled}
              onClick={() => onDayClick(day, att)}
              className={`h-20 border rounded p-1 text-xs flex flex-col
                ${statusClass}
                ${!isSameMonth(day, month) ? "opacity-40" : ""}
                ${isDisabled ? "cursor-not-allowed" : "hover:ring-1 hover:ring-primary"}
              `}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium">{format(day, "d")}</span>

                {att?.is_locked && (
                  <span className="text-[10px] text-red-600">🔒</span>
                )}
              </div>

              <div className="mt-auto text-center capitalize leading-tight">
                {status?.replace("_", " ")}

                {att?.worked_minutes != null && (
                  <div className="text-[10px] opacity-70">
                    {Math.floor(att.worked_minutes / 60)}h
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
