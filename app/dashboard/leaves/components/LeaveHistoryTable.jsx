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
import { Eye, Clock, CheckCircle, XCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  approved: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

export default function LeaveHistoryTable({ leaves }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLeaves = leaves.filter((leave) => {
    if (statusFilter !== "all" && leave.status !== statusFilter) return false;
    if (typeFilter !== "all" && leave.leave_type?.code !== typeFilter) return false;
    return true;
  });

  const leaveTypes = [...new Set(leaves.map((l) => l.leave_type?.code))].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 grid grid-cols-2 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
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
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Leave Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No leave records found
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaves.map((leave) => {
                const StatusIcon = statusConfig[leave.status]?.icon || Clock;

                return (
                  <TableRow key={leave.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{leave.leave_type?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {leave.leave_type?.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(leave.start_date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.end_date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{leave.days} day(s)</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "flex items-center gap-1 w-fit",
                          statusConfig[leave.status]?.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(leave.created_at).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}