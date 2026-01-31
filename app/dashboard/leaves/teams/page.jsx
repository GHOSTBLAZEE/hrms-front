"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import TeamLeaveCalendar from "../components/TeamLeaveCalendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  AlertCircle,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function TeamCalendarPage() {
  // Fetch team leaves
  const { 
    data: teamLeavesData, 
    isLoading: teamLeavesLoading,
    error: teamLeavesError,
    refetch 
  } = useQuery({
    queryKey: ["team-leaves"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leaves/team");
      return res.data.data || [];
    },
  });

  const teamLeaves = teamLeavesData || [];

  // Loading state
  if (teamLeavesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  // Error state
  if (teamLeavesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="p-6 max-w-7xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load team leaves data. Please try again.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/leaves">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Team Calendar
                </h1>
                <p className="text-sm text-muted-foreground">
                  View team availability and upcoming leaves
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Team Calendar Component */}
        <TeamLeaveCalendar 
          teamLeaves={teamLeaves}
          isLoading={teamLeavesLoading}
        />
      </div>
    </div>
  );
}