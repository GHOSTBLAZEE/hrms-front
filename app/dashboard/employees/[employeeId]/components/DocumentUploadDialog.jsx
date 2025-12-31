"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function DocumentUploadDialog({
  employeeId,
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("file", file);

      return apiClient.post(
        `/api/v1/employees/${employeeId}/documents`,
        fd
      );
    },
    onSuccess: () => {
      toast.success("Document uploaded");
      qc.invalidateQueries([
        "employee-documents",
        employeeId,
      ]);
      setOpen(false);
      setFile(null);
    },
  });

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Upload Document
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Upload Document
            </DialogTitle>
          </DialogHeader>

          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          <Button
            disabled={!file || mutation.isLoading}
            onClick={() => mutation.mutate()}
          >
            Upload
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
