"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import LeaveCalendar from "./components/LeaveCalendar";
import LeaveBalanceCards from "./components/LeaveBalanceCards";
import LeaveHistoryTable from "./components/LeaveHistoryTable";
import ApplyLeaveDialog from "./components/ApplyLeaveDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  AlertCircle,
  History,
  RefreshCw,
  CalendarDays
} from "lucide-react";
import Link from "next/link";

export default function LeavesPage() {
  const qc = useQueryClient();
  const user = qc.getQueryData(["me"]);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const isManager = user?.permissions?.includes("view team leaves");

  // ✅ Fetch leave balances
  const { 
    data: balancesData, 
    isLoading: balancesLoading,
    error: balancesError,
    refetch: refetchBalances 
  } = useQuery({
    queryKey: ["leave-balances"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leaves/balances");
      return res.data.data || [];
    },
  });

  // ✅ Fetch leave history
  const { 
    data: leavesData, 
    isLoading: leavesLoading,
    error: leavesError,
    refetch: refetchLeaves 
  } = useQuery({
    queryKey: ["my-leaves"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leaves/mine");
      return res.data.data || [];
    },
  });

  // ✅ Fetch leave types
  const { 
    data: leaveTypesData, 
    isLoading: leaveTypesLoading 
  } = useQuery({
    queryKey: ["leave-types"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leave-types");
      return res.data.data || [];
    },
  });

  // Extract data
  const balances = balancesData || [];
  const leaves = leavesData || [];
  const leaveTypes = leaveTypesData || [];

  const handleApplyLeave = (date = null) => {
    setSelectedDate(date);
    setApplyDialogOpen(true);
  };

  const handleRefresh = () => {
    refetchBalances();
    refetchLeaves();
  };

  // Loading state
  if (balancesLoading && leavesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  // Error state
  const hasError = balancesError || leavesError;
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="p-6 max-w-7xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load leave data. Please try again.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={handleRefresh}
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
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  My Leaves
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your time off and track leave balance
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isManager && (
              <Link href="/dashboard/leaves/team">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  Team Calendar
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              size="lg"
              onClick={() => handleApplyLeave()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg gap-2"
            >
              <Plus className="h-5 w-5" />
              Apply Leave
            </Button>
          </div>
        </div>

        {/* Leave Balance Cards */}
        <LeaveBalanceCards balances={balances} />

        {/* Main Content - Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12 p-1 bg-slate-100">
            <TabsTrigger 
              value="calendar" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CalendarIcon className="h-4 w-4" />
              My Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* My Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <LeaveCalendar 
              leaves={leaves} 
              onApplyLeave={handleApplyLeave}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <LeaveHistoryTable leaves={leaves} />
          </TabsContent>
        </Tabs>

        {/* Apply Leave Dialog */}
        <ApplyLeaveDialog
          open={applyDialogOpen}
          onClose={() => {
            setApplyDialogOpen(false);
            setSelectedDate(null);
          }}
          balances={balances}
          leaveTypes={leaveTypes}
          preselectedDate={selectedDate}
        />
      </div>
    </div>
  );
}