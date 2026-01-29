"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { 
  Calendar, 
  Plus, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  FileText,
  Filter,
  Search
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useLeaveActions } from "@/hooks/useLeaves";
import ApplyLeaveDialog from "./components/ApplyLeaveDialog";
import LeaveBalanceCards from "../employees/[employeeId]/components/LeaveBalanceCards";
import { useMyLeaves } from "./hooks/useMyLeaves";
import { Input } from "@/components/ui/input";

/* =========================================================
 | Utils
 |========================================================= */
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM yyyy");
}

function getStatusConfig(status) {
  const configs = {
    pending: {
      icon: Clock,
      variant: "secondary",
      className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
      label: "Pending",
      dotColor: "bg-amber-500"
    },
    approved: {
      icon: CheckCircle2,
      variant: "default",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
      label: "Approved",
      dotColor: "bg-emerald-500"
    },
    rejected: {
      icon: XCircle,
      variant: "destructive",
      className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
      label: "Rejected",
      dotColor: "bg-rose-500"
    },
    cancelled: {
      icon: AlertCircle,
      variant: "outline",
      className: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
      label: "Cancelled",
      dotColor: "bg-slate-500"
    }
  };
  
  return configs[status] || configs.pending;
}

/* =========================================================
 | Components
 |========================================================= */

function LeaveCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveCard({ leave, onCancel, isCancelling }) {
  const statusConfig = getStatusConfig(leave.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-l-4" 
          style={{ borderLeftColor: `var(--${leave.status === 'approved' ? 'emerald' : leave.status === 'rejected' ? 'rose' : leave.status === 'cancelled' ? 'slate' : 'amber'}-500)` }}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-6">
          {/* Left Content */}
          <div className="flex-1 space-y-4">
            {/* Header with Icon */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusConfig.dotColor} ring-2 ring-white dark:ring-slate-950`} />
              </div>

              {/* Title & Type */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {leave.leave_type?.name ?? "Leave Request"}
                </h3>
                
                {/* Date Range */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{formatDate(leave.start_date)}</span>
                  <span className="text-xs">→</span>
                  <span className="font-medium">{formatDate(leave.end_date)}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {leave.days} {leave.days === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={statusConfig.variant}
                className={`${statusConfig.className} flex items-center gap-1.5 px-3 py-1`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span className="font-medium">{statusConfig.label}</span>
              </Badge>

              {leave.is_paid === false && (
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 px-3 py-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Unpaid (LOP)
                </Badge>
              )}

              {leave.half_day && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 px-3 py-1">
                  Half Day
                </Badge>
              )}
            </div>

            {/* Reason */}
            {leave.reason && (
              <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {leave.reason}
                </p>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex flex-col gap-2">
            {leave.status === "approved" && leave.can?.cancel && (
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onCancel(leave.id)}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="p-16 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Leave Records</h3>
            <p className="text-muted-foreground">
              You haven't applied for any leaves yet. Click the button above to get started.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
 | Main Component
 |========================================================= */
export default function LeavesPage() {
  const { user } = useAuth();
  const employeeId = user?.id;

  const { data: leaves = [], isLoading } = useMyLeaves();
  const { cancel } = useLeaveActions();
  const [open, setOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.leave_type?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leave.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancel = async (leaveId) => {
    setCancellingId(leaveId);
    try {
      await cancel.mutateAsync(leaveId);
    } finally {
      setCancellingId(null);
    }
  };

  if (!employeeId) {
    return (
      <div className="p-6">
        <Card className="border-destructive/50">
          <CardContent className="p-16 text-center">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Employee Profile Not Linked</h3>
                <p className="text-muted-foreground">
                  Please contact your administrator to link your employee profile
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              My Leaves
            </h1>
            <p className="text-muted-foreground">
              Manage your leave requests and view balances
            </p>
          </div>

          <Button onClick={() => setOpen(true)} size="lg" className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Apply Leave
          </Button>
        </div>
      </div>

      <ApplyLeaveDialog open={open} onClose={() => setOpen(false)} />

      {/* Leave Balances */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-xl font-semibold">Leave Balances</h2>
        </div>
        <LeaveBalanceCards />
      </section>

      {/* Leave History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-semibold">Leave History</h2>
          </div>
          {!isLoading && leaves.length > 0 && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredLeaves.length} of {leaves.length}
            </Badge>
          )}
        </div>

        {/* Filters */}
        {!isLoading && leaves.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leaves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <LeaveCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && leaves.length === 0 && <EmptyState />}

        {/* No Results */}
        {!isLoading && leaves.length > 0 && filteredLeaves.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No leaves match your filters</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Leave Cards */}
        {!isLoading && filteredLeaves.length > 0 && (
          <div className="space-y-4">
            {filteredLeaves.map((leave, index) => (
              <div 
                key={leave.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <LeaveCard
                  leave={leave}
                  onCancel={handleCancel}
                  isCancelling={cancellingId === leave.id}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}