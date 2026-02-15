"use client";

import { useState } from "react";

/* ----------------------------------------------------------------
 | Color maps
 |----------------------------------------------------------------*/
const leaveTypeColors = {
  CL:     "bg-blue-100 border-blue-300 text-blue-700",
  SL:     "bg-red-100 border-red-300 text-red-700",
  EL:     "bg-green-100 border-green-300 text-green-700",
  casual: "bg-blue-100 border-blue-300 text-blue-700",
  sick:   "bg-red-100 border-red-300 text-red-700",
  earned: "bg-green-100 border-green-300 text-green-700",
};

const statusColors = {
  approved: "bg-green-100 border-green-300 text-green-700",
  pending:  "bg-yellow-100 border-yellow-300 text-yellow-700",
  rejected: "bg-red-100 border-red-300 text-red-700",
};

/* ----------------------------------------------------------------
 | Helpers
 |----------------------------------------------------------------*/
function getLeaveColor(leave) {
  const leaveCode   = leave.leave_type?.code?.toUpperCase();
  const leaveName   = leave.leave_type?.name?.toLowerCase();
  const leaveStatus = leave.status?.toLowerCase();

  if (leaveCode && leaveTypeColors[leaveCode]) return leaveTypeColors[leaveCode];
  if (leaveName && leaveTypeColors[leaveName]) return leaveTypeColors[leaveName];
  if (leaveStatus && statusColors[leaveStatus]) return statusColors[leaveStatus];

  return "bg-slate-100 border-slate-300 text-slate-700";
}

function getLeaveDisplayText(leave) {
  if (leave.leave_type?.code) return leave.leave_type.code.toUpperCase();
  return leave.status?.slice(0, 2).toUpperCase() ?? "L";
}

function getLeavesForDate(leaves, year, month, date) {
  return leaves.filter((leave) => {
    // Handle ISO 8601 format (2026-02-01T18:30:00.000000Z) — extract date part only
    const startDateStr = leave.start_date.split("T")[0];
    const endDateStr   = leave.end_date.split("T")[0];

    const [sY, sM, sD] = startDateStr.split("-").map(Number);
    const [eY, eM, eD] = endDateStr.split("-").map(Number);

    const startDate = new Date(sY, sM - 1, sD);
    const endDate   = new Date(eY, eM - 1, eD);
    const checkDate = new Date(year, month, date);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate >= startDate && checkDate <= endDate;
  });
}

/* ----------------------------------------------------------------
 | Component
 |----------------------------------------------------------------*/
export default function LeaveCalendar({ leaves = [], onDayClick }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay      = new Date(year, month, 1);
  const lastDay       = new Date(year, month + 1, 0);
  const daysInMonth   = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isWeekend = (day) => {
    const dow = new Date(year, month, day).getDay();
    return dow === 0 || dow === 6;
  };

  const weekDays  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="text-sm px-2 py-1 border rounded hover:bg-muted"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            className="text-sm px-2 py-1 border rounded hover:bg-muted"
          >
            ›
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} />;
          }

          const dayLeaves = getLeavesForDate(leaves, year, month, day);
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <button
              key={day}
              onClick={() => onDayClick?.(day, dayLeaves)}
              className={[
                "min-h-16 border rounded p-1 text-xs flex flex-col gap-0.5 transition-colors",
                isWeekend(day) ? "bg-muted/40" : "hover:bg-muted/20",
                isToday ? "ring-2 ring-primary" : "",
              ].join(" ")}
            >
              <span className={`font-medium ${isToday ? "text-primary" : ""}`}>
                {day}
              </span>
              {dayLeaves.map((leave) => (
                <span
                  key={leave.id}
                  className={`rounded px-1 border text-[10px] leading-4 truncate ${getLeaveColor(leave)}`}
                >
                  {getLeaveDisplayText(leave)}
                </span>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}