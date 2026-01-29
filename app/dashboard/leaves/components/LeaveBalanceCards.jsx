"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const leaveTypeConfig = {
  casual: {
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Calendar,
  },
  sick: {
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Calendar,
  },
  earned: {
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: TrendingUp,
  },
  comp_off: {
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: CheckCircle,
  },
};

export default function LeaveBalanceCards({ balances }) {
  if (!balances || balances.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {balances.map((balance) => {
        const config = leaveTypeConfig[balance.leave_type?.code?.toLowerCase()] || {
          color: "text-slate-600",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          icon: Calendar,
        };
        const Icon = config.icon;
        
        const total = balance.total || 0;
        const used = balance.used || 0;
        const pending = balance.pending || 0;
        const available = total - used - pending;
        const percentage = total > 0 ? ((used + pending) / total) * 100 : 0;

        return (
          <Card
            key={balance.id}
            className={cn(
              "overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200",
              config.borderColor
            )}
          >
            <div className={cn("p-4 space-y-3", config.bgColor)}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("p-2 rounded-lg bg-white/80 border", config.borderColor)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div>
                    <h3 className={cn("font-semibold text-sm", config.color)}>
                      {balance.leave_type?.name || "Leave"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
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
                  <span className="text-sm text-muted-foreground">
                    of {total} days
                  </span>
                </div>

                {/* Progress Bar */}
                <Progress 
                  value={percentage} 
                  className="h-2"
                  indicatorClassName={config.color.replace('text-', 'bg-')}
                />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-xs text-muted-foreground">
                      Used: {used}
                    </span>
                  </div>
                  {pending > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs text-muted-foreground">
                        Pending: {pending}
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