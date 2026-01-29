"use client";

import { useState } from "react";
import { Bell, BellOff, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ReminderEditor({ value = [], onChange }) {
  const hasReminder = value.length > 0;
  
  const reminder = hasReminder
    ? value[0]
    : {
        after_days: 2,
        repeat_every_days: 1,
      };

  const handleToggle = (enabled) => {
    if (enabled) {
      onChange([
        {
          after_days: 2,
          repeat_every_days: 1,
        },
      ]);
    } else {
      onChange([]);
    }
  };

  const handleUpdate = (key, val) => {
    const numValue = Math.max(1, Number(val) || 1);
    onChange([
      {
        ...reminder,
        [key]: numValue,
      },
    ]);
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasReminder ? (
            <Bell className="w-4 h-4 text-amber-600" />
          ) : (
            <BellOff className="w-4 h-4 text-muted-foreground" />
          )}
          <Label className="text-sm font-medium">
            Email Reminders
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Automatic email reminders will be sent to pending approvers
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Switch
          checked={hasReminder}
          onCheckedChange={handleToggle}
        />
      </div>

      {/* Reminder Configuration */}
      {hasReminder && (
        <div className="space-y-4 pl-6 border-l-2 border-amber-300">
          {/* After Days */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700">
              Send first reminder after
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="30"
                value={reminder.after_days}
                onChange={(e) => handleUpdate("after_days", e.target.value)}
                className="w-20 h-9 text-center font-semibold bg-white"
              />
              <span className="text-sm text-muted-foreground">
                {reminder.after_days === 1 ? "day" : "days"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              First reminder will be sent {reminder.after_days} {reminder.after_days === 1 ? "day" : "days"} after submission
            </p>
          </div>

          {/* Repeat Every */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700">
              Repeat reminder every
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="14"
                value={reminder.repeat_every_days}
                onChange={(e) => handleUpdate("repeat_every_days", e.target.value)}
                className="w-20 h-9 text-center font-semibold bg-white"
              />
              <span className="text-sm text-muted-foreground">
                {reminder.repeat_every_days === 1 ? "day" : "days"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Subsequent reminders every {reminder.repeat_every_days} {reminder.repeat_every_days === 1 ? "day" : "days"} until approved
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-white/70 border border-amber-200 rounded-md p-3 space-y-1">
            <p className="text-xs font-medium text-slate-700">Reminder Schedule</p>
            <div className="space-y-0.5 text-xs text-slate-600">
              <p>• Day {reminder.after_days}: First reminder</p>
              <p>• Day {reminder.after_days + reminder.repeat_every_days}: Second reminder</p>
              <p>• Day {reminder.after_days + (reminder.repeat_every_days * 2)}: Third reminder</p>
              <p className="text-muted-foreground italic">...and so on</p>
            </div>
          </div>
        </div>
      )}

      {/* Disabled State Message */}
      {!hasReminder && (
        <div className="text-xs text-muted-foreground pl-6 py-2">
          Enable reminders to automatically notify approvers
        </div>
      )}
    </div>
  );
}