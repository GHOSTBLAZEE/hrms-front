"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { 
  Plus, 
  Save, 
  Loader2, 
  CheckCircle2,
  Settings2,
  Workflow
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ModuleSidebar from "./components/ModuleSidebar";
import TemplateHeader from "./components/TemplateHeader";
import StepBuilder from "./components/StepBuilder";

import { useApprovalTemplates } from "./hooks/useApprovalTemplates";
import { useSaveApprovalTemplate } from "./hooks/useSaveApprovalTemplate";

/* --------------------------------
 | Helpers
 |--------------------------------*/
const normalizeSteps = (steps = []) => {
  return steps.map((step) => ({
    ...step,
    approval_mode: step.approval_mode || "any", // ✅ Added approval_mode
    approver_type: step.approver_type || "role",
    approver_ids: step.approver_ids || [],
    reminders: step.reminders || [],
    sla_days: step.sla_days ?? 2,
  }));
};

const serializeSteps = (steps) => {
  return steps.map((step, index) => ({
    step_order: index + 1,
    approval_mode: step.approval_mode || "any", // ✅ Include approval_mode
    sla_days: step.sla_days,
    reminders: step.reminders,
    approver_type: step.approver_type,
    approver_ids: step.approver_ids,
  }));
};

/* --------------------------------
 | Page
 |--------------------------------*/
export default function ApprovalTemplatesPage() {
  const { module, setModule, template, isLoading } = useApprovalTemplates();
  const [steps, setSteps] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const saveMutation = useSaveApprovalTemplate(module);

  /* -------------------------------
   | Sync API → local state
   |--------------------------------*/
  useEffect(() => {
    if (!template?.steps) {
      setSteps([]);
      setHasChanges(false);
      return;
    }
    setSteps(normalizeSteps(template.steps));
    setHasChanges(false);
  }, [template?.id]);

  /* -------------------------------
   | Track changes
   |--------------------------------*/
  useEffect(() => {
    if (!template?.steps) return;
    
    const originalSteps = serializeSteps(normalizeSteps(template.steps));
    const currentSteps = serializeSteps(steps);
    
    setHasChanges(JSON.stringify(originalSteps) !== JSON.stringify(currentSteps));
  }, [steps, template?.steps]);

  /* -------------------------------
   | Step actions
   |--------------------------------*/
  const addStep = useCallback(() => {
    setSteps((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        approval_mode: "any", // ✅ Default to 'any'
        approver_type: "role",
        approver_ids: [],
        sla_days: 2,
        reminders: [],
        _isNew: true,
      },
    ]);
  }, []);

  const updateStep = useCallback((index, patch) => {
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, ...patch } : step
      )
    );
  }, []);

  const removeStep = useCallback((index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /* -------------------------------
   | Save
   |--------------------------------*/
  const payload = useMemo(
    () => ({ steps: serializeSteps(steps) }),
    [steps]
  );

  const save = useCallback(() => {
    // ✅ Validate that all steps have at least one approver
    const invalidSteps = steps.filter(
      (step, index) => !step.approver_ids || step.approver_ids.length === 0
    );

    if (invalidSteps.length > 0) {
      toast.error("All steps must have at least one approver");
      return;
    }

    saveMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Template saved successfully");
        setHasChanges(false);
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to save template");
      },
    });
  }, [payload, saveMutation, steps]);

  const canSave = steps.length > 0 && !saveMutation.isPending && hasChanges;

  /* -------------------------------
   | Render
   |--------------------------------*/
  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100/50">
      <ModuleSidebar value={module} onChange={setModule} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Approval Templates
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Configure approval workflows for {module || "your module"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={addStep}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </Button>

                <Button
                  onClick={save}
                  disabled={!canSave}
                  className="gap-2 relative"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Template
                      {hasChanges && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <TemplateHeader template={template} loading={isLoading} />
          </div>

          <Separator />

          {/* Workflow Steps */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Loading template...
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : steps.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <Settings2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        No approval steps configured
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Get started by adding your first approval step to define the workflow
                      </p>
                    </div>
                    <Button onClick={addStep} className="gap-2 mt-2">
                      <Plus className="w-4 h-4" />
                      Add First Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <StepBuilder
                steps={steps}
                onUpdateStep={updateStep}
                onRemoveStep={removeStep}
                loading={isLoading}
              />
            )}
          </div>

          {/* Save Reminder */}
          {hasChanges && !saveMutation.isPending && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-sm font-medium text-orange-900">
                    You have unsaved changes
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={save}
                  className="gap-2"
                >
                  <Save className="w-3 h-3" />
                  Save Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}