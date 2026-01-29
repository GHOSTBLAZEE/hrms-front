"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import TodayPunchCard from "./TodaySummaryCard";
import PunchTimeline from "./PunchTimeline";
import RequestCorrectionDialog from "./RequestCorrectionDialog";
import ShiftHintBar from "./ShiftHintBar";
import { toast } from "sonner";
import { AlertCircle, Calendar, Clock, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AttendancePage() {
  const qc = useQueryClient();
  const [punching, setPunching] = useState(false);
  const [openCorrection, setOpenCorrection] = useState(false);

  /* ---------------------------
   | Load today's attendance
   |----------------------------*/
  const { data: attendance, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/attendance/today");
      console.log("📊 Attendance data fetched:", res.data);
      console.log("🔍 has_pending_correction:", res.data?.has_pending_correction);
      console.log("🔍 is_locked:", res.data?.is_locked);
      console.log("🔍 status:", res.data?.status);
      console.log("🔍 logs count:", res.data?.logs?.length);
      return res.data;
    },
    refetchInterval: 30000, // Reduced to 30 seconds for faster updates
    staleTime: 10000, // Consider data stale after 10s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Debug: Log attendance changes
  useEffect(() => {
    if (attendance) {
      console.log("🔄 Attendance state updated:", {
        id: attendance.id,
        status: attendance.status,
        has_pending_correction: attendance.has_pending_correction,
        is_locked: attendance.is_locked,
        logs_count: attendance.logs?.length,
      });
    }
  }, [attendance]);

  const user = qc.getQueryData(["me"]);

  const canRequestCorrection =
    !attendance?.is_locked &&
    !attendance?.has_pending_correction &&
    user?.permissions?.includes("request attendance correction");

  /* ---------------------------
   | Manual Refresh Handler
   |----------------------------*/
  const handleManualRefresh = async () => {
    console.log("🔄 Manual refresh triggered");
    const result = await refetch();
    if (result.isSuccess) {
      toast.success("Data refreshed", {
        description: "Attendance data updated successfully",
      });
    }
  };

  /* ---------------------------
   | Punch mutation (RAW event)
   |----------------------------*/
  const punchMutation = useMutation({
    mutationFn: async (type) => {
      return apiClient.post("/api/v1/attendance/punch", {
        type, // "IN" | "OUT"
        source: "web",
        timestamp: new Date().toISOString(),
      });
    },
    onMutate: () => {
      setPunching(true);
    },
    onSuccess: (data, type) => {
      console.log("✅ Punch successful, invalidating queries");
      qc.invalidateQueries(["attendance-today"]);
      toast.success(
        type === "IN" ? "Punched in successfully" : "Punched out successfully",
        {
          description: `Recorded at ${new Date().toLocaleTimeString()}`,
        }
      );
    },
    onError: (error, type) => {
      const message = error?.response?.data?.message || "Failed to record punch";
      console.error("❌ Punch error:", error);
      toast.error(`Punch ${type.toLowerCase()} failed`, {
        description: message,
      });
    },
    onSettled: () => {
      setPunching(false);
    },
  });

  const correctionMutation = useMutation({
    mutationFn: async (payload) => {
      console.log("📤 Submitting correction payload:", payload);
      
      return apiClient.post("/api/v1/attendance-corrections", payload);
    },

    onSuccess: (response) => {
      console.log("✅ Correction submitted successfully:", response.data);
      qc.invalidateQueries(["attendance-today"]);
      setOpenCorrection(false);
      toast.success("Correction request submitted", {
        description: "Your manager will review the request",
      });
      
      // Force immediate refetch
      setTimeout(() => {
        console.log("🔄 Forcing immediate refetch after correction");
        refetch();
      }, 500);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || 
        error?.message ||
        "Failed to submit correction request";
      
      console.error("❌ Correction submission error:", error);
      console.error("❌ Error response:", error?.response?.data);
      
      toast.error("Correction request failed", {
        description: message,
      });
    },
  });

  const handlePunch = (type) => {
    // Prevent double-clicking
    if (punching) return;
    
    punchMutation.mutate(type);
  };

  const handleCorrection = (payload) => {
    console.log("📝 handleCorrection received payload:", payload);
    
    correctionMutation.mutate(payload);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load attendance data. {error?.message || "Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No attendance data warning
  if (!attendance) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No attendance data available for today.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Current date display
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            {/* Manual Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Attendance
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Column - Primary Actions */}
          <div className="lg:col-span-2 space-y-6">
            <TodayPunchCard
              attendance={attendance}
              onPunch={handlePunch}
              loading={punching}
              onRequestCorrection={() => setOpenCorrection(true)}
              canRequestCorrection={canRequestCorrection}
            />

            <ShiftHintBar
              shift={attendance?.shift}
              lastPunch={attendance?.logs?.at(-1)}
            />
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-3">
            <PunchTimeline punches={attendance?.logs ?? []} />
          </div>
        </div>

        {/* Correction Dialog - Pass full attendance object */}
        <RequestCorrectionDialog
          open={openCorrection}
          onClose={() => setOpenCorrection(false)}
          attendance={attendance}
          onSubmit={handleCorrection}
          isSubmitting={correctionMutation.isPending}
        />
      </div>
    </div>
  );
}