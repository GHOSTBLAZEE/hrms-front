"use client";

import { useState } from "react";
import { Clock, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SlaEditor({ value = 2, onChange }) {
  const [slaDays, setSlaDays] = useState(value);

  const handleSliderChange = (values) => {
    const newValue = values[0];
    setSlaDays(newValue);
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    const newValue = Math.max(1, Math.min(30, Number(e.target.value) || 1));
    setSlaDays(newValue);
    onChange(newValue);
  };

  const getSlaDescription = (days) => {
    if (days === 1) return "Urgent - Same day response required";
    if (days <= 2) return "High priority - Quick turnaround";
    if (days <= 5) return "Standard - Normal business processing";
    if (days <= 10) return "Moderate - Reasonable timeframe";
    return "Extended - Longer review period";
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <Label className="text-sm font-medium">
            Service Level Agreement
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Maximum time allowed for this approval step before escalation
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max="30"
            value={slaDays}
            onChange={handleInputChange}
            className="w-16 h-8 text-center text-sm font-semibold"
          />
          <span className="text-sm text-muted-foreground">days</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider
          value={[slaDays]}
          onValueChange={handleSliderChange}
          min={1}
          max={30}
          step={1}
          className="w-full"
        />
        
        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 day</span>
          <span>15 days</span>
          <span>30 days</span>
        </div>
      </div>

      {/* Description */}
      <div className="text-xs text-slate-600 bg-white/50 rounded p-2 border border-slate-200">
        {getSlaDescription(slaDays)}
      </div>
    </div>
  );
}