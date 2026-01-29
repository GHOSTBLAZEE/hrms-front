"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import LeaveCalendar from "./components/LeaveCalendar";
import LeaveBalanceCards from "./components/LeaveBalanceCards";
import LeaveHistoryTable from "./components/LeaveHistoryTable";
import ApplyLeaveDialog from "./components/ApplyLeaveDialog";
import TeamLeaveCalendar from "./components/TeamLeaveCalendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  AlertCircle, 
  Users,
  History,
  TrendingUp 
} from "lucide-react";

export default function LeavesPage() {
  const qc = useQueryClient();
  const user = qc.getQueryData(["me"]);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const isManager = user?.permissions?.includes("view team leaves");

  // Fetch leave balances
  const { data: balances = [], isLoading: balancesLoading } = useQuery({
    queryKey: ["leave-balances"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leaves/balances");
      return res.data.data || [];
    },
  });

  // Fetch leave history
  const { data: leaves = [], isLoading: leavesLoading } = useQuery({
    queryKey: ["my-leaves"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leaves/mine");
      return res.data.data || [];
    },
  });

  //leave types fetch
  const { data: leaveTypes = [], isLoading: leaveTypesLoading } = useQuery({
    queryKey: ["leave-types"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leave-types");
      return res.data.data || [];
    },
  });

  // Fetch team leaves (if manager)
  const { data: teamLeaves = [], isLoading: teamLeavesLoading } = useQuery({
    queryKey: ["team-leaves"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/leaves/team");
      return res.data.data || [];
    },
    enabled: isManager,
  });

  const handleApplyLeave = (date = null) => {
    setSelectedDate(date);
    setApplyDialogOpen(true);
  };

  if (balancesLoading && leavesLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-slate-600" />
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Leave Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your time off and view team availability
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => handleApplyLeave()}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Apply Leave
          </Button>
        </div>

        {/* Leave Balance Cards */}
        <LeaveBalanceCards balances={balances} />

        {/* Main Content - Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              My Calendar
            </TabsTrigger>
            {isManager && (
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                Team Calendar
              </TabsTrigger>
            )}
            <TabsTrigger value="history" className="gap-2">
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

          {/* Team Calendar Tab */}
          {isManager && (
            <TabsContent value="team" className="space-y-4">
              <TeamLeaveCalendar 
                teamLeaves={teamLeaves}
                isLoading={teamLeavesLoading}
              />
            </TabsContent>
          )}

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