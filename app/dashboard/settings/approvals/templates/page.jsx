"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

import ModuleSidebar from "./components/ModuleSidebar";
import TemplateHeader from "./components/TemplateHeader";
import StepBuilder from "./components/StepBuilder";

import { useApprovalTemplates } from "./hooks/useApprovalTemplates";
import { useSaveApprovalTemplate } from "./hooks/useSaveApprovalTemplate";

/* --------------------------------
 | Helpers
 |--------------------------------*/
function normalizeSteps(steps = []) {
  return steps.map((step) => ({
    ...step,
    approver_type: step.approver_type || "role",
    approver_ids: step.approver_ids || [],
    reminders: step.reminders || [],
    sla_days: step.sla_days ?? 2,
  }));
}

function serializeSteps(steps) {
  return steps.map((step, index) => ({
    step_order: index + 1,
    sla_days: step.sla_days,
    reminders: step.reminders,
    approver_type: step.approver_type,
    approver_ids: step.approver_ids,
  }));
}

/* --------------------------------
 | Page
 |--------------------------------*/
export default function ApprovalTemplatesPage() {
  const { module, setModule, template, isLoading } =
    useApprovalTemplates();

  const [steps, setSteps] = useState([]);

  const saveMutation = useSaveApprovalTemplate(module);

  /* -------------------------------
   | Sync API → local state
   |--------------------------------*/
  useEffect(() => {
    if (!template?.steps) return;
    setSteps(normalizeSteps(template.steps));
  }, [template?.id]);

  /* -------------------------------
   | Step actions
   |--------------------------------*/
  const addStep = useCallback(() => {
    setSteps((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
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

  /* -------------------------------
   | Save
   |--------------------------------*/
  const payload = useMemo(
    () => ({ steps: serializeSteps(steps) }),
    [steps]
  );

  const save = useCallback(() => {
    saveMutation.mutate(payload, {
      onSuccess: () => toast.success("Template saved"),
      onError: () => toast.error("Failed to save template"),
    });
  }, [payload, saveMutation]);

  const canSave =
    steps.length > 0 && !saveMutation.isPending;

  /* -------------------------------
   | Render
   |--------------------------------*/
  return (
    <div className="flex h-full">
      <ModuleSidebar value={module} onChange={setModule} />

      <div className="flex-1 p-6 space-y-4">
        <TemplateHeader
          template={template}
          loading={isLoading}
        />

        <div className="flex gap-3">
          <button
            onClick={addStep}
            className="text-sm px-3 py-1.5 border rounded hover:bg-muted"
          >
            + Add Step
          </button>

          <button
            onClick={save}
            disabled={!canSave}
            className="text-sm px-4 py-1.5 rounded bg-primary text-primary-foreground disabled:opacity-50"
          >
            {saveMutation.isPending ? "Saving…" : "Save"}
          </button>
        </div>

        <StepBuilder
          steps={steps}
          onUpdateStep={updateStep}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
