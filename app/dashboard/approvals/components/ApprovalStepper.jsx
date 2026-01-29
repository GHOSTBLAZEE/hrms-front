"use client";

import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Users,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import ApprovalAvatar from "./ApprovalAvatar";
import ApprovalStatusChip from "./ApprovalStatusChip";
import ApprovalSlaBadge from "./ApprovalSlaBadge";

/* --------------------------------
 | Helpers
 |---------------------------------*/
function StatusIcon({ status, size = "default" }) {
  const sizeClass = size === "large" ? "h-5 w-5" : "h-4 w-4";
  
  if (status === "approved") {
    return <CheckCircle2 className={`${sizeClass} text-green-600`} />;
  }

  if (status === "rejected") {
    return <XCircle className={`${sizeClass} text-red-600`} />;
  }

  if (status === "skipped") {
    return <XCircle className={`${sizeClass} text-gray-400`} />;
  }

  return <Clock className={`${sizeClass} text-amber-500`} />;
}

function modeLabel(mode) {
  return mode === "any"
    ? "Any one approver"
    : "All approvers required";
}

function ModeIcon({ mode }) {
  return mode === "any" ? (
    <User className="h-3.5 w-3.5" />
  ) : (
    <Users className="h-3.5 w-3.5" />
  );
}

function groupByStep(steps) {
  return Object.values(
    steps.reduce((acc, step) => {
      acc[step.step_order] ||= [];
      acc[step.step_order].push(step);
      return acc;
    }, {})
  ).sort((a, b) => a[0].step_order - b[0].step_order);
}

/* --------------------------------
 | Component
 |---------------------------------*/
export default function ApprovalStepper({ steps = [] }) {
  if (!steps.length) return null;

  const groupedSteps = groupByStep(steps);
  const totalSteps = groupedSteps.length;

  return (
    <div className="space-y-1">
      {groupedSteps.map((group, index) => {
        const primary = group[0];
        const isLast = index === totalSteps - 1;

        const stepStatus =
          primary.status === "rejected"
            ? "rejected"
            : group.every((s) => s.status === "approved")
            ? "approved"
            : group.some((s) => s.status === "skipped")
            ? "skipped"
            : "pending";

        const canAct = group.some((s) => s.can_act);

        // Count approvers
        const approvedCount = group.filter(s => s.status === "approved").length;
        const totalCount = group.length;

        return (
          <div key={primary.step_order}>
            {/* Step Container */}
            <div
              className={[
                "rounded-lg border transition-all duration-200",
                canAct
                  ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                  : stepStatus === "approved"
                  ? "border-green-200 bg-green-50/50"
                  : stepStatus === "rejected"
                  ? "border-red-200 bg-red-50/50"
                  : stepStatus === "skipped"
                  ? "border-gray-200 bg-gray-50/50"
                  : "border-border bg-background",
              ].join(" ")}
            >
              <div className="p-4">
                {/* =====================
                   Header Row
                ====================== */}
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Step Number + Icon */}
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm flex-shrink-0",
                        stepStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : stepStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : stepStatus === "skipped"
                          ? "bg-gray-100 text-gray-500"
                          : canAct
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {stepStatus === "approved" || stepStatus === "rejected" || stepStatus === "skipped" ? (
                        <StatusIcon status={stepStatus} />
                      ) : (
                        primary.step_order
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-sm">
                        Step {primary.step_order}
                        {stepStatus === "approved" && " - Approved"}
                        {stepStatus === "rejected" && " - Rejected"}
                        {stepStatus === "skipped" && " - Skipped"}
                        {stepStatus === "pending" && canAct && " - Action Required"}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground flex-wrap">
                        <ModeIcon mode={primary.approval_mode} />
                        <span>{modeLabel(primary.approval_mode)}</span>
                        {primary.approval_mode === "all" && stepStatus === "pending" && (
                          <Badge variant="outline" className="ml-1 text-xs px-1.5 py-0">
                            {approvedCount}/{totalCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <ApprovalStatusChip status={stepStatus} />
                </div>

                {/* =====================
                   Approvers Grid
                ====================== */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.map((step) => {
                    // Get approver name - handle missing data gracefully
                    let approverName = "Approver";
                    
                    if (step.approver?.name) {
                      approverName = step.approver.name;
                    } else if (step.approver_type === "role") {
                      approverName = "Role";
                    } else if (step.approver_type === "user") {
                      approverName = "User";
                    }

                    return (
                      <ApprovalAvatar
                        key={step.id}
                        type={step.approver_type}
                        name={approverName}
                        status={step.status}
                        showTooltip
                      />
                    );
                  })}
                </div>

                {/* =====================
                   SLA / Escalation / Action Hint
                ====================== */}
                {stepStatus === "pending" && (
                  <div className="mt-3 space-y-2">
                    {primary.sla_hours && (
                      <ApprovalSlaBadge step={primary} />
                    )}

                    {primary.escalated_at && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 rounded px-2 py-1 w-fit">
                        <AlertTriangle className="h-3 w-3" />
                        Escalated on{" "}
                        {new Date(primary.escalated_at).toLocaleDateString()}
                      </div>
                    )}

                    {canAct && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded px-2 py-1.5 w-fit">
                        <Clock className="h-3.5 w-3.5" />
                        Your action is required
                      </div>
                    )}
                  </div>
                )}

                {/* Show who acted for completed steps */}
                {(stepStatus === "approved" || stepStatus === "rejected") && 
                 group.some(s => s.acted_by && s.acted_at) && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                    {group
                      .filter(s => s.acted_by && s.acted_at)
                      .map((step) => {
                        // Show the actual person who acted
                        const actorName = step.actor?.name || "System";
                        
                        // Show which approver slot they filled
                        let approverInfo = "";
                        if (step.approver?.name) {
                          approverInfo = step.approver_type === "role" 
                            ? ` (as ${step.approver.name} role)` 
                            : ` (as ${step.approver.name})`;
                        }
                        
                        return (
                          <div key={step.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {step.status === "approved" ? "Approved" : "Rejected"} by{" "}
                                <span className="font-medium text-foreground">
                                  {actorName}
                                </span>
                                {approverInfo && (
                                  <span className="text-muted-foreground">
                                    {approverInfo}
                                  </span>
                                )}
                              </span>
                              <span className="text-muted-foreground">
                                {new Date(step.acted_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            
                            {/* Show remarks for this specific step */}
                            {step.remarks && (
                              <div className="text-xs text-muted-foreground italic pl-2 border-l-2 border-muted">
                                "{step.remarks}"
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line to Next Step */}
            {!isLast && (
              <div className="flex items-center justify-center py-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}