"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { 
  Calendar, 
  AlertCircle, 
  Info, 
  FileText, 
  CheckCircle,
  TrendingUp,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApplyLeaveDialog({
  open,
  onClose,
  balances = [],
  leaveTypes = [],
  preselectedDate,
}) {
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    half_day: false,
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
        half_day: false,
      });
      setErrors({});
      setPreview(null);
    }
  }, [open]);

  // Set preselected date
  useEffect(() => {
    if (preselectedDate && open) {
      const dateStr = preselectedDate.toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        start_date: dateStr,
        end_date: dateStr,
      }));
    }
  }, [preselectedDate, open]);

  // Categorize leave types - memoized for performance
  const { paidLeaves, unpaidLeaves } = useMemo(() => {
    const paid = leaveTypes.filter(t => t.is_paid);
    const unpaid = leaveTypes.filter(t => !t.is_paid);
    return { paidLeaves: paid, unpaidLeaves: unpaid };
  }, [leaveTypes]);

  // Get balance info - memoized
  const getBalanceInfo = useMemo(() => {
    const balanceMap = new Map();
    balances.forEach(b => {
      balanceMap.set(b.leave_type?.id, {
        available: b.total - b.used - b.pending,
        total: b.total,
        used: b.used,
        pending: b.pending,
      });
    });
    
    return (leaveTypeId) => {
      return balanceMap.get(leaveTypeId) || { 
        available: 0, 
        total: 0, 
        used: 0, 
        pending: 0 
      };
    };
  }, [balances]);

  // Selected type and balance
  const selectedType = useMemo(() => 
    leaveTypes.find(t => t.id === parseInt(formData.leave_type_id)),
    [leaveTypes, formData.leave_type_id]
  );

  const selectedBalance = useMemo(() => 
    balances.find(b => b.leave_type?.id === parseInt(formData.leave_type_id)),
    [balances, formData.leave_type_id]
  );

  // Calculate leave preview - debounced
  useEffect(() => {
    if (!formData.leave_type_id || !formData.start_date || !formData.end_date) {
      setPreview(null);
      return;
    }

    const timer = setTimeout(() => {
      calculatePreview();
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [formData.leave_type_id, formData.start_date, formData.end_date, formData.half_day]);

  const calculatePreview = async () => {
    try {
      setIsCalculating(true);
      const res = await apiClient.post("/api/v1/leaves/preview", {
        leave_type_id: formData.leave_type_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        half_day: formData.half_day,
      });
      setPreview(res.data);
    } catch (error) {
      console.error("Preview calculation failed:", error);
      setPreview(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const applyMutation = useMutation({
    mutationFn: async (payload) => {
      return apiClient.post("/api/v1/leaves", payload);
    },
    onSuccess: () => {
      toast.success("Leave application submitted", {
        description: "Your request will be sent for approval",
      });
      qc.invalidateQueries(["my-leaves"]);
      qc.invalidateQueries(["leave-balances"]);
      onClose();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to submit leave application";
      toast.error("Application failed", {
        description: message,
      });
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.leave_type_id) {
      newErrors.leave_type_id = "Please select a leave type";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }

    // Check balance for paid leaves
    if (selectedType?.is_paid && preview) {
      const balanceInfo = getBalanceInfo(selectedType.id);
      
      if (preview.days > balanceInfo.available) {
        newErrors.leave_type_id = `Insufficient balance. Need ${preview.days} days but only ${balanceInfo.available} available.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    applyMutation.mutate(formData);
  };

  // Debug: Log when component renders
  console.log("ApplyLeaveDialog render:", {
    leaveTypesCount: leaveTypes.length,
    balancesCount: balances.length,
    paidCount: paidLeaves.length,
    unpaidCount: unpaidLeaves.length,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-blue-600" />
            Apply for Leave
          </DialogTitle>
          <DialogDescription className="text-sm">
            Submit a leave application for manager approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Debug Info (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <Alert className="bg-purple-50 border-purple-200">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-xs text-purple-900">
                <strong>Debug:</strong> {leaveTypes.length} leave types loaded, {balances.length} balances
              </AlertDescription>
            </Alert>
          )}

          {/* Leave Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Leave Type <span className="text-red-500">*</span>
            </Label>

            {leaveTypes.length === 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No leave types available. Please contact HR.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Paid Leaves */}
                {paidLeaves.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                      Paid Leaves
                    </p>
                    <div className="grid gap-2">
                      {paidLeaves.map((type) => {
                        const balanceInfo = getBalanceInfo(type.id);
                        const isSelected = formData.leave_type_id === type.id.toString();
                        const hasBalance = balanceInfo.available > 0;

                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => hasBalance && handleChange("leave_type_id", type.id.toString())}
                            disabled={!hasBalance}
                            className={cn(
                              "w-full p-4 rounded-lg border-2 text-left transition-all",
                              isSelected && "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
                              !isSelected && "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                              !hasBalance && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h4 className="font-semibold text-slate-900">{type.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {type.code}
                                  </Badge>
                                  {type.allow_half_day && (
                                    <Badge variant="secondary" className="text-xs">
                                      Half-day
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 flex-wrap">
                                  <span className={cn(
                                    "flex items-center gap-1",
                                    hasBalance ? "text-emerald-600" : "text-red-600"
                                  )}>
                                    <CheckCircle className="h-3 w-3" />
                                    Available: <strong>{balanceInfo.available}</strong>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-blue-500" />
                                    Total: {balanceInfo.total}
                                  </span>
                                  {balanceInfo.pending > 0 && (
                                    <span className="flex items-center gap-1 text-amber-600">
                                      <Clock className="h-3 w-3" />
                                      Pending: {balanceInfo.pending}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Unpaid Leaves */}
                {unpaidLeaves.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                      Unpaid Leaves
                    </p>
                    <div className="grid gap-2">
                      {unpaidLeaves.map((type) => {
                        const isSelected = formData.leave_type_id === type.id.toString();

                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handleChange("leave_type_id", type.id.toString())}
                            className={cn(
                              "w-full p-4 rounded-lg border-2 text-left transition-all",
                              isSelected && "border-amber-500 bg-amber-50 ring-2 ring-amber-200",
                              !isSelected && "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h4 className="font-semibold text-slate-900">{type.name}</h4>
                                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                                    {type.code}
                                  </Badge>
                                  <Badge variant="destructive" className="text-xs">
                                    Unpaid
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  No balance required - This leave will not be paid
                                </p>
                              </div>
                              
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {errors.leave_type_id && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.leave_type_id}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Leave Period</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-xs">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={cn(errors.start_date && "border-red-500")}
                />
                {errors.start_date && (
                  <p className="text-xs text-red-600">{errors.start_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-xs">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  min={formData.start_date || new Date().toISOString().split("T")[0]}
                  className={cn(errors.end_date && "border-red-500")}
                />
                {errors.end_date && (
                  <p className="text-xs text-red-600">{errors.end_date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Half Day Option */}
          {selectedType?.allow_half_day && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="half_day"
                checked={formData.half_day}
                onChange={(e) => handleChange("half_day", e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="half_day" className="cursor-pointer text-sm flex-1">
                This is a half-day leave
              </Label>
            </div>
          )}

          {/* Preview */}
          {isCalculating ? (
            <Alert className="border-slate-200 bg-slate-50">
              <Clock className="h-4 w-4 text-slate-600 animate-spin" />
              <AlertDescription className="text-sm text-slate-700">
                Calculating duration...
              </AlertDescription>
            </Alert>
          ) : preview && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                <div className="space-y-1">
                  <p>
                    <strong>Duration:</strong> {preview.days} day(s)
                  </p>
                  {selectedType?.is_paid && selectedBalance && (
                    <p>
                      <strong>Balance After:</strong>{" "}
                      {(selectedBalance.total - selectedBalance.used - selectedBalance.pending - preview.days).toFixed(1)} days
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-semibold">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder="Provide a detailed reason (minimum 10 characters)..."
              rows={4}
              className={cn("resize-none", errors.reason && "border-red-500")}
            />
            <div className="flex items-center justify-between">
              {errors.reason ? (
                <p className="text-xs text-red-600">{errors.reason}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-muted-foreground">
                {formData.reason.length} / 1000
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <FileText className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs text-blue-900">
              <strong>Note:</strong> Application will be sent to your manager. 
              Leave balance deducted only after approval.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={applyMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={applyMutation.isPending || !formData.leave_type_id || isCalculating}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            {applyMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}