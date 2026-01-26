import ApproverSelector from "./ApproverSelector";
import SlaEditor from "./SlaEditor";
import ReminderEditor from "./ReminderEditor";

export default function StepCard({ step, index, onChange }) {
  return (
    <div className="border rounded-md p-4 space-y-3">
      <h3 className="font-medium">Step {index + 1}</h3>

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


      <SlaEditor
        value={step.sla_days}
        onChange={(sla_days) =>
          onChange({ sla_days })
        }
      />


      <ReminderEditor
        value={step.reminders || []}
        onChange={(reminders) =>
          onChange({ reminders })
        }
      />
    </div>
  );
}
