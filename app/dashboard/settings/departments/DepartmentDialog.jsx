"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function DepartmentDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      status: "active",
    },
  });

  // 🔁 Reset form when editing / creating
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name ?? "",
        code: initialData.code ?? "",
        status: initialData.status ?? "active",
      });
    } else {
      reset({
        name: "",
        code: "",
        status: "active",
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (data) => {
    await onSubmit(data);
    reset(); // cleanup after submit
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Department" : "Create Department"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-4"
        >
          <Input
            placeholder="Department name"
            {...register("name", { required: true })}
          />

          <Input
            placeholder="Code"
            {...register("code")}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
