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
  CheckCircle2,
  Loader2,
  AlertTriangle,
  CalendarX
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
  const [previewError, setPreviewError] = useState(null);

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
      setPreviewError(null);
    }
  }, [open]);

  // Set preselected date - FIXED: Use local date formatting to avoid timezone shift
  useEffect(() => {
    if (preselectedDate && open) {
      const year = preselectedDate.getFullYear();
      const month = String(preselectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(preselectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      setFormData((prev) => ({
        ...prev,
        start_date: dateStr,
        end_date: dateStr,
      }));
    }
  }, [preselectedDate, open]);

  // Categorize leave types
  const { paidLeaves, unpaidLeaves } = useMemo(() => {
    const paid = leaveTypes.filter(t => t.is_paid);
    const unpaid = leaveTypes.filter(t => !t.is_paid);
    return { paidLeaves: paid, unpaidLeaves: unpaid };
  }, [leaveTypes]);

  // Get balance info
  const getBalanceInfo = useMemo(() => {
    const balanceMap = new Map();
    balances.forEach(b => {
      if (b.leave_type?.id) {
        balanceMap.set(b.leave_type.id, {
          available: parseFloat(b.total || 0) - parseFloat(b.used || 0) - parseFloat(b.pending || 0),
          total: parseFloat(b.total || 0),
          used: parseFloat(b.used || 0),
          pending: parseFloat(b.pending || 0),
        });
      }
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

  // Selected type
  const selectedType = useMemo(() => 
    leaveTypes.find(t => t.id === parseInt(formData.leave_type_id)),
    [leaveTypes, formData.leave_type_id]
  );

  // Calculate leave preview
  useEffect(() => {
    if (!formData.leave_type_id || !formData.start_date || !formData.end_date) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    const timer = setTimeout(() => {
      calculatePreview();
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.leave_type_id, formData.start_date, formData.end_date, formData.half_day]);

  const calculatePreview = async () => {
    // Validate required fields
    if (!formData.leave_type_id || !formData.start_date || !formData.end_date) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    // Validate date order BEFORE calling API
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    try {
      setIsCalculating(true);
      setPreviewError(null);
      
      const payload = {
        leave_type_id: parseInt(formData.leave_type_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        half_day: formData.half_day,
      };
      
      const res = await apiClient.post("/api/v1/leaves/preview", payload);
      setPreview(res.data);
      setPreviewError(null);
    } catch (error) {
      // Silently handle preview errors - don't log to console as these are expected
      // (e.g., overlapping leaves, validation errors are normal user scenarios)
      
      // Extract meaningful error message for UI display
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error ||
                          "Unable to calculate leave duration";
      
      setPreviewError(errorMessage);
      setPreview(null);
      
      // Only log unexpected errors (non-422 status codes)
      if (error?.response?.status && error.response.status !== 422) {
        console.error("Unexpected preview error:", error);
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const applyMutation = useMutation({
    mutationFn: async (payload) => {
      const requestPayload = {
        ...payload,
        leave_type_id: parseInt(payload.leave_type_id)
      };
      return apiClient.post("/api/v1/leaves", requestPayload);
    },
    onSuccess: () => {
      toast.success("Leave Application Submitted", {
        description: "Your leave request has been sent for approval"
      });
      qc.invalidateQueries(["my-leaves"]);
      qc.invalidateQueries(["leave-balances"]);
      onClose();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || 
        error?.response?.data?.error ||
        "Failed to submit leave application";
      
      toast.error("Submission Failed", { 
        description: message 
      });
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear related errors
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear preview error when user makes changes
    if (field === 'start_date' || field === 'end_date') {
      setPreviewError(null);
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
        newErrors.end_date = "End date must be on or after start date";
      }
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }

    // Check balance for paid leaves
    if (selectedType?.is_paid && preview) {
      const balanceInfo = getBalanceInfo(selectedType.id);
      
      if (preview.days > balanceInfo.available) {
        newErrors.leave_type_id = `Insufficient balance. Need ${preview.days} day${preview.days !== 1 ? 's' : ''} but only ${balanceInfo.available.toFixed(1)} available.`;
      }
    }

    // Don't allow submission if preview failed with overlap error
    if (previewError) {
      newErrors.general = previewError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    applyMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">Apply for Leave</div>
              <div className="text-xs font-normal text-muted-foreground mt-0.5">
                Submit your leave request for manager approval
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* General Error Alert */}
          {errors.general && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          {/* Leave Type Selection */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              Select Leave Type 
              <span className="text-red-500">*</span>
            </Label>

            {leaveTypes.length === 0 ? (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  No leave types configured. Please contact HR.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Paid Leaves */}
                {paidLeaves.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                      <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-2">
                        Paid Leaves
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                    </div>
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
                              "w-full p-3 rounded-lg border-2 text-left transition-all",
                              isSelected && "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100",
                              !isSelected && hasBalance && "border-slate-200 hover:border-blue-300 hover:bg-slate-50",
                              !hasBalance && "opacity-40 cursor-not-allowed bg-slate-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="font-semibold text-sm text-slate-900">
                                    {type.name}
                                  </span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 font-semibold">
                                    {type.code}
                                  </Badge>
                                  {type.allow_half_day && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-5">
                                      Half-day
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3 text-[11px]">
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Available:</span>
                                    <span className={cn(
                                      "font-semibold",
                                      hasBalance ? "text-emerald-600" : "text-red-600"
                                    )}>
                                      {balanceInfo.available.toFixed(1)}
                                    </span>
                                  </div>
                                  <span className="text-slate-300">|</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-medium text-slate-700">
                                      {balanceInfo.total.toFixed(1)}
                                    </span>
                                  </div>
                                  {balanceInfo.pending > 0 && (
                                    <>
                                      <span className="text-slate-300">|</span>
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">Pending:</span>
                                        <span className="font-medium text-amber-600">
                                          {balanceInfo.pending.toFixed(1)}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {isSelected && (
                                <div className="flex-shrink-0">
                                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                </div>
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
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                      <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider px-2">
                        Unpaid Leaves
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                    </div>
                    <div className="grid gap-2">
                      {unpaidLeaves.map((type) => {
                        const isSelected = formData.leave_type_id === type.id.toString();

                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handleChange("leave_type_id", type.id.toString())}
                            className={cn(
                              "w-full p-3 rounded-lg border-2 text-left transition-all",
                              isSelected && "border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-100",
                              !isSelected && "border-slate-200 hover:border-amber-300 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-slate-900">
                                    {type.name}
                                  </span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-amber-400 text-amber-700 font-semibold">
                                    {type.code}
                                  </Badge>
                                  <Badge className="text-[10px] px-1.5 py-0.5 h-5 bg-amber-500 hover:bg-amber-600">
                                    Unpaid
                                  </Badge>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                  No balance deduction • Unpaid leave
                                </p>
                              </div>
                              
                              {isSelected && (
                                <div className="flex-shrink-0">
                                  <CheckCircle2 className="h-5 w-5 text-amber-600" />
                                </div>
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
              <Alert variant="destructive" className="py-2 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-medium">
                  {errors.leave_type_id}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Leave Duration</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_date" className="text-xs text-muted-foreground font-medium">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={cn(
                    "text-sm h-10 border-2",
                    errors.start_date ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:border-blue-500"
                  )}
                />
                {errors.start_date && (
                  <p className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.start_date}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_date" className="text-xs text-muted-foreground font-medium">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  min={formData.start_date || new Date().toISOString().split("T")[0]}
                  className={cn(
                    "text-sm h-10 border-2",
                    errors.end_date ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:border-blue-500"
                  )}
                />
                {errors.end_date && (
                  <p className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.end_date}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Half Day Option */}
          {selectedType?.allow_half_day && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-100">
              <input
                type="checkbox"
                id="half_day"
                checked={formData.half_day}
                onChange={(e) => handleChange("half_day", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="half_day" className="cursor-pointer text-xs font-medium flex-1 text-slate-700">
                Apply as half-day leave
              </Label>
            </div>
          )}

          {/* Preview - IMPROVED with error handling */}
          {isCalculating ? (
            <Alert className="py-3 border-slate-300 bg-slate-50">
              <Loader2 className="h-4 w-4 text-slate-600 animate-spin" />
              <AlertDescription className="text-xs text-slate-700 font-medium">
                Calculating leave duration...
              </AlertDescription>
            </Alert>
          ) : previewError ? (
            <Alert variant="destructive" className="py-3 border-red-300 bg-red-50">
              <CalendarX className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs text-red-900 font-medium">
                <div className="font-semibold mb-0.5">Cannot apply leave</div>
                <div>{previewError}</div>
              </AlertDescription>
            </Alert>
          ) : preview && (
            <Alert className="py-3 border-emerald-300 bg-gradient-to-r from-emerald-50 to-blue-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-1.5 font-bold text-slate-900">
                      {preview.days} day{preview.days !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {selectedType?.is_paid && (
                    <>
                      <span className="text-slate-300">|</span>
                      <div>
                        <span className="text-muted-foreground">Balance after:</span>
                        <span className="ml-1.5 font-bold text-blue-600">
                          {(getBalanceInfo(selectedType.id).available - (preview.days || 0)).toFixed(1)} days
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-semibold">
              Reason for Leave <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder="Please provide a detailed reason for your leave request (minimum 10 characters)..."
              rows={4}
              className={cn(
                "resize-none text-sm border-2",
                errors.reason ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
              )}
              maxLength={1000}
            />
            <div className="flex items-center justify-between">
              {errors.reason ? (
                <p className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.reason}
                </p>
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  Provide clear details to help with approval
                </span>
              )}
              <p className={cn(
                "text-[10px] font-medium",
                formData.reason.length < 10 ? "text-amber-600" : "text-emerald-600"
              )}>
                {formData.reason.length}/1000
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <Alert className="py-3 border-blue-300 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-[11px] text-blue-900 font-medium leading-relaxed">
              <div className="font-semibold mb-1">Important Information:</div>
              <ul className="space-y-0.5 ml-1">
                <li>• Your request will be sent to your reporting manager for approval</li>
                <li>• Leave balance will only be deducted after final approval</li>
                <li>• You will receive notifications about status changes</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={applyMutation.isPending}
            className="h-10 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={applyMutation.isPending || !formData.leave_type_id || isCalculating || !!previewError}
            className="h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 min-w-[140px]"
          >
            {applyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}