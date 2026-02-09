"use client";

import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function DeleteDocumentDialog({
  open,
  onOpenChange,
  document,
  employeeId,
  onSuccess,
}) {
  const mutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(
        `/api/v1/employees/${employeeId}/documents/${document.id}`
      );
    },
    onSuccess: () => {
      toast.success("Document deleted successfully");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to delete document";
      toast.error(message);
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{document.name}</strong> will be permanently deleted.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Document"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}