import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function ApprovalActions({ correction, onDone }) {
  const qc = useQueryClient();

  const approve = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/v1/attendance-corrections/${correction.id}/approve`),
    onSuccess: () => {
      toast.success("Attendance correction approved");
      qc.invalidateQueries(["attendance-corrections"]);
      onDone();
    },
  });

  const reject = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/v1/attendance-corrections/${correction.id}/reject`),
    onSuccess: () => {
      toast.error("Attendance correction rejected!");
      qc.invalidateQueries(["attendance-corrections"]);
      onDone();
    },
  });

  return (
    <div className="flex gap-2 mt-6">
      <Button onClick={() => approve.mutate()} disabled={approve.isLoading}>
        Approve
      </Button>

      <Button
        variant="destructive"
        onClick={() => reject.mutate()}
        disabled={reject.isLoading}
      >
        Reject
      </Button>
    </div>
  );
}
