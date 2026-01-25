import StepCard from "./StepCard";

export default function StepBuilder({ steps, onUpdateStep, loading }) {
  if (loading) {
    return <div className="h-24 bg-muted rounded-xl animate-pulse" />;
  }

  if (!steps.length) {
    return (
      <div className="text-sm text-muted-foreground border rounded-xl p-6">
        No approval steps configured.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <StepCard
          key={step.id}
          step={step}
          index={index}
          onChange={(patch) => onUpdateStep(index, patch)}
        />
      ))}
    </div>
  );
}
