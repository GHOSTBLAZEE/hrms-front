"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, Clock, MapPin, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PunchTimeline({ punches = [] }) {
  if (!punches || punches.length === 0) {
    return (
      <Card className="border-slate-200 shadow-lg shadow-slate-200/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-600" />
            Punch Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-slate-100 mb-4">
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              No punches recorded today
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Punch in to start tracking your attendance
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case "mobile":
      case "app":
        return <Smartphone className="h-3.5 w-3.5" />;
      case "web":
        return <Monitor className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  return (
    <Card className="border-slate-200 shadow-lg shadow-slate-200/50">
      <CardHeader className="bg-gradient-to-br from-white to-slate-50/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-600" />
          Punch Timeline
          <Badge variant="secondary" className="ml-auto">
            {punches.length} {punches.length === 1 ? "punch" : "punches"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" />

          {/* Timeline items */}
          <div className="space-y-6">
            {punches.map((punch, index) => {
              const isIn = punch.type === "IN";
              const time = new Date(punch.punch_time);
              const isLatest = index === punches.length - 1;

              return (
                <div
                  key={punch.id || index}
                  className={cn(
                    "relative flex gap-4 group",
                    isLatest && "animate-in fade-in slide-in-from-bottom-4 duration-500"
                  )}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                        isIn
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200 group-hover:shadow-emerald-300"
                          : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200 group-hover:shadow-blue-300"
                      )}
                    >
                      {isIn ? (
                        <LogIn className="h-5 w-5 text-white" />
                      ) : (
                        <LogOut className="h-5 w-5 text-white" />
                      )}
                    </div>
                    {isLatest && (
                      <div className="absolute inset-0 rounded-full animate-ping">
                        <div
                          className={cn(
                            "w-full h-full rounded-full",
                            isIn ? "bg-emerald-400" : "bg-blue-400"
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-300",
                        "bg-white hover:bg-slate-50",
                        isIn
                          ? "border-emerald-200 hover:border-emerald-300"
                          : "border-blue-200 hover:border-blue-300"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={isIn ? "success" : "default"}
                              className={cn(
                                "font-semibold",
                                isIn
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              )}
                            >
                              {isIn ? "Punch In" : "Punch Out"}
                            </Badge>
                            {isLatest && (
                              <Badge
                                variant="outline"
                                className="text-xs border-amber-300 bg-amber-50 text-amber-700"
                              >
                                Latest
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-slate-900">
                            {time.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {time.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {punch.source && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md">
                            {getSourceIcon(punch.source)}
                            <span className="font-medium capitalize">
                              {punch.source}
                            </span>
                          </div>
                        )}
                        {punch.location && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="font-medium">{punch.location}</span>
                          </div>
                        )}
                        {punch.ip_address && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md font-mono">
                            {punch.ip_address}
                          </div>
                        )}
                      </div>

                      {/* Notes or remarks */}
                      {punch.notes && (
                        <div className="mt-3 p-2.5 bg-slate-50 rounded-md border border-slate-200">
                          <p className="text-xs text-slate-600 italic">
                            {punch.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary footer */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total punches today</span>
            <span className="font-semibold text-slate-900">{punches.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}