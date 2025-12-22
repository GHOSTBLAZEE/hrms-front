"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
} from "date-fns";

import { STATUS_COLORS } from "../constants";

export default function MonthlyCalendar({ month, attendance, onDayClick }) {
  const map = attendance.reduce((acc, a) => {
    acc[a.date.slice(0, 10)] = a;
    return acc;
  }, {});

  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  const days = [];
  let d = start;
  while (d <= end) {
    days.push(d);
    d = addDays(d, 1);
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        const att = map[key];
        const status = att?.status ?? "weekend";

        return (
          <button
            key={key}
            onClick={() => att && onDayClick({ day, attendance: att })}
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

            <div
              className={`mt-1 rounded px-1 text-center ${STATUS_COLORS[status]}`}
            >
              {status.replace("_", " ")}
            </div>
          </button>
        );
      })}
    </div>
  );
}
