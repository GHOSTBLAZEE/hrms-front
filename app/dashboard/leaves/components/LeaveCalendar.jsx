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

// FIXED: Map both leave type codes AND full names
const leaveTypeColors = {
  // By code (uppercase)
  'CL': "bg-blue-100 border-blue-300 text-blue-700",
  'SL': "bg-red-100 border-red-300 text-red-700",
  'EL': "bg-emerald-100 border-emerald-300 text-emerald-700",
  'CO': "bg-purple-100 border-purple-300 text-purple-700",
  'LWP': "bg-orange-100 border-orange-300 text-orange-700",
  // By full name (lowercase)
  'casual': "bg-blue-100 border-blue-300 text-blue-700",
  'sick': "bg-red-100 border-red-300 text-red-700",
  'earned': "bg-emerald-100 border-emerald-300 text-emerald-700",
  'comp_off': "bg-purple-100 border-purple-300 text-purple-700",
  'privilege': "bg-indigo-100 border-indigo-300 text-indigo-700",
  'lwp': "bg-orange-100 border-orange-300 text-orange-700",
};

const statusColors = {
  'approved': "bg-emerald-50 border-emerald-300 text-emerald-700",
  'pending': "bg-amber-50 border-amber-300 text-amber-700",
  'rejected': "bg-red-50 border-red-300 text-red-700",
};

export default function LeaveCalendar({ leaves = [], onApplyLeave }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // DEBUG: Log leaves data
  console.log('LeaveCalendar - Leaves data:', {
    count: leaves.length,
    sample: leaves[0],
    allLeaves: leaves
  });

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

  // Get leaves for a specific date with proper date comparison
  const getLeavesForDate = (date) => {
    const matchedLeaves = leaves.filter((leave) => {
      // FIXED: Handle ISO 8601 format (2026-02-01T18:30:00.000000Z)
      // Extract just the date part before 'T'
      const startDateStr = leave.start_date.split('T')[0];
      const endDateStr = leave.end_date.split('T')[0];
      
      // Parse dates as local dates (not UTC) to avoid timezone issues
      const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
      const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
      
      const startDate = new Date(startYear, startMonth - 1, startDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);
      const checkDate = new Date(year, month, date);
      
      // Normalize to midnight for accurate comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      
      const isMatch = checkDate >= startDate && checkDate <= endDate;
      
      // DEBUG: Log for troubleshooting
      if (isMatch) {
        console.log(`✓ Date ${year}-${month + 1}-${date} matches leave:`, {
          leaveId: leave.id,
          code: leave.leave_type?.code,
          status: leave.status,
          startDateStr,
          endDateStr
        });
      }
      
      return isMatch;
    });

    return matchedLeaves;
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

  // Check if date is weekend
  const isWeekend = (day) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // FIXED: Get color for leave badge
  const getLeaveColor = (leave) => {
    const leaveCode = leave.leave_type?.code?.toUpperCase(); // Use uppercase for codes
    const leaveName = leave.leave_type?.name?.toLowerCase();
    const leaveStatus = leave.status?.toLowerCase();

    // DEBUG: Log what we're trying to match
    console.log('Getting color for leave:', {
      id: leave.id,
      code: leaveCode,
      name: leaveName,
      status: leaveStatus
    });

    // Try to match by code first (e.g., "CL", "SL")
    if (leaveCode && leaveTypeColors[leaveCode]) {
      return leaveTypeColors[leaveCode];
    }

    // Try to match by name (e.g., "casual", "sick")
    if (leaveName && leaveTypeColors[leaveName]) {
      return leaveTypeColors[leaveName];
    }

    // Fallback to status color
    if (leaveStatus && statusColors[leaveStatus]) {
      return statusColors[leaveStatus];
    }

    // Default color
    return "bg-slate-100 border-slate-300 text-slate-700";
  };

  // FIXED: Get display text for leave badge
  const getLeaveDisplayText = (leave) => {
    // Prefer code, fallback to status abbreviation
    if (leave.leave_type?.code) {
      return leave.leave_type.code.toUpperCase();
    }
    if (leave.status) {
      return leave.status.substring(0, 3).toUpperCase();
    }
    return 'LV';
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      {/* Calendar Header */}
      <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMonth}
              className="text-white hover:bg-white/10 h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="text-white hover:bg-white/10 h-7 px-2 text-xs"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              className="text-white hover:bg-white/10 h-7 w-7 p-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day, idx) => (
            <div
              key={day}
              className={cn(
                "text-center text-[10px] font-semibold uppercase tracking-wide py-1.5",
                idx === 0 || idx === 6 ? "text-red-600" : "text-slate-600"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
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
            const isWeekendDay = isWeekend(day);

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[70px] border rounded-md p-1.5 relative hover:shadow-sm transition-all cursor-pointer group",
                  isToday && "ring-2 ring-blue-500 bg-blue-50",
                  isPast && !isToday && "bg-slate-50/50",
                  isWeekendDay && !isToday && "bg-red-50/30",
                  dayLeaves.length > 0 && !isToday && "bg-gradient-to-br from-white to-slate-50",
                  !isPast && !isToday && "hover:bg-slate-50 hover:border-slate-300"
                )}
                onClick={() => !isPast && onApplyLeave && onApplyLeave(new Date(year, month, day))}
              >
                {/* Day Number */}
                <div
                  className={cn(
                    "text-xs font-semibold mb-1",
                    isToday && "text-blue-600 font-bold",
                    isPast && !isToday && "text-slate-400",
                    isWeekendDay && !isToday && !isPast && "text-red-600"
                  )}
                >
                  {day}
                </div>

                {/* Leave Indicators - FIXED */}
                <div className="space-y-0.5">
                  {dayLeaves.slice(0, 3).map((leave) => {
                    const colorClass = getLeaveColor(leave);
                    const displayText = getLeaveDisplayText(leave);
                    const tooltip = `${leave.leave_type?.name || 'Leave'} - ${leave.status || 'Pending'}`;
                    
                    return (
                      <div
                        key={leave.id}
                        className={cn(
                          "text-[9px] px-1 py-0.5 rounded border truncate font-semibold shadow-sm",
                          colorClass
                        )}
                        title={tooltip}
                      >
                        {displayText}
                      </div>
                    );
                  })}
                  {dayLeaves.length > 3 && (
                    <div className="text-[8px] text-slate-600 px-1 font-semibold">
                      +{dayLeaves.length - 3} more
                    </div>
                  )}
                </div>

                {/* Hover effect for non-past dates */}
                {!isPast && (
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-3 pb-3 pt-2 border-t bg-slate-50/50">
        <div className="flex flex-wrap gap-2.5 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-300" />
            <span className="text-muted-foreground">Casual (CL)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-100 border border-red-300" />
            <span className="text-muted-foreground">Sick (SL)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
            <span className="text-muted-foreground">Earned (EL)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-purple-100 border border-purple-300" />
            <span className="text-muted-foreground">Comp Off (CO)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm ring-2 ring-blue-500 bg-blue-50" />
            <span className="text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-50/50" />
            <span className="text-muted-foreground">Weekend</span>
          </div>
        </div>
      </div>
    </Card>
  );
}