"use client";

import { useState } from "react";
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
import { CalendarIcon, Loader2, AlertCircle, Info } from "lucide-react";
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
  training_type: z.enum(["internal", "external", "online", "workshop"]),
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
  score: z.string()
    .optional()
    .transform(val => val === "" ? null : Number(val))
    .refine(val => val === null || (!isNaN(val) && val >= 0 && val <= 100), "Score must be between 0 and 100"),
  feedback: z.string()
    .max(1000, "Feedback must not exceed 1000 characters")
    .optional(),
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

export function AddTrainingModal({ open, onOpenChange, employeeId, employeeName }) {
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
    defaultValues: {
      title: "",
      provider: "",
      description: "",
      training_type: "external",
      status: "scheduled",
      start_date: new Date(),
      end_date: null,
      duration_hours: "",
      cost: "",
      completion_date: null,
      certificate_url: "",
      score: "",
      feedback: "",
    },
  });

  const watchStatus = watch("status");
  const watchTrainingType = watch("training_type");
  const watchStartDate = watch("start_date");
  const watchEndDate = watch("end_date");
  const watchCompletionDate = watch("completion_date");

  const createTrainingMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(
        `/api/v1/employees/${employeeId}/trainings`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["trainings", employeeId]);
      toast.success("The training program has been added to the employee's record");
      reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred while adding the training program");
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const formattedData = {
        title: data.title,
        provider: data.provider,
        description: data.description || null,
        training_type: data.training_type,
        status: data.status,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date ? data.end_date.toISOString() : null,
        duration_hours: data.duration_hours,
        cost: data.cost,
        completion_date: data.completion_date ? data.completion_date.toISOString() : null,
        certificate_url: data.certificate_url || null,
        score: data.score,
        feedback: data.feedback || null,
      };

      await createTrainingMutation.mutateAsync(formattedData);
    } catch (error) {
      console.error("Error submitting training:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Training Program</DialogTitle>
          <DialogDescription className="text-base">
            Add a new training program for <span className="font-semibold text-gray-900">{employeeName}</span>
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
              placeholder="e.g., Advanced React Development, AWS Solutions Architect"
              className={cn("text-base", errors.title && "border-red-500 focus-visible:ring-red-500")}
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
                placeholder="e.g., Udemy, Coursera, LinkedIn Learning"
                className={cn("text-base", errors.provider && "border-red-500 focus-visible:ring-red-500")}
                {...register("provider")}
              />
              {errors.provider && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.provider.message}
                </p>
              )}
            </div>

            {/* Training Type */}
            <div className="space-y-2">
              <Label htmlFor="training_type" className="text-base font-medium">
                Training Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watchTrainingType}
                onValueChange={(value) => setValue("training_type", value)}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select training type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Helps categorize the training delivery method
              </p>
              {errors.training_type && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.training_type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {errors.status && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.status.message}
                </p>
              )}
            </div>

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
                className={cn("text-base", errors.duration_hours && "border-red-500 focus-visible:ring-red-500")}
                {...register("duration_hours")}
              />
              {errors.duration_hours && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.duration_hours.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      !watchStartDate && "text-muted-foreground",
                      errors.start_date && "border-red-500"
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
              {errors.start_date && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.start_date.message}
                </p>
              )}
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

            {/* Completion Date - Show if status is completed */}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={cn("text-base", errors.cost && "border-red-500 focus-visible:ring-red-500")}
                {...register("cost")}
              />
              {errors.cost && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.cost.message}
                </p>
              )}
            </div>

            {/* Score - Show if status is completed */}
            {watchStatus === "completed" && (
              <div className="space-y-2">
                <Label htmlFor="score" className="text-base font-medium">
                  Score (0-100)
                </Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 85"
                  className={cn("text-base", errors.score && "border-red-500 focus-visible:ring-red-500")}
                  {...register("score")}
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Optional assessment or evaluation score
                </p>
                {errors.score && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.score.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Certificate URL */}
          <div className="space-y-2">
            <Label htmlFor="certificate_url" className="text-base font-medium">
              Certificate URL
            </Label>
            <Input
              id="certificate_url"
              type="url"
              placeholder="https://example.com/certificate.pdf"
              className={cn("text-base", errors.certificate_url && "border-red-500 focus-visible:ring-red-500")}
              {...register("certificate_url")}
            />
            <p className="text-sm text-gray-500">
              Link to the digital certificate or completion proof
            </p>
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
              placeholder="Brief description of the training program, learning objectives, and outcomes..."
              className={cn("min-h-[100px] text-base resize-none", errors.description && "border-red-500 focus-visible:ring-red-500")}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Feedback - Show if status is completed */}
          {watchStatus === "completed" && (
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-base font-medium">
                Feedback
              </Label>
              <Textarea
                id="feedback"
                placeholder="Trainer feedback, employee impressions, or overall assessment..."
                className={cn("min-h-[100px] text-base resize-none", errors.feedback && "border-red-500 focus-visible:ring-red-500")}
                {...register("feedback")}
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Optional feedback from trainer or participant
              </p>
              {errors.feedback && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.feedback.message}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
              Add Training Program
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}