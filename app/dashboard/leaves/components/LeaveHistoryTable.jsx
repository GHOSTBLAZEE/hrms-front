"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Clock, CheckCircle, XCircle, Filter, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatDateRange } from "@/lib/dateUtils";

const statusConfig = {
  pending: {
    color: "bg-amber-100 text-amber-700 border-amber-300",
    icon: Clock,
    label: "Pending",
  },
  approved: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: CheckCircle,
    label: "Approved",
  },
  rejected: {
    color: "bg-red-100 text-red-700 border-red-300",
    icon: XCircle,
    label: "Rejected",
  },
  cancelled: {
    color: "bg-slate-100 text-slate-700 border-slate-300",
    icon: XCircle,
    label: "Cancelled",
  },
};

export default function LeaveHistoryTable({ leaves }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  if (!leaves || leaves.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No Leave History
        </h3>
        <p className="text-sm text-muted-foreground">
          Your leave applications will appear here
        </p>
      </Card>
    );
  }

  const filteredLeaves = leaves.filter((leave) => {
    if (statusFilter !== "all" && leave.status !== statusFilter) return false;
    if (typeFilter !== "all" && leave.leave_type?.code !== typeFilter) return false;
    return true;
  });

  const leaveTypes = [...new Set(leaves.map((l) => l.leave_type?.code))].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4 bg-slate-50/50 border-slate-200">
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {leaveTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(statusFilter !== "all" || typeFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = leaves.filter(l => l.status === status).length;
          if (count === 0) return null;
          
          const Icon = config.icon;
          return (
            <Card 
              key={status}
              className="p-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatusFilter(status)}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", config.color.split(' ')[1])} />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Leave Type</TableHead>
              <TableHead className="font-semibold">Date Range</TableHead>
              <TableHead className="font-semibold">Duration</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Applied On</TableHead>
              <TableHead className="font-semibold">Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-muted-foreground">No leave records found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaves.map((leave) => {
                const config = statusConfig[leave.status] || statusConfig.pending;
                const StatusIcon = config.icon;

                return (
                  <TableRow key={leave.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {leave.leave_type?.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {leave.leave_type?.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDateRange(leave.start_date, leave.end_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {leave.days} {leave.days === 1 ? 'day' : 'days'}
                        {leave.half_day && ' (Half)'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "flex items-center gap-1 w-fit border",
                          config.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span className="capitalize">{config.label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(leave.created_at)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate" title={leave.reason}>
                        {leave.reason || '-'}
                      </p>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Hint */}
      {filteredLeaves.length > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          Showing {filteredLeaves.length} of {leaves.length} total leaves
        </p>
      )}
    </div>
  );
}