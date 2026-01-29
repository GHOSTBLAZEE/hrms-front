"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  User,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const statusConfig = {
  pending: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    description: "Your request is awaiting approval",
  },
  approved: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    description: "Your request has been approved",
  },
  rejected: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    description: "Your request has been rejected",
  },
};

export default function CorrectionDetailDrawer({ open, onClose, correction }) {
  if (!correction) return null;

  const StatusIcon = statusConfig[correction.status]?.icon || AlertCircle;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <SheetTitle className="text-xl">Request Details</SheetTitle>
            <Badge
              className={cn(
                "flex items-center gap-1",
                statusConfig[correction.status]?.color
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {correction.status}
            </Badge>
          </div>
          <SheetDescription>
            {statusConfig[correction.status]?.description}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Alert */}
          {correction.status === "pending" && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your request is currently under review. You'll be notified once it's processed.
              </AlertDescription>
            </Alert>
          )}

          {correction.status === "approved" && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700">
                Your attendance record has been updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {correction.status === "rejected" && correction.rejection_reason && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Rejection Reason:</strong> {correction.rejection_reason}
              </AlertDescription>
            </Alert>
          )}

          {/* Request Timeline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <TrendingUp className="h-4 w-4" />
              Request Timeline
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-slate-200">
              <div className="pb-2">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium">
                  {new Date(correction.created_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              
              {correction.actioned_at && (
                <div className="pb-2">
                  <p className="text-xs text-muted-foreground">
                    {correction.status === "approved" ? "Approved" : "Rejected"}
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(correction.actioned_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {correction.actioned_by?.name && (
                    <p className="text-xs text-muted-foreground">
                      by {correction.actioned_by.name}
                    </p>
                  )}
                </div>
              )}

              {correction.current_step && correction.status === "pending" && (
                <div className="pb-2">
                  <p className="text-xs text-amber-600">Pending at</p>
                  <p className="text-sm font-medium text-amber-700">
                    {correction.current_step}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Correction Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Calendar className="h-4 w-4" />
              Correction Details
            </div>
            
            <div className="space-y-4">
              {/* Date */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
                  Attendance Date
                </p>
                <p className="font-semibold text-blue-900">
                  {new Date(correction.attendance_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Requested Times */}
              <div className="grid grid-cols-2 gap-3">
                {correction.requested_check_in && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                      Check In
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <p className="font-semibold text-emerald-900">
                        {correction.requested_check_in}
                      </p>
                    </div>
                  </div>
                )}
                
                {correction.requested_check_out && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-600 uppercase tracking-wide mb-1">
                      Check Out
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <p className="font-semibold text-orange-900">
                        {correction.requested_check_out}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Requested Status */}
              {correction.requested_status && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">
                    Requested Status
                  </p>
                  <p className="font-semibold text-purple-900 capitalize">
                    {correction.requested_status.replace(/_/g, " ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="h-4 w-4" />
              Your Reason
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed">
                {correction.reason}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}