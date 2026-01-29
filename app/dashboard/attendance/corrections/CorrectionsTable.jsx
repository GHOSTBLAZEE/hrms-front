"use client";

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
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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

export default function CorrectionsTable({ data, onSelect }) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead>Request Date</TableHead>
            <TableHead>Attendance Date</TableHead>
            <TableHead>Requested Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Step</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((correction) => {
            const StatusIcon = statusConfig[correction.status]?.icon || AlertCircle;
            
            return (
              <TableRow
                key={correction.id}
                className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                onClick={() => onSelect(correction)}
              >
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(correction.created_at).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm font-medium">
                    {new Date(correction.attendance_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    {correction.requested_check_in && (
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">In:</span>
                        <span className="font-medium">{correction.requested_check_in}</span>
                      </div>
                    )}
                    {correction.requested_check_out && (
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Out:</span>
                        <span className="font-medium">{correction.requested_check_out}</span>
                      </div>
                    )}
                    {correction.requested_status && (
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium capitalize">
                          {correction.requested_status.replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge
                    className={cn(
                      "flex items-center gap-1 w-fit",
                      statusConfig[correction.status]?.color
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {correction.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {correction.current_step || "-"}
                  </span>
                </TableCell>
                
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(correction);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}