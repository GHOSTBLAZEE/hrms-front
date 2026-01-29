"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "@/lib/apiClient";
import CorrectionsTable from "./CorrectionsTable";
import CorrectionDetailDrawer from "./CorrectionDetailDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, History, CheckCircle, XCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function MyCorrectionsPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch user's OWN correction requests
  const { data: corrections = [], isLoading, isError, error } = useQuery({
    queryKey: ["my-attendance-corrections"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/attendance-corrections/mine");
      return res.data.data || [];
    },
    staleTime: 30000,
  });

  // Filter by status
  const filteredCorrections = corrections.filter(c => 
    statusFilter === "all" || c.status === statusFilter
  );

  // Count by status
  const pendingCount = corrections.filter(c => c.status === "pending").length;
  const approvedCount = corrections.filter(c => c.status === "approved").length;
  const rejectedCount = corrections.filter(c => c.status === "rejected").length;

  // Loading State
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load your correction requests. {error?.message || "Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="h-8 w-8 text-slate-600" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              My Correction Requests
            </h1>
          </div>
          <p className="text-muted-foreground">
            View the status of your attendance correction requests
          </p>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
                <p className="text-2xl font-bold text-slate-900">{corrections.length}</p>
              </div>
              <History className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600 uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-300" />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 uppercase tracking-wide">Approved</p>
                <p className="text-2xl font-bold text-emerald-700">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-300" />
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 uppercase tracking-wide">Rejected</p>
                <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-300" />
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="all">
              All
              {corrections.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {corrections.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="space-y-4">
            {filteredCorrections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-slate-200">
                <History className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No {statusFilter !== "all" ? statusFilter : ""} requests
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {statusFilter === "all" 
                    ? "You haven't submitted any correction requests yet."
                    : `You don't have any ${statusFilter} correction requests.`
                  }
                </p>
              </div>
            ) : (
              <CorrectionsTable
                data={filteredCorrections}
                onSelect={setSelected}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Detail Drawer */}
        <CorrectionDetailDrawer
          open={!!selected}
          onClose={() => setSelected(null)}
          correction={selected}
        />
      </div>
    </div>
  );
}