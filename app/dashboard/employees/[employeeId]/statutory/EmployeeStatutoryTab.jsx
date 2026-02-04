"use client";

import { useEmployeeStatutory, useUpdateEmployeeStatutory } from "./useEmployeeStatutory";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shield,
  Info,
  Save,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
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

  const isPfUanMissing = form.pf_applicable && form.uan.trim() === "";
  const canSave = editable && !isPfUanMissing;
  const isLocked = !editable;

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Statutory Compliance</h2>
          <p className="text-sm text-muted-foreground">
            Manage PF, ESI, and other statutory details
          </p>
        </div>
      </div>

      {/* Lock Alert */}
      {isLocked && (
        <Alert className="border-amber-200 bg-amber-50">
          <Lock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            Statutory details are locked because payroll has already been
            finalized for this employee.
          </AlertDescription>
        </Alert>
      )}

      {/* ================= PF Section ================= */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Provident Fund (PF)</h3>
        </div>

        {/* PF Applicable Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold">PF Applicable</Label>
            <p className="text-xs text-muted-foreground">
              Enable provident fund deductions for this employee
            </p>
          </div>

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

        {/* PF Details - Conditional */}
        {form.pf_applicable && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50/30">
            {/* UAN */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                UAN (Universal Account Number) <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.uan}
                disabled={!editable}
                maxLength={12}
                placeholder="12-digit UAN (e.g., 123456789012)"
                className={`${isPfUanMissing ? "border-red-500" : ""}`}
                onChange={(e) => setForm((f) => ({ ...f, uan: e.target.value }))}
              />
              {isPfUanMissing ? (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  UAN is required when PF is applicable
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  12-digit unique account number provided by EPFO
                </p>
              )}
            </div>

            {/* Restrict PF Wages */}
            <div className="flex items-center justify-between p-3 rounded-md border bg-white">
              <div className="flex-1">
                <Label className="text-sm font-semibold">
                  Restrict PF Wages to ₹15,000
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cap PF calculation at statutory limit
                </p>
              </div>
              <Switch
                checked={form.restrict_pf_wages}
                disabled={!editable}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, restrict_pf_wages: v }))
                }
              />
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-800">
                PF contribution: Employee (12%) + Employer (12%) of basic + allowances
                {form.restrict_pf_wages && " (capped at ₹15,000)"}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </Card>

      {/* ================= ESI Section ================= */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Employee State Insurance (ESI)</h3>
        </div>

        {/* ESI Applicable Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold">ESI Applicable</Label>
            <p className="text-xs text-muted-foreground">
              Enable ESI deductions (for gross salary ≤ ₹21,000/month)
            </p>
          </div>

          <Switch
            checked={form.esi_applicable}
            disabled={!editable}
            onCheckedChange={(v) =>
              setForm((f) => ({ ...f, esi_applicable: v }))
            }
          />
        </div>

        {/* ESI Details - Conditional */}
        {form.esi_applicable && (
          <div className="space-y-4 p-4 border rounded-lg bg-emerald-50/30">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">ESI Number</Label>
              <Input
                value={form.esi_number}
                disabled={!editable}
                placeholder="17-digit ESI number"
                maxLength={17}
                onChange={(e) =>
                  setForm((f) => ({ ...f, esi_number: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Employee's ESI insurance number
              </p>
            </div>

            <Alert className="bg-emerald-50 border-emerald-200">
              <Info className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-xs text-emerald-800">
                ESI contribution: Employee (0.75%) + Employer (3.25%) of gross salary
              </AlertDescription>
            </Alert>
          </div>
        )}
      </Card>

      {/* ================= Actions ================= */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {editable ? (
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Changes will take effect in the next payroll cycle
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Editing is locked due to payroll finalization
            </span>
          )}
        </div>

        {editable && (
          <Button
            onClick={() => update.mutate(form)}
            disabled={!canSave || update.isPending}
            className="gap-2"
          >
            {update.isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}