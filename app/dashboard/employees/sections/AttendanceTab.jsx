"use client";

import { useEmployeeAttendanceMonthly } from "@/hooks/attendance/useEmployeeAttendanceMonthly";
import AttendanceTrend from "../[employeeId]/components/AttendanceTrend";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function AttendanceTab({ employee }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const { data, isLoading } = useEmployeeAttendanceMonthly({
    employeeId: employee.id,
    year,
    month,
  });

  const stats = {
    present: data?.present_days || 0,
    absent: data?.absent_days || 0,
    leave: data?.leave_days || 0,
    overtime: data?.overtime_hours || 0,
  };

  const totalDays = stats.present + stats.absent + stats.leave;
  const attendanceRate = totalDays > 0 ? ((stats.present / totalDays) * 100).toFixed(1) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Month/Year Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Attendance Summary</h2>
            <p className="text-sm text-muted-foreground">
              Track daily attendance and overtime
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={month.toString()}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <SelectItem key={m} value={m.toString()}>
                  {new Date(2000, m - 1).toLocaleDateString("en-US", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={year.toString()}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Present Days
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.present}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                {attendanceRate}% attendance
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Absent Days
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.absent}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Unplanned absences
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Leave Days
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.leave}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Approved leaves
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Overtime (hrs)
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.overtime}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Extra hours worked
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Timer className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Rate Badge */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Attendance Rate
              </p>
              <p className="text-xs text-muted-foreground">
                Based on present days vs total working days
              </p>
            </div>
          </div>
          <Badge
            className={`text-lg font-semibold ${
              attendanceRate >= 90
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : attendanceRate >= 75
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {attendanceRate}%
          </Badge>
        </div>
      </Card>

      {/* Attendance Trend Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Attendance Trend</h3>
        </div>
        <AttendanceTrend employeeId={employee.id} />
      </Card>
    </div>
  );
}