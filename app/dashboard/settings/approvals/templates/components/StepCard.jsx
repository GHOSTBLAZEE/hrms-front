import ApproverSelector from "./ApproverSelector";
import SlaEditor from "./SlaEditor";
import ReminderEditor from "./ReminderEditor";

export default function StepCard({ step, index, onChange }) {
  return (
    <div className="border rounded-md p-4 space-y-3">
      <h3 className="font-medium">Step {index + 1}</h3>

      <ApproverSelector approvers={step.approvers} />
      <SlaEditor value={step.sla_days} />

      <ReminderEditor
        value={step.reminders}
        onChange={(reminders) =>
          onChange({ reminders })
        }
      />
    </div>
  );
}
