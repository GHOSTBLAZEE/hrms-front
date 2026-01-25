"use client";

import { useEffect, useState } from "react";
import ModuleSidebar from "./components/ModuleSidebar";
import TemplateHeader from "./components/TemplateHeader";
import StepBuilder from "./components/StepBuilder";
import { useApprovalTemplates } from "./hooks/useApprovalTemplates";
import { useSaveApprovalTemplate } from "./hooks/useSaveApprovalTemplate";
import { toast } from "sonner";

export default function ApprovalTemplatesPage() {
  const {
    module,
    setModule,
    template,
    isLoading,
  } = useApprovalTemplates();

  const [steps, setSteps] = useState([]);
const { saveTemplate, isSaving } = useSaveApprovalTemplate(module);

  // Sync API → local steps
  useEffect(() => {
    if (template?.steps) {
      setSteps(template.steps);
    }
  }, [template]);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`, // temp id
        step_order: prev.length + 1,
        approvers: [],
        sla_days: 2,
        reminders: [],
        _isNew: true,
      },
    ]);
  }
function updateStep(index, patch) {
  setSteps((prev) =>
    prev.map((s, i) =>
      i === index ? { ...s, ...patch } : s
    )
  );
}
function serializeSteps(steps) {
  return steps.map((s, index) => ({
    step_order: index + 1,
    sla_days: s.sla_days,
    reminders: s.reminders ?? [],
    approvers: (s.approvers ?? []).map(a => ({
      type: a.type, // "user" | "role"
      id: a.id,
    })),
  }));
}
function save() {
  saveTemplate(
    {
      steps: serializeSteps(steps),
    },
    {
      onSuccess: () => {
        // optional toast if you want
        toast.success("Template saved");
      },
    }
  );
}

  return (
    <div className="flex h-full">
      {/* Left */}
      <ModuleSidebar value={module} onChange={setModule} />

      {/* Right */}
      <div className="flex-1 p-6 space-y-4">
        <TemplateHeader template={template} loading={isLoading} />

        {/* Add Step button */}
        <div>
          <button
            onClick={addStep}
            className="text-sm px-3 py-1.5 border rounded hover:bg-muted"
          >
            + Add Step
          </button>
        </div>
        <button
            onClick={save}
            disabled={isSaving}
            className="text-sm px-4 py-1.5 rounded bg-primary text-primary-foreground disabled:opacity-50"
        >
            {isSaving ? "Saving…" : "Save"}
        </button>
        <StepBuilder
            steps={steps}
            onUpdateStep={updateStep}
            loading={isLoading}
            />

      </div>
    </div>
  );
}
