"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditProfileForm({ employee, onClose }) {
  const qc = useQueryClient();

  const [form, setForm] = useState({
    phone: employee.phone || "",
    emergency_contact: employee.emergency_contact || "",
    status: employee.status,
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.put(`api/v1/employees/${employee.id}`, form),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries(["employee", employee.id]);
      onClose();
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  return (
    <div className="border rounded-md p-4 space-y-4">
      <Input
        label="Phone"
        value={form.phone}
        onChange={(v) =>
          setForm({ ...form, phone: v })
        }
      />

      <Input
        label="Emergency Contact"
        value={form.emergency_contact}
        onChange={(v) =>
          setForm({ ...form, emergency_contact: v })
        }
      />

      <div className="flex gap-2">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isLoading}
        >
          Save
        </Button>

        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">
        {label}
      </label>
      <input
        className="border rounded px-2 py-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}