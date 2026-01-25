"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  useApprovalSettings,
  useUpdateApprovalSettings,
} from "@/hooks/useApprovalSettings";
import { toast } from "sonner";

/* --------------------------------
 | Constants
 |--------------------------------*/
const FALLBACK_DEFAULT = [1440, 240, 60];

const MODULES = [
  { key: "leave", label: "Leave Approvals" },
  { key: "attendance", label: "Attendance Corrections" },
  { key: "attendance_unlock", label: "Attendance Unlocks" },
];

/* --------------------------------
 | Helpers
 |--------------------------------*/
function parseMinutes(value) {
  return value
    .split(",")
    .map(v => parseInt(v.trim(), 10))
    .filter(v => Number.isInteger(v) && v > 0);
}

function MinutesInput({ value, onChange }) {
  return (
    <Input
      value={value}
      placeholder="1440, 240, 60"
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => {
        onChange(parseMinutes(value).join(", "));
      }}
    />
  );
}

/* --------------------------------
 | Page
 |--------------------------------*/
export default function ApprovalSettingsPage() {
  const { permissions = [] } = useAuth();
  const { data, isLoading } = useApprovalSettings();
  const update = useUpdateApprovalSettings();

  const [defaultValue, setDefaultValue] = useState("");
  const [modules, setModules] = useState({});
  const [touched, setTouched] = useState(false);

  /* -------------------------------
   | Permissions
   |--------------------------------*/
  if (!permissions.includes("manage approval settings")) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        You don’t have permission to manage approval settings.
      </div>
    );
  }

  /* -------------------------------
   | Sync API → state
   |--------------------------------*/
  useEffect(() => {
    if (!data) return;

    setDefaultValue(
      (data.default ?? FALLBACK_DEFAULT).join(", ")
    );

    setModules(
      Object.fromEntries(
        Object.entries(data.modules ?? {}).map(
          ([k, v]) => [k, v.join(", ")]
        )
      )
    );
  }, [data]);

  /* -------------------------------
   | Validation
   |--------------------------------*/
  const parsedDefault = useMemo(
    () => parseMinutes(defaultValue),
    [defaultValue]
  );

  const isDefaultValid = parsedDefault.length > 0;

  /* -------------------------------
   | Save
   |--------------------------------*/
  const save = () => {
    if (!isDefaultValid) return;

    update.mutate(
      {
        default: parsedDefault,
        modules: Object.fromEntries(
          Object.entries(modules)
            .filter(([, v]) => v)
            .map(([k, v]) => [k, parseMinutes(v)])
        ),
      },
      {
        onSuccess: () => {
          toast.success("Approval reminder settings updated");
        },
        onError: () => {
          toast.error("Failed to update approval reminders");
        },
      }
    );
  };

  const resetToDefault = () => {
    setDefaultValue(FALLBACK_DEFAULT.join(", "));
    setTouched(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl p-6">
      <h1 className="text-xl font-semibold">
        Approval Reminder Settings
      </h1>

      {/* ---------------- Company Default ---------------- */}
      <h2 className="font-medium">Company Default</h2>

      <MinutesInput
        value={defaultValue}
        onChange={(v) => {
          setDefaultValue(v);
          setTouched(true);
        }}
      />

      {/* Helper chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {parsedDefault.map(m => (
          <span
            key={m}
            className="rounded-full bg-muted px-2 py-1"
          >
            {m >= 60 ? `${Math.floor(m / 60)}h` : `${m}m`}
          </span>
        ))}
      </div>

      {touched && !isDefaultValid && (
        <p className="text-sm text-destructive">
          Please enter at least one valid reminder time.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={resetToDefault}
      >
        Reset to Default
      </Button>

      {/* ---------------- Module Overrides ---------------- */}
      <h2 className="font-medium mt-6">
        Module Overrides
      </h2>

      <div className="space-y-4">
        {MODULES.map(m => (
          <div key={m.key}>
            <label className="text-sm font-medium">
              {m.label}
            </label>

            <MinutesInput
              value={modules[m.key] || ""}
              onChange={(val) =>
                setModules(prev => ({
                  ...prev,
                  [m.key]: val,
                }))
              }
            />

            <p className="text-xs text-muted-foreground">
              Leave empty to use company default
            </p>
          </div>
        ))}
      </div>

      <Button
        onClick={save}
        disabled={!isDefaultValid || update.isLoading}
      >
        Save Settings
      </Button>
    </div>
  );
}
