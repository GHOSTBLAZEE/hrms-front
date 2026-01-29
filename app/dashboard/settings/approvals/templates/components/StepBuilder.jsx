"use client";

import StepCard from "./StepCard";
import { ArrowDown } from "lucide-react";

export default function StepBuilder({ 
  steps, 
  onUpdateStep, 
  onRemoveStep,
  loading 
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-6 animate-pulse bg-muted/20"
          >
            <div className="h-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {steps.map((step, index) => (
        <div key={step.id || index} className="relative">
          {/* Step Card */}
          <StepCard
            step={step}
            index={index}
            onChange={(patch) => onUpdateStep(index, patch)}
            onRemove={onRemoveStep}
          />

          {/* Connector Arrow */}
          {index < steps.length - 1 && (
            <div className="flex justify-center py-2">
              <div className="flex flex-col items-center gap-1">
                <ArrowDown className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-muted-foreground font-medium">
                  Then
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Workflow Complete Indicator */}
      {steps.length > 0 && (
        <div className="flex justify-center pt-2">
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <span className="text-xs font-medium text-green-700">
              ✓ Workflow Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
}