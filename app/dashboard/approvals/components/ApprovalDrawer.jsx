"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText,
  ArrowRight,
  AlertCircle
} from "lucide-react";

import ApprovalStepper from "./ApprovalStepper";
import ApprovalHistoryTimeline from "./ApprovalHistoryTimeline";
import ApprovalStatusChip from "./ApprovalStatusChip";

/* =========================================================
 | Approval Drawer
 |========================================================= */

export default function ApprovalDrawer({
  open,
  onClose,
  approval,
  onApprove,
  onReject,
  loading = false,
}) {
  if (!approval) return null;

  const {
    approvable: entity,
    approvable_type_key,
    status,
    can_act,
    steps = [],
  } = approval;

  const canAct = status === "pending" && can_act;

  /* -----------------------------
   | Type guards
   |----------------------------- */
  const isLeave = approvable_type_key === "leave";
  const isAttendance = approvable_type_key === "attendance";
  const isUnlock = approvable_type_key === "attendance_unlock";

  /* -----------------------------
   | Utils
   |----------------------------- */
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const fmtTime = (t) => {
    if (!t) return "—";
    const date = t.includes('T') ? new Date(t) : new Date(`2000-01-01T${t}`);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* -----------------------------
   | Render
   |----------------------------- */
  return (
    <Sheet open={open} onOpenChange={(v) => !loading && onClose(v)}>
      <SheetContent className="w-full sm:w-[540px] flex flex-col p-0">
        {/* ======================
           Fixed Header
        ======================= */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-xl">
                {isLeave && "Leave Request"}
                {isAttendance && "Attendance Correction"}
                {isUnlock && "Attendance Unlock Request"}
                {!isLeave && !isAttendance && !isUnlock && "Approval Request"}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                Review and take action on this request
              </p>
            </div>
            <ApprovalStatusChip status={status} />
          </div>
        </SheetHeader>

        {/* ======================
           Scrollable Content
        ======================= */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Employee Info Card */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Requested by</div>
                <div className="font-semibold">{entity?.employee?.user?.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">
                  {entity?.employee?.employee_code}
                </div>
              </div>
            </div>
          </div>

          {/* ======================
             Request Details
          ======================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Request Details
            </h3>

            {/* ---------- Leave ---------- */}
            {isLeave && (
              <div className="space-y-3">
                <DetailRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Leave Period"
                  value={`${fmtDate(entity.start_date)} → ${fmtDate(entity.end_date)}`}
                />

                <DetailRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Duration"
                  value={`${entity.days} day(s)`}
                />

                {entity.leave_type && (
                  <DetailRow
                    label="Leave Type"
                    value={entity.leave_type.name}
                    badge
                  />
                )}

                {entity.reason && (
                  <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" />
                      Reason
                    </div>
                    <p className="text-sm leading-relaxed">{entity.reason}</p>
                  </div>
                )}
              </div>
            )}

            {/* ---------- Attendance Correction ---------- */}
            {isAttendance && entity && (
              <div className="space-y-3">
                <DetailRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Attendance Date"
                  value={fmtDate(entity.attendance?.date)}
                />

                <div className="rounded-lg border bg-muted/30 overflow-hidden">
                  <div className="bg-muted px-4 py-2 border-b">
                    <div className="text-xs font-semibold uppercase tracking-wide">
                      Requested Changes
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {entity.requested_check_in && (
                      <ChangeRow
                        label="Check-in"
                        current={fmtTime(entity.attendance?.check_in)}
                        requested={fmtTime(entity.requested_check_in)}
                      />
                    )}

                    {entity.requested_check_out && (
                      <ChangeRow
                        label="Check-out"
                        current={fmtTime(entity.attendance?.check_out)}
                        requested={fmtTime(entity.requested_check_out)}
                      />
                    )}

                    {entity.requested_status && (
                      <ChangeRow
                        label="Status"
                        current={entity.attendance?.status}
                        requested={entity.requested_status}
                        isBadge
                      />
                    )}
                  </div>
                </div>

                {entity.reason && (
                  <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" />
                      Reason
                    </div>
                    <p className="text-sm leading-relaxed">{entity.reason}</p>
                  </div>
                )}
              </div>
            )}

            {/* ---------- Attendance Unlock ---------- */}
            {isUnlock && entity && (
              <div className="space-y-3">
                <DetailRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Unlock Date"
                  value={fmtDate(entity.date)}
                />

                {entity.reason && (
                  <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" />
                      Reason
                    </div>
                    <p className="text-sm leading-relaxed">{entity.reason}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* ======================
             Approval Flow
          ======================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Approval Workflow</h3>
            <ApprovalStepper steps={steps} />
          </div>

          <Separator />

          {/* ======================
             Approval History
          ======================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Activity Timeline</h3>
            <ApprovalHistoryTimeline steps={steps} />
          </div>
        </div>

        {/* ======================
           Fixed Footer Actions
        ======================= */}
        {canAct && (
          <div className="border-t bg-background px-6 py-4 sticky bottom-0">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={loading}
                onClick={onReject}
                size="lg"
              >
                Reject
              </Button>

              <Button
                className="flex-1"
                disabled={loading}
                onClick={onApprove}
                size="lg"
              >
                {loading ? "Processing…" : "Approve"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* =========================================================
 | Helper Components
 |========================================================= */

function DetailRow({ icon, label, value, badge = false }) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="mt-0.5 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        {badge ? (
          <Badge variant="secondary" className="font-normal">
            {value ?? "—"}
          </Badge>
        ) : (
          <div className="font-medium text-sm">{value ?? "—"}</div>
        )}
      </div>
    </div>
  );
}

function ChangeRow({ label, current, requested, isBadge = false }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex items-center gap-3">
        {isBadge ? (
          <>
            <Badge variant="outline" className="text-muted-foreground font-normal">
              {current ?? "—"}
            </Badge>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <Badge variant="default" className="font-medium">
              {requested}
            </Badge>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground line-through">
              {current ?? "—"}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-semibold text-primary">
              {requested}
            </span>
          </>
        )}
      </div>
    </div>
  );
}