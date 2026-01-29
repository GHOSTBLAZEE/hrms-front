"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar } from "lucide-react";

export default function TeamLeaveCalendar({ teamLeaves, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);

  // Filter upcoming leaves
  const upcomingLeaves = teamLeaves.filter((leave) => {
    const startDate = new Date(leave.start_date);
    return startDate >= today && startDate <= next7Days && leave.status === "approved";
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6" />
          <div>
            <h3 className="text-xl font-bold">Team Availability</h3>
            <p className="text-sm text-blue-100">
              Upcoming leaves for the next 7 days
            </p>
          </div>
        </div>
      </Card>

      {/* Upcoming Leaves */}
      {upcomingLeaves.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No upcoming leaves
          </h3>
          <p className="text-sm text-muted-foreground">
            Your team is fully available for the next week
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {upcomingLeaves.map((leave) => (
            <Card key={leave.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {leave.employee?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900">
                      {leave.employee?.name}
                    </h4>
                    <Badge variant="outline">{leave.employee?.code}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {new Date(leave.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(leave.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{leave.days} day(s)</span>
                    <span>•</span>
                    <Badge variant="secondary">{leave.leave_type?.name}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}