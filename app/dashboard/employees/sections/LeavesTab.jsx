"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default function LeavesTab({ employeeId }) {
  // Fetch leave balances
  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ["employee-leave-balances", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/leave-balances`);
      return res.data.data || [];
    },
  });

  // Fetch leave applications
  const { data: leaves, isLoading: leavesLoading } = useQuery({
    queryKey: ["employee-leaves", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/leaves`);
      return res.data.data || [];
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Leave Balances */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-blue-600" />
          Leave Balances
        </h3>

        {balancesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : !balances || balances.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leave balances available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {balances.map((balance) => (
              <Card key={balance.id} className="p-4 border-l-4 border-l-blue-500">
                <p className="text-sm text-muted-foreground mb-2">
                  {balance.leave_type?.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {balance.available}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    / {balance.total} days
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Used: {balance.used} | Pending: {balance.pending || 0}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Leave History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Leave History</h3>

        {leavesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : !leaves || leaves.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No leave applications</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>From Date</TableHead>
                <TableHead>To Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">
                    {leave.leave_type?.name}
                  </TableCell>
                  <TableCell>
                    {new Date(leave.from_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(leave.to_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{leave.total_days}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {leave.reason || "—"}
                  </TableCell>
                  <TableCell>{getStatusBadge(leave.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}