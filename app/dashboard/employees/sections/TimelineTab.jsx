"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  UserPlus,
  DollarSign,
  AlertTriangle,
  Award,
  Calendar,
} from "lucide-react";

export default function TimelineTab({ employeeId }) {
  const { data: timeline, isLoading } = useQuery({
    queryKey: ["employee-timeline", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/timeline`);
      return res.data.data || [];
    },
  });

  const getEventIcon = (type) => {
    const icons = {
      promotion: TrendingUp,
      transfer: UserPlus,
      salary_revision: DollarSign,
      warning: AlertTriangle,
      award: Award,
      other: Calendar,
    };
    return icons[type] || icons.other;
  };

  const getEventColor = (type) => {
    const colors = {
      promotion: "border-l-emerald-500",
      transfer: "border-l-blue-500",
      salary_revision: "border-l-purple-500",
      warning: "border-l-red-500",
      award: "border-l-amber-500",
      other: "border-l-slate-500",
    };
    return colors[type] || colors.other;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-blue-600" />
        Career Timeline
      </h3>

      {!timeline || timeline.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No timeline events</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-6">
            {timeline.map((event, index) => {
              const Icon = getEventIcon(event.event_type);
              return (
                <div key={index} className="relative pl-16">
                  <div className="absolute left-3.5 top-2 h-5 w-5 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                    <Icon className="h-3 w-3 text-blue-600" />
                  </div>
                  <Card className={`p-5 border-l-4 ${getEventColor(event.event_type)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(event.event_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="capitalize"
                      >
                        {event.event_type.replace("_", " ")}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-slate-600 mt-3">{event.description}</p>
                    )}
                    {event.details && (
                      <div className="mt-3 p-3 bg-slate-50 rounded text-sm space-y-1">
                        {Object.entries(event.details).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {key.replace("_", " ")}:
                            </span>
                            <span className="text-slate-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}