"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  LogIn,
  LogOut,
  Lock,
  AlertCircle,
  CheckCircle2,
  Timer,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TodayPunchCard({
  attendance,
  onPunch,
  loading,
  onRequestCorrection,
  canRequestCorrection,
}) {
 
  const punches = attendance?.logs ?? [];
  const lastPunch = punches[punches.length - 1];

  const nextAction = !lastPunch || lastPunch.type === "OUT" ? "IN" : "OUT";

  // Ensure boolean conversion to prevent "0" from rendering
  const isLocked = Boolean(attendance?.is_locked);
  const hasPendingCorrection = Boolean(attendance?.has_pending_correction);

  // Calculate work duration if punched in
  const getWorkDuration = () => {
    if (!lastPunch || lastPunch.type === "OUT") return null;
    
    const start = new Date(lastPunch.punch_time);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    
    return { hours, minutes, total: diff };
  };

  const workDuration = getWorkDuration();

  // Status configuration
  const statusConfig = {
    present: {
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      icon: CheckCircle2,
      variant: "success",
    },
    absent: {
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: AlertCircle,
      variant: "destructive",
    },
    half_day: {
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      icon: Timer,
      variant: "warning",
    },
    late: {
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      icon: Timer,
      variant: "warning",
    },
    not_marked: {
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      icon: Clock,
      variant: "secondary",
    },
  };

  // Normalize status to lowercase for consistent matching
  const rawStatus = attendance?.status;
  const normalizedStatus = rawStatus?.toLowerCase()?.replace(/\s+/g, '_') || 'not_marked';
  const config = statusConfig[normalizedStatus] || statusConfig.not_marked;
  const StatusIcon = config.icon;

  // Display status with proper formatting
  const displayStatus = rawStatus || "Not Marked";

  console.log("🎴 Status - raw:", rawStatus, "normalized:", normalizedStatus, "display:", displayStatus);

  return (
    <Card className="overflow-hidden border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-br from-white to-slate-50/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-600" />
          Today's Status
        </CardTitle>
        {isLocked && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Locked
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Status Display */}
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border",
            config.bgColor,
            "border-slate-200"
          )}
        >
          <div
            className={cn(
              "p-2 rounded-full",
              config.color === "text-emerald-600" && "bg-emerald-100",
              config.color === "text-red-600" && "bg-red-100",
              config.color === "text-amber-600" && "bg-amber-100",
              config.color === "text-orange-600" && "bg-orange-100",
              config.color === "text-slate-600" && "bg-slate-100"
            )}
          >
            <StatusIcon
              className={cn("h-5 w-5", config.color)}
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </p>
            <p className={cn("text-lg font-bold", config.color)}>
              {displayStatus}
            </p>
          </div>
        </div>

        {/* Work Duration - Show if currently punched in */}
        {workDuration && (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50">
            <div className="p-2 rounded-full bg-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Active Duration
              </p>
              <p className="text-lg font-bold text-blue-600">
                {workDuration.hours}h {workDuration.minutes}m
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className={cn(
              "w-full h-14 text-base font-semibold shadow-lg transition-all duration-200",
              nextAction === "IN"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-200"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-200"
            )}
            disabled={loading || isLocked}
            onClick={() => onPunch(nextAction)}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {nextAction === "IN" ? (
                  <LogIn className="h-5 w-5" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
                {nextAction === "IN" ? "Punch In" : "Punch Out"}
              </div>
            )}
          </Button>

          {canRequestCorrection && !isLocked && (
            <Button
              variant="outline"
              className="w-full border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              onClick={onRequestCorrection}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Request Correction
            </Button>
          )}

          {hasPendingCorrection && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span className="text-sm font-medium text-amber-700">
                Correction pending approval
              </span>
            </div>
          )}
        </div>

        {/* Last Punch Info */}
        {lastPunch && (
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-muted-foreground">
              Last punch:{" "}
              <span className="font-semibold text-slate-700">
                {lastPunch.type === "IN" ? "In" : "Out"}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-slate-700">
                {new Date(lastPunch.punch_time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}