"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

const trainingSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  provider: z.string()
    .min(2, "Provider name is required")
    .max(100, "Provider name must not exceed 100 characters"),
  description: z.string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date().optional().nullable(),
  duration_hours: z.string()
    .optional()
    .transform(val => val === "" ? null : Number(val))
    .refine(val => val === null || (!isNaN(val) && val >= 0), "Duration must be a positive number"),
  cost: z.string()
    .optional()
    .transform(val => val === "" ? null : Number(val))
    .refine(val => val === null || (!isNaN(val) && val >= 0), "Cost must be a positive number"),
  completion_date: z.date().optional().nullable(),
  certificate_url: z.string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
}).refine((data) => {
  if (data.end_date && data.start_date) {
    return data.end_date >= data.start_date;
  }
  return true;
}, {
  message: "End date must be on or after start date",
  path: ["end_date"],
}).refine((data) => {
  if (data.status === "completed" && !data.completion_date) {
    return false;
  }
  return true;
}, {
  message: "Completion date is required for completed trainings",
  path: ["completion_date"],
});

export function EditTrainingModal({ open, onOpenChange, employeeId, training }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(trainingSchema),
  });

  const watchStatus = watch("status");
  const watchStartDate = watch("start_date");
  const watchEndDate = watch("end_date");
  const watchCompletionDate = watch("completion_date");

  // Populate form with existing training data
  useEffect(() => {
    if (training && open) {
      reset({
        title: training.title || "",
        provider: training.provider || "",
        description: training.description || "",
        status: training.status || "scheduled",
        start_date: training.start_date ? new Date(training.start_date) : new Date(),
        end_date: training.end_date ? new Date(training.end_date) : null,
        duration_hours: training.duration_hours?.toString() || "",
        cost: training.cost?.toString() || "",
        completion_date: training.completion_date ? new Date(training.completion_date) : null,
        certificate_url: training.certificate_url || "",
      });
    }
  }, [training, open, reset]);

  const updateTrainingMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put(
        `/api/v1/employees/${employeeId}/trainings/${training.id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["trainings", employeeId]);
      toast.success("The training program has been updated successfully",);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred while updating the training");
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const formattedData = {
        title: data.title,
        provider: data.provider,
        description: data.description || null,
        status: data.status,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date ? data.end_date.toISOString() : null,
        duration_hours: data.duration_hours,
        cost: data.cost,
        completion_date: data.completion_date ? data.completion_date.toISOString() : null,
        certificate_url: data.certificate_url || null,
      };

      await updateTrainingMutation.mutateAsync(formattedData);
    } catch (error) {
      console.error("Error updating training:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Training Program</DialogTitle>
          <DialogDescription className="text-base">
            Update the training program details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Training Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Advanced React Development"
              className={cn("text-base", errors.title && "border-red-500")}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provider */}
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-base font-medium">
                Training Provider <span className="text-red-500">*</span>
              </Label>
              <Input
                id="provider"
                placeholder="e.g., Udemy, Coursera"
                className={cn("text-base", errors.provider && "border-red-500")}
                {...register("provider")}
              />
              {errors.provider && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.provider.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watchStatus}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-base",
                      !watchStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchStartDate ? format(watchStartDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchStartDate}
                    onSelect={(date) => setValue("start_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-base font-medium">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-base",
                      !watchEndDate && "text-muted-foreground",
                      errors.end_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchEndDate ? format(watchEndDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchEndDate}
                    onSelect={(date) => setValue("end_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.end_date && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Hours */}
            <div className="space-y-2">
              <Label htmlFor="duration_hours" className="text-base font-medium">
                Duration (hours)
              </Label>
              <Input
                id="duration_hours"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g., 40"
                className="text-base"
                {...register("duration_hours")}
              />
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <Label htmlFor="cost" className="text-base font-medium">
                Cost ($)
              </Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 299"
                className="text-base"
                {...register("cost")}
              />
            </div>
          </div>

          {/* Completion Date */}
          {watchStatus === "completed" && (
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Completion Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-base",
                      !watchCompletionDate && "text-muted-foreground",
                      errors.completion_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchCompletionDate ? format(watchCompletionDate, "PPP") : "Pick completion date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchCompletionDate}
                    onSelect={(date) => setValue("completion_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.completion_date && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.completion_date.message}
                </p>
              )}
            </div>
          )}

          {/* Certificate URL */}
          <div className="space-y-2">
            <Label htmlFor="certificate_url" className="text-base font-medium">
              Certificate URL
            </Label>
            <Input
              id="certificate_url"
              type="url"
              placeholder="https://example.com/certificate.pdf"
              className={cn("text-base", errors.certificate_url && "border-red-500")}
              {...register("certificate_url")}
            />
            {errors.certificate_url && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.certificate_url.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the training program..."
              className="min-h-[120px] text-base resize-none"
              {...register("description")}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Training
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}