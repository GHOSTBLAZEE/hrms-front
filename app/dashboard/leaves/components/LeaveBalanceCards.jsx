"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const leaveTypeConfig = {
  cl: {
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    progressColor: "bg-blue-600",
    icon: Calendar,
  },
  sl: {
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    progressColor: "bg-red-600",
    icon: AlertCircle,
  },
  el: {
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    progressColor: "bg-emerald-600",
    icon: TrendingUp,
  },
  comp: {
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    progressColor: "bg-purple-600",
    icon: CheckCircle,
  },
};

export default function LeaveBalanceCards({ balances }) {
  if (!balances || balances.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No Leave Balances Found
        </h3>
        <p className="text-sm text-muted-foreground">
          Contact HR to set up your leave balances
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {balances.map((balance) => {
        // Get leave type code in lowercase for config lookup
        const typeCode = balance.leave_type?.code?.toLowerCase() || 'default';
        const config = leaveTypeConfig[typeCode] || {
          color: "text-slate-600",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          progressColor: "bg-slate-600",
          icon: Calendar,
        };
        const Icon = config.icon;
        
        // ✅ FIXED: Use backend's field names
        const total = balance.total || 0;        // Backend sends this
        const used = balance.used || 0;
        const pending = balance.pending || 0;
        const available = balance.available || 0; // Backend calculates this
        
        // Calculate percentage for progress bar
        const percentage = total > 0 ? ((used + pending) / total) * 100 : 0;

        return (
          <Card
            key={balance.id}
            className={cn(
              "overflow-hidden border-2 shadow-sm hover:shadow-md transition-all duration-200",
              config.borderColor
            )}
          >
            <div className={cn("p-4 space-y-3", config.bgColor)}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("p-2 rounded-lg bg-white/80 border-2", config.borderColor)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div>
                    <h3 className={cn("font-semibold text-sm", config.color)}>
                      {balance.leave_type?.name || "Leave"}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {balance.leave_type?.code || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Balance Display */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-slate-900">
                    {available.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    of {total.toFixed(1)} days
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <Progress 
                    value={percentage} 
                    className="h-2 bg-slate-200"
                  >
                    <div 
                      className={cn("h-full transition-all rounded-full", config.progressColor)}
                      style={{ width: `${percentage}%` }}
                    />
                  </Progress>
                  <p className="text-[10px] text-muted-foreground text-right font-medium">
                    {(100 - percentage).toFixed(0)}% available
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-xs text-muted-foreground font-medium">
                      Used: {used.toFixed(1)}
                    </span>
                  </div>
                  {pending > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs text-amber-600 font-semibold">
                        Pending: {pending.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}