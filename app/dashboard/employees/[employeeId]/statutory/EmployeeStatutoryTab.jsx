"use client";

import { useEmployeeStatutory, useUpdateEmployeeStatutory } from "./useEmployeeStatutory";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEffect, useState } from "react";

const DEFAULT_FORM = {
  uan: "",
  pf_applicable: true,
  restrict_pf_wages: true,
  esi_applicable: false,
  esi_number: "",
};

export default function EmployeeStatutoryTab({ employeeId }) {
  const { data, isLoading } = useEmployeeStatutory(employeeId);
  const update = useUpdateEmployeeStatutory(employeeId);

  const statutory = data?.data;
  const editable = data?.meta?.editable ?? false;

  const [form, setForm] = useState(DEFAULT_FORM);

  // Hydrate form when API responds
  useEffect(() => {
  if (!statutory) return;

  setForm({
    uan: statutory.uan ?? "",
    pf_applicable: statutory.pf_applicable ?? true,
    restrict_pf_wages: statutory.restrict_pf_wages ?? true,
    esi_applicable: statutory.esi_applicable ?? false,
    esi_number: statutory.esi_number ?? "",
  });
}, [statutory]);
const isPfUanMissing =
  form.pf_applicable && form.uan.trim() === "";

const canSave = editable && !isPfUanMissing;
const isLocked = !editable;


  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading statutory details…</div>;
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* ================= PF ================= */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Provident Fund (PF)</h3>

        <div className="flex items-center justify-between">
            <Label>PF Applicable</Label>

            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                    <Switch
                        checked={form.pf_applicable}
                        disabled={isLocked}
                        onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, pf_applicable: v }))
                        }
                    />
                    </div>
                </TooltipTrigger>

                {isLocked && (
                    <TooltipContent side="left">
                    PF settings are locked after payroll finalization
                    </TooltipContent>
                )}
                </Tooltip>
            </TooltipProvider>
            </div>


        {form.pf_applicable && (
          <>
            <div className="space-y-1">
            <Label>UAN</Label>
            <Input
                value={form.uan}
                disabled={!editable}
                maxLength={12}
                placeholder="12-digit UAN"
                className={isPfUanMissing ? "border-red-500" : ""}
                onChange={(e) =>
                setForm((f) => ({ ...f, uan: e.target.value }))
                }
            />

            {isPfUanMissing && (
                <p className="text-xs text-red-600">
                UAN is required when PF is applicable.
                </p>
            )}
            </div>


            <div className="flex items-center justify-between">
              <Label>Restrict PF Wages (₹15,000)</Label>
              <Switch
                checked={form.restrict_pf_wages}
                disabled={!editable}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, restrict_pf_wages: v }))
                }
              />
            </div>
          </>
        )}
      </div>

      {/* ================= ESI ================= */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">ESI</h3>

        <div className="flex items-center justify-between">
          <Label>ESI Applicable</Label>
          <Switch
            checked={form.esi_applicable}
            disabled={!editable}
            onCheckedChange={(v) =>
              setForm((f) => ({ ...f, esi_applicable: v }))
            }
          />
        </div>

        {form.esi_applicable && (
          <div>
            <Label>ESI Number</Label>
            <Input
              value={form.esi_number}
              disabled={!editable}
              onChange={(e) =>
                setForm((f) => ({ ...f, esi_number: e.target.value }))
              }
            />
          </div>
        )}
      </div>

      {/* ================= Actions ================= */}
      {editable ? (
        <Button
          onClick={() => update.mutate(form)}
          disabled={!canSave || update.isPending}
        >
          Save Statutory Details
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Statutory details are locked because payroll has already been finalized
          for this employee.
        </p>
      )}
    </div>
  );
}
