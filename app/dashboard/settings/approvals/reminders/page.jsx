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
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => Number.isInteger(v) && v > 0);
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
  /* --------------------------------
   | All hooks MUST come first — no conditional returns above these
   | (React Rules of Hooks)
   |--------------------------------*/
  const { permissions = [], isLoading: authLoading } = useAuth();
  const { data, isLoading: settingsLoading } = useApprovalSettings();
  const update = useUpdateApprovalSettings();

  const [defaultValue, setDefaultValue] = useState("");
  const [modules, setModules] = useState({});
  const [touched, setTouched] = useState(false);

  /* -------------------------------
   | Sync API → state
   |--------------------------------*/
  useEffect(() => {
    if (!data) return;

    setDefaultValue((data.default ?? FALLBACK_DEFAULT).join(", "));

    setModules(
      Object.fromEntries(
        Object.entries(data.modules ?? {}).map(([k, v]) => [k, v.join(", ")])
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
   | Permission guard — AFTER all hooks
   |--------------------------------*/
  if (authLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading…</div>
    );
  }

  if (!permissions.includes("manage approval settings")) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        You don't have permission to manage approval settings.
      </div>
    );
  }

  if (settingsLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading…</div>
    );
  }

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

  return (
    <div className="space-y-6 max-w-xl p-6">
      <h1 className="text-xl font-semibold">Approval Reminder Settings</h1>

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
        {parsedDefault.map((m) => (
          <span key={m} className="rounded-full bg-muted px-2 py-1">
            {m >= 60 ? `${Math.floor(m / 60)}h` : `${m}m`}
          </span>
        ))}
      </div>

      {touched && !isDefaultValid && (
        <p className="text-sm text-destructive">
          Please enter at least one valid reminder time.
        </p>
      )}

      <Button variant="outline" size="sm" onClick={resetToDefault}>
        Reset to default (24h, 4h, 1h)
      </Button>

      {/* ---------------- Per-Module Overrides ---------------- */}
      <div className="space-y-4 pt-2">
        <h2 className="font-medium">Per-Module Overrides</h2>
        <p className="text-sm text-muted-foreground">
          Leave blank to use the company default above.
        </p>

        {MODULES.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <MinutesInput
              value={modules[key] ?? ""}
              onChange={(v) => {
                setModules((prev) => ({ ...prev, [key]: v }));
                setTouched(true);
              }}
            />
          </div>
        ))}
      </div>

      {/* ---------------- Save ---------------- */}
      <Button
        onClick={save}
        disabled={!isDefaultValid || update.isPending}
      >
        {update.isPending ? "Saving…" : "Save Changes"}
      </Button>
    </div>
  );
}