"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditProfileForm({
  employee,
  onSuccess,
}) {
  const qc = useQueryClient();

  const form = useForm({
    defaultValues: {
      phone: employee.phone ?? "",
      emergency_contact: employee.emergency_contact ?? "",
      status: employee.status,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      apiClient.put(
        `/api/v1/employees/${employee.id}`,
        data
      ),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries(["employee", employee.id]);
      onSuccess();
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(mutation.mutate)}
      className="space-y-4 mt-6"
    >
      <Field label="Phone">
        <input
          className="border rounded px-2 py-1 w-full"
          {...form.register("phone")}
        />
      </Field>

      <Field label="Emergency Contact">
        <input
          className="border rounded px-2 py-1 w-full"
          {...form.register("emergency_contact")}
        />
      </Field>

      <Field label="Status">
        <select
          className="border rounded px-2 py-1 w-full"
          {...form.register("status")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>
      </Field>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Saving…" : "Save"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
