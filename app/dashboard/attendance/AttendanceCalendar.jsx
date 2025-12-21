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
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AttendanceCalendar({
  monthAttendance = [],
  onDayClick,
}) {
  const [month, setMonth] = useState(new Date());

  const map = {};
  monthAttendance.forEach((a) => {
    map[a.date.slice(0, 10)] = a;
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
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">
          {format(month, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setMonth(subMonths(month, 1))}>
            Prev
          </Button>
          <Button size="sm" onClick={() => setMonth(addMonths(month, 1))}>
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const att = map[key];
          const status = att?.status ?? "none";

          return (
            <button
              key={key}
              onClick={() => onDayClick(day, att)}
              className={`h-20 border rounded p-1 text-xs ${
                !isSameMonth(day, month) ? "opacity-40" : ""
              }`}
            >
              <div className="flex justify-between">
                <span>{format(day, "d")}</span>
                {att?.total_work_hours && (
                  <span>{att.total_work_hours}h</span>
                )}
              </div>

              <div className="mt-auto text-center capitalize">
                {status.replace("_", " ")}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
