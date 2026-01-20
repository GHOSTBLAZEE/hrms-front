"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLeaveTypes } from "./useLeaveTypes";

const EMPTY_FORM = {
  name: "",
  code: "",
  is_paid: true,
  requires_approval: true,
  accrual_rate: "",
  annual_limit: "",
  allow_half_day: false,
};

export default function LeaveTypeDialog({
  open,
  onClose,
  initialData = null,
}) {
  const { create } = useLeaveTypes();
  const isVersion = !!initialData;

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  /* ---------------------------------------------------------
   | Sync form when editing / versioning
   |-------------------------------------------------------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        code: initialData.code ?? "",
        is_paid: initialData.is_paid ?? true,
        requires_approval: initialData.requires_approval ?? true,
        accrual_rate: initialData.accrual_rate ?? "",
        annual_limit: initialData.annual_limit ?? "",
        allow_half_day: initialData.allow_half_day ?? false,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [initialData, open]);

  /* ---------------------------------------------------------
   | Submit
   |-------------------------------------------------------- */
  function submit() {
    setError("");

    // 🔒 Enterprise validation
    if (form.is_paid) {
      if (!form.accrual_rate || !form.annual_limit) {
        setError(
          "Paid leave must have an accrual rate and an annual limit."
        );
        return;
      }
    }

    create.mutate(
      {
        name: form.name.trim(),
        code: form.code.trim(),
        is_paid: form.is_paid,
        requires_approval: form.requires_approval,
        allow_half_day: form.allow_half_day,
        accrual_rate: form.is_paid
          ? Number(form.accrual_rate)
          : null,
        annual_limit: form.is_paid
          ? Number(form.annual_limit)
          : null,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM);
          onClose();
        },
      }
    );
  }

  /* ---------------------------------------------------------
   | Render
   |-------------------------------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isVersion
              ? "Create New Leave Type Version"
              : "Add Leave Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Name */}
          <Input
            placeholder="Name (e.g. Casual Leave)"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Code */}
          <Input
            placeholder="Code (e.g. CL)"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value })
            }
          />

          {/* Paid Leave (IMMUTABLE on version) */}
          <label className="flex justify-between items-center">
            Paid Leave
            <Switch
              checked={form.is_paid}
              disabled={isVersion}
              onCheckedChange={(v) =>
                !isVersion &&
                setForm({
                  ...form,
                  is_paid: v,
                  accrual_rate: "",
                  annual_limit: "",
                })
              }
            />
          </label>

          {isVersion && (
            <p className="text-xs text-muted-foreground">
              Paid / unpaid status is immutable. A new version
              preserves payroll history.
            </p>
          )}

          {/* Paid Leave Rules */}
          {form.is_paid && (
            <>
              <Input
                type="number"
                min="0"
                step="0.5"
                placeholder="Accrual rate (days per month)"
                value={form.accrual_rate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accrual_rate: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                min="0"
                step="0.5"
                placeholder="Annual limit (days)"
                value={form.annual_limit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    annual_limit: e.target.value,
                  })
                }
              />

              <label className="flex justify-between items-center">
                Allow Half Day
                <Switch
                  checked={form.allow_half_day}
                  onCheckedChange={(v) =>
                    setForm({
                      ...form,
                      allow_half_day: v,
                    })
                  }
                />
              </label>
            </>
          )}

          {/* Approval */}
          <label className="flex justify-between items-center">
            Requires Approval
            <Switch
              checked={form.requires_approval}
              onCheckedChange={(v) =>
                setForm({
                  ...form,
                  requires_approval: v,
                })
              }
            />
          </label>

          {/* Validation error */}
          {error && (
            <div className="text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={submit}>
              {isVersion ? "Create Version" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
