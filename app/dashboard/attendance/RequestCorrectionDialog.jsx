"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Clock, Calendar as CalendarIcon, Info } from "lucide-react";

export default function RequestCorrectionDialog({
  open,
  onClose,
  attendance,
  onSubmit,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    correction_type: "",
    punch_type: "",
    time: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});

  const correctionTypes = [
    { value: "missed_punch", label: "Missed Punch" },
    { value: "wrong_time", label: "Wrong Time" },
    { value: "forgot_punch_out", label: "Forgot to Punch Out" },
    { value: "forgot_punch_in", label: "Forgot to Punch In" },
    { value: "system_error", label: "System Error" },
  ];

  const punchTypes = [
    { value: "IN", label: "Punch In" },
    { value: "OUT", label: "Punch Out" },
  ];

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

    if (!formData.date) {
      newErrors.date = "Required";
    }

    if (!formData.correction_type) {
      newErrors.correction_type = "Required";
    }

    if (!formData.punch_type) {
      newErrors.punch_type = "Required";
    }

    if (!formData.time) {
      newErrors.time = "Required";
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = "Min 10 characters required";
    }

    // Check if attendance ID is available
    if (!attendance?.id) {
      newErrors.general = "Attendance record not found";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    // Build payload with correct field names for backend
    const payload = {
      attendance_id: attendance.id,
      reason: formData.reason,
    };

    // Map punch_type to the correct backend field
    if (formData.punch_type === "IN") {
      payload.requested_check_in = formData.time; // Backend expects H:i format
    } else if (formData.punch_type === "OUT") {
      payload.requested_check_out = formData.time;
    }

    console.log("Submitting correction payload:", payload); // Debug log

    onSubmit(payload);
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      correction_type: "",
      punch_type: "",
      time: "",
      reason: "",
    });
    setErrors({});
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Request Correction
          </DialogTitle>
          <DialogDescription className="text-xs">
            Submit an attendance correction request for manager approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* General Error */}
          {errors.general && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-medium flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={`h-9 text-sm ${errors.date ? "border-red-500" : ""}`}
              />
              {errors.date && (
                <p className="text-[10px] text-red-600">{errors.date}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="time" className="text-xs font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className={`h-9 text-sm ${errors.time ? "border-red-500" : ""}`}
              />
              {errors.time && (
                <p className="text-[10px] text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Correction Type & Punch Type Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="correction_type" className="text-xs font-medium">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.correction_type}
                onValueChange={(value) => handleChange("correction_type", value)}
              >
                <SelectTrigger
                  id="correction_type"
                  className={`h-9 text-sm ${errors.correction_type ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {correctionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-sm">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.correction_type && (
                <p className="text-[10px] text-red-600">{errors.correction_type}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="punch_type" className="text-xs font-medium">
                Punch <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.punch_type}
                onValueChange={(value) => handleChange("punch_type", value)}
              >
                <SelectTrigger
                  id="punch_type"
                  className={`h-9 text-sm ${errors.punch_type ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {punchTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-sm">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.punch_type && (
                <p className="text-[10px] text-red-600">{errors.punch_type}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-medium">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder="Provide a detailed explanation (min 10 characters)..."
              rows={3}
              className={`text-sm resize-none ${errors.reason ? "border-red-500" : ""}`}
            />
            <div className="flex items-center justify-between">
              {errors.reason ? (
                <p className="text-[10px] text-red-600">{errors.reason}</p>
              ) : (
                <span />
              )}
              <p className="text-[10px] text-muted-foreground">
                {formData.reason.length} chars
              </p>
            </div>
          </div>

          {/* Compact Info */}
          <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-md">
            <Info className="h-3.5 w-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Request will be sent to your manager for approval
            </p>
          </div>

          {/* Debug Info (Remove in production) */}
          {process.env.NODE_ENV === 'development' && attendance?.id && (
            <div className="text-[10px] text-muted-foreground">
              Attendance ID: {attendance.id}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-9 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !attendance?.id}
            className="h-9 text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}