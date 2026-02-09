"use client";

import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function DeleteAnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSuccess,
}) {
  const mutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/announcements/${id}`);
    },
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to delete announcement";
      toast.error(message);
    },
  });

  const handleDelete = () => {
    if (announcement?.id) {
      mutation.mutate(announcement.id);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this announcement?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {announcement && (
          <div className="my-4 p-4 rounded-lg bg-muted/50 border">
            <p className="font-medium text-sm mb-1">{announcement.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {announcement.content}
            </p>
          </div>
        )}

        <AlertDialogDescription className="text-sm text-muted-foreground">
          This action cannot be undone. The announcement will be permanently
          removed from the system.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}