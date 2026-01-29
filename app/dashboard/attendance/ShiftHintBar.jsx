"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Sun, Sunset, Moon, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShiftHintBar({ shift, lastPunch }) {
  if (!shift) {
    return null;
  }

  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  // Determine shift period
  const getShiftPeriod = () => {
    if (currentHour >= 6 && currentHour < 12) return "morning";
    if (currentHour >= 12 && currentHour < 17) return "afternoon";
    if (currentHour >= 17 && currentHour < 21) return "evening";
    return "night";
  };

  const shiftPeriod = getShiftPeriod();

  const periodConfig = {
    morning: {
      icon: Sun,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
    },
    afternoon: {
      icon: Sun,
      gradient: "from-orange-500 to-rose-500",
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
    },
    evening: {
      icon: Sunset,
      gradient: "from-rose-500 to-purple-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
    },
    night: {
      icon: Moon,
      gradient: "from-indigo-500 to-blue-500",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
    },
  };

  const config = periodConfig[shiftPeriod];
  const PeriodIcon = config.icon;

  // Parse shift timings
  const shiftStart = shift.start_time; // e.g., "09:00"
  const shiftEnd = shift.end_time; // e.g., "18:00"

  // Check if late
  const isLate = lastPunch?.type === "IN" && shift.start_time;
  const isPunchedOut = lastPunch?.type === "OUT";

  // Calculate time difference if late
  const getLateDuration = () => {
    if (!isLate || !lastPunch) return null;

    try {
      const [shiftHour, shiftMin] = shift.start_time.split(":").map(Number);
      const punchTime = new Date(lastPunch.punch_time);
      const punchHour = punchTime.getHours();
      const punchMin = punchTime.getMinutes();

      const shiftMinutes = shiftHour * 60 + shiftMin;
      const punchMinutes = punchHour * 60 + punchMin;

      const diffMinutes = punchMinutes - shiftMinutes;

      if (diffMinutes > 0) {
        return diffMinutes;
      }
    } catch (error) {
      console.error("Error calculating late duration:", error);
    }

    return null;
  };

  const lateDuration = getLateDuration();

  return (
    <Card
      className={cn(
        "overflow-hidden border transition-all duration-300",
        config.border,
        config.bg
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br shadow-lg",
              config.gradient
            )}
          >
            <PeriodIcon className="h-5 w-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn("text-sm font-semibold", config.text)}>
                {shift.name || "Current Shift"}
              </h3>
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {shift.type || "Regular"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-slate-700">
                  {shiftStart} - {shiftEnd}
                </span>
              </div>

              {shift.break_duration && (
                <div className="text-xs text-muted-foreground">
                  Break: {shift.break_duration} min
                </div>
              )}

              {shift.grace_period && (
                <div className="text-xs text-muted-foreground">
                  Grace: {shift.grace_period} min
                </div>
              )}
            </div>

            {/* Late warning */}
            {lateDuration && lateDuration > (shift.grace_period || 0) && (
              <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-100 border border-amber-300 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-amber-800">
                    Late by {lateDuration} minutes
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Expected at {shiftStart}, punched in at{" "}
                    {new Date(lastPunch.punch_time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* On time badge */}
            {lastPunch?.type === "IN" && lateDuration !== null && lateDuration <= (shift.grace_period || 0) && (
              <div className="mt-3 flex items-center gap-2 p-2.5 bg-emerald-100 border border-emerald-300 rounded-lg">
                <Clock className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-medium text-emerald-800">
                  Punched in on time
                </p>
              </div>
            )}

            {/* Punched out message */}
            {isPunchedOut && (
              <div className="mt-3 flex items-center gap-2 p-2.5 bg-blue-100 border border-blue-300 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-blue-800">
                  Shift completed - Punched out at{" "}
                  {new Date(lastPunch.punch_time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}