"use client";

import { useState } from "react";
import { 
  GripVertical, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Users,
  Clock,
  Bell,
  CheckCheck,
  UserCheck
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import ApproverSelector from "./ApproverSelector";
import SlaEditor from "./SlaEditor";
import ReminderEditor from "./ReminderEditor";

export default function StepCard({ step, index, onChange, onRemove }) {
  const [isOpen, setIsOpen] = useState(true);

  const approverCount = step.approver_ids?.length || 0;
  const hasReminders = step.reminders?.length > 0;
  const approvalMode = step.approval_mode || 'any';

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Card Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Step Info */}
            <div className="flex items-center gap-3 flex-1">
              {/* Drag Handle */}
              <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Step Number Badge */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold">
                {index + 1}
              </div>

              {/* Step Title & Metadata */}
              <div className="flex-1">
                <h3 className="font-semibold text-base">
                  Approval Step {index + 1}
                </h3>
                
                {/* Quick Info Badges */}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Users className="w-3 h-3" />
                    {approverCount} {approverCount === 1 ? 'approver' : 'approvers'}
                  </Badge>
                  
                  <Badge 
                    variant="secondary" 
                    className={`text-xs gap-1 ${
                      approvalMode === 'all' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : ''
                    }`}
                  >
                    {approvalMode === 'all' ? (
                      <CheckCheck className="w-3 h-3" />
                    ) : (
                      <UserCheck className="w-3 h-3" />
                    )}
                    {approvalMode === 'all' ? 'All must approve' : 'Any can approve'}
                  </Badge>
                  
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Clock className="w-3 h-3" />
                    {step.sla_days || 2} days SLA
                  </Badge>

                  {hasReminders && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Bell className="w-3 h-3" />
                      Reminders on
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove?.(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        {/* Collapsible Content */}
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-5">
            {/* Divider */}
            <div className="border-t" />

            {/* Approval Mode Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Approval Mode</h4>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-lg p-4">
                <RadioGroup
                  value={approvalMode}
                  onValueChange={(value) => onChange({ approval_mode: value })}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-white/50 transition-colors">
                    <RadioGroupItem value="any" id={`mode-any-${index}`} className="mt-0.5" />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`mode-any-${index}`} 
                        className="cursor-pointer font-medium flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        Any One Approver
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        The step is approved when <strong>any single approver</strong> from the list approves.
                        Best for parallel approval workflows.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-white/50 transition-colors">
                    <RadioGroupItem value="all" id={`mode-all-${index}`} className="mt-0.5" />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`mode-all-${index}`} 
                        className="cursor-pointer font-medium flex items-center gap-2"
                      >
                        <CheckCheck className="w-4 h-4 text-purple-600" />
                        All Approvers Required
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        The step is approved only when <strong>all approvers</strong> have approved.
                        Best for consensus-based decisions.
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {/* Visual Example */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-700 mb-2">Example:</p>
                  <div className="text-xs text-slate-600 bg-white/70 rounded p-2">
                    {approvalMode === 'any' ? (
                      <span>
                        If approvers are [Manager A, Manager B, Manager C], 
                        <strong className="text-blue-700"> only one</strong> needs to approve.
                      </span>
                    ) : (
                      <span>
                        If approvers are [Manager A, Manager B, Manager C], 
                        <strong className="text-purple-700"> all three</strong> must approve.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Approver Selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Approvers</h4>
              </div>
              <ApproverSelector
                value={{
                  approver_type: step.approver_type ?? "role",
                  approver_ids: step.approver_ids ?? [],
                }}
                onChange={(v) =>
                  onChange({
                    approver_type: v.approver_type,
                    approver_ids: v.approver_ids,
                  })
                }
              />
            </div>

            {/* SLA Editor */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Service Level Agreement</h4>
              </div>
              <SlaEditor
                value={step.sla_days}
                onChange={(sla_days) => onChange({ sla_days })}
              />
            </div>

            {/* Reminder Editor */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Reminders</h4>
              </div>
              <ReminderEditor
                value={step.reminders || []}
                onChange={(reminders) => onChange({ reminders })}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}