"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  Info, 
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { useLeaveTypes } from "./useLeaveTypes";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
  name: "",
  code: "",
  is_paid: true,
  requires_approval: true,
  accrual_rate: "",
  annual_limit: "",
  allow_half_day: false,
  allow_carry_forward: false,
  max_carry_forward: "",
};

export default function LeaveTypeDialog({
  open,
  onClose,
  initialData = null,
}) {
  const { create, update } = useLeaveTypes();
  const isVersion = !!initialData;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
        allow_carry_forward: initialData.allow_carry_forward ?? false,
        max_carry_forward: initialData.max_carry_forward ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
    setTouched({});
  }, [initialData, open]);

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Required";
    }

    if (!form.code.trim()) {
      newErrors.code = "Required";
    } else if (form.code.length > 10) {
      newErrors.code = "Max 10 chars";
    }

    if (form.is_paid) {
      if (!form.accrual_rate || Number(form.accrual_rate) <= 0) {
        newErrors.accrual_rate = "Must be > 0";
      }

      if (!form.annual_limit || Number(form.annual_limit) <= 0) {
        newErrors.annual_limit = "Must be > 0";
      }

      if (form.allow_carry_forward && form.max_carry_forward) {
        if (Number(form.max_carry_forward) > Number(form.annual_limit)) {
          newErrors.max_carry_forward = "Cannot exceed annual limit";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  const handleSubmit = () => {
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validate()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      requires_approval: form.requires_approval,
      allow_half_day: form.allow_half_day,
      accrual_rate: form.is_paid ? Number(form.accrual_rate) : null,
      annual_limit: form.is_paid ? Number(form.annual_limit) : null,
      allow_carry_forward: form.is_paid ? form.allow_carry_forward : false,
      max_carry_forward: form.is_paid && form.allow_carry_forward && form.max_carry_forward
        ? Number(form.max_carry_forward)
        : null,
    };

    const mutation = isVersion ? update : create;

    mutation.mutate(
      isVersion
        ? { id: initialData.id, ...payload }
        : { ...payload, is_paid: form.is_paid },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM);
          setErrors({});
          setTouched({});
          onClose();
        },
      }
    );
  };

  const isLoading = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] p-0 gap-0 overflow-hidden">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-blue-50/50">
          <div className="flex items-center gap-3">
            {isVersion && (
              <Badge variant="outline" className="font-normal text-xs">
                New Version
              </Badge>
            )}
            <div>
              <DialogTitle className="text-lg font-semibold">
                {isVersion ? `New Version: ${initialData?.name}` : "Add Leave Type"}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {isVersion ? "Update configuration" : "Configure new leave type"}
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-8rem)] px-6 py-4">
          <div className="space-y-4">
            {/* Basic Info - Two Column */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Leave Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Casual Leave"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={() => handleBlur('name')}
                  className={cn("h-9 text-sm", errors.name && touched.name && "border-red-500")}
                />
                {errors.name && touched.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-xs font-semibold">
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="e.g. CL"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  onBlur={() => handleBlur('code')}
                  className={cn("h-9 text-sm font-mono", errors.code && touched.code && "border-red-500")}
                  maxLength={10}
                />
                {errors.code && touched.code && (
                  <p className="text-xs text-red-600">{errors.code}</p>
                )}
              </div>
            </div>

            {/* Paid/Unpaid Toggle - Compact */}
            <div className="flex items-center justify-between p-3 rounded-md border bg-slate-50/50">
              <div className="flex-1">
                <Label htmlFor="is_paid" className="text-xs font-semibold">
                  Paid Leave
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {form.is_paid ? "Paid with balance tracking" : "Unpaid (LOP)"}
                </p>
              </div>
              <Switch
                id="is_paid"
                checked={form.is_paid}
                disabled={isVersion}
                onCheckedChange={(v) => setForm({ ...form, is_paid: v })}
              />
            </div>

            {isVersion && (
              <Alert className="py-2">
                <Info className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  Paid/unpaid cannot be changed in new version
                </AlertDescription>
              </Alert>
            )}

            {/* Paid Leave Configuration */}
            {form.is_paid && (
              <>
                <Separator className="my-3" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Paid Leave Configuration
                  </div>

                  {/* Accrual & Limit - Two Column */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="accrual_rate" className="text-xs font-semibold">
                        Accrual/Month <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="accrual_rate"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="1"
                        value={form.accrual_rate}
                        onChange={(e) => setForm({ ...form, accrual_rate: e.target.value })}
                        onBlur={() => handleBlur('accrual_rate')}
                        className={cn("h-9 text-sm", errors.accrual_rate && touched.accrual_rate && "border-red-500")}
                      />
                      {errors.accrual_rate && touched.accrual_rate && (
                        <p className="text-xs text-red-600">{errors.accrual_rate}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="annual_limit" className="text-xs font-semibold">
                        Annual Limit <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="annual_limit"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="12"
                        value={form.annual_limit}
                        onChange={(e) => setForm({ ...form, annual_limit: e.target.value })}
                        onBlur={() => handleBlur('annual_limit')}
                        className={cn("h-9 text-sm", errors.annual_limit && touched.annual_limit && "border-red-500")}
                      />
                      {errors.annual_limit && touched.annual_limit && (
                        <p className="text-xs text-red-600">{errors.annual_limit}</p>
                      )}
                    </div>
                  </div>

                  {/* Toggles - Compact Two Column */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2.5 rounded-md border bg-white">
                      <Label htmlFor="allow_half_day" className="text-xs font-medium cursor-pointer">
                        Half Day
                      </Label>
                      <Switch
                        id="allow_half_day"
                        checked={form.allow_half_day}
                        onCheckedChange={(v) => setForm({ ...form, allow_half_day: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-md border bg-white">
                      <Label htmlFor="allow_carry_forward" className="text-xs font-medium cursor-pointer">
                        Carry Forward
                      </Label>
                      <Switch
                        id="allow_carry_forward"
                        checked={form.allow_carry_forward}
                        onCheckedChange={(v) => setForm({ ...form, allow_carry_forward: v })}
                      />
                    </div>
                  </div>

                  {/* Max Carry Forward - Conditional */}
                  {form.allow_carry_forward && (
                    <div className="space-y-1.5">
                      <Label htmlFor="max_carry_forward" className="text-xs font-semibold">
                        Max Carry Forward (optional)
                      </Label>
                      <Input
                        id="max_carry_forward"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Leave empty for no limit"
                        value={form.max_carry_forward}
                        onChange={(e) => setForm({ ...form, max_carry_forward: e.target.value })}
                        onBlur={() => handleBlur('max_carry_forward')}
                        className={cn("h-9 text-sm", errors.max_carry_forward && touched.max_carry_forward && "border-red-500")}
                      />
                      {errors.max_carry_forward && touched.max_carry_forward && (
                        <p className="text-xs text-red-600">{errors.max_carry_forward}</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Requires Approval */}
            <Separator className="my-3" />
            
            <div className="flex items-center justify-between p-3 rounded-md border bg-slate-50/50">
              <div className="flex-1">
                <Label htmlFor="requires_approval" className="text-xs font-semibold">
                  Requires Approval
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manager approval needed
                </p>
              </div>
              <Switch
                id="requires_approval"
                checked={form.requires_approval}
                onCheckedChange={(v) => setForm({ ...form, requires_approval: v })}
              />
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t bg-slate-50">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            size="sm"
            className="h-9"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            size="sm"
            className="h-9 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isVersion ? "Create Version" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}