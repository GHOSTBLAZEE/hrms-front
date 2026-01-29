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
  Loader2
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useLeaveActions } from "@/hooks/useLeaves";

import ApplyLeaveDialog from "./components/ApplyLeaveDialog";
import LeaveBalanceCards from "../employees/[employeeId]/components/LeaveBalanceCards";
import { useMyLeaves } from "./hooks/useMyLeaves";

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
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "Pending"
    },
    approved: {
      icon: CheckCircle2,
      variant: "default",
      className: "bg-green-50 text-green-700 border-green-200",
      label: "Approved"
    },
    rejected: {
      icon: XCircle,
      variant: "destructive",
      className: "bg-red-50 text-red-700 border-red-200",
      label: "Rejected"
    },
    cancelled: {
      icon: AlertCircle,
      variant: "outline",
      className: "bg-gray-50 text-gray-700 border-gray-200",
      label: "Cancelled"
    }
  };
  
  return configs[status] || configs.pending;
}

/* =========================================================
 | Components
 |========================================================= */

// Loading skeleton for leave cards
function LeaveCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

// Individual leave card component
function LeaveCard({ leave, onCancel, isCancelling }) {
  const statusConfig = getStatusConfig(leave.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          {/* Left Content */}
          <div className="flex-1 space-y-2">
            {/* Leave Type */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-base">
                {leave.leave_type?.name ?? "Leave Request"}
              </h3>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatDate(leave.start_date)}</span>
              <span>→</span>
              <span>{formatDate(leave.end_date)}</span>
              <span className="text-foreground font-medium">
                · {leave.days} {leave.days === 1 ? 'day' : 'days'}
              </span>
            </div>

            {/* Status & Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={statusConfig.variant}
                className={`${statusConfig.className} flex items-center gap-1`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </Badge>

              {leave.is_paid === false && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Unpaid (LOP)
                </Badge>
              )}

              {leave.half_day && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Half Day
                </Badge>
              )}
            </div>

            {/* Reason (if exists) */}
            {leave.reason && (
              <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                {leave.reason}
              </p>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex flex-col gap-2">
            {leave.status === "approved" && leave.can?.cancel && (
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onCancel(leave.id)}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state component
function EmptyState() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">No leave records</h3>
            <p className="text-sm text-muted-foreground">
              You haven't applied for any leaves yet
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

  // Handle cancel with loading state
  const handleCancel = async (leaveId) => {
    setCancellingId(leaveId);
    try {
      await cancel.mutateAsync(leaveId);
    } finally {
      setCancellingId(null);
    }
  };

  // Error state - no employee profile
  if (!employeeId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Employee Profile Not Linked</h3>
                <p className="text-sm text-muted-foreground">
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
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Leaves</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your leave requests and view balances
          </p>
        </div>

        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Apply Leave
        </Button>
      </div>

      {/* Apply Leave Dialog */}
      <ApplyLeaveDialog
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Leave Balances Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Leave Balances</h2>
        <LeaveBalanceCards />
      </section>

      {/* Leave History Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leave History</h2>
          {!isLoading && leaves.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {leaves.length} {leaves.length === 1 ? 'request' : 'requests'}
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <LeaveCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && leaves.length === 0 && <EmptyState />}

        {/* Leave Cards */}
        {!isLoading && leaves.length > 0 && (
          <div className="space-y-3">
            {leaves.map((leave) => (
              <LeaveCard
                key={leave.id}
                leave={leave}
                onCancel={handleCancel}
                isCancelling={cancellingId === leave.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}