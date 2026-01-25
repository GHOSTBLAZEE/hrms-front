import apiClient from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useApprovalStatus(module) {
  const queryClient = useQueryClient();

  const toggle = useMutation({
    mutationFn: async (isActive) => {
      const res = await apiClient.patch(
        `/api/v1/approval-templates/${module}/status`,
        { is_active: isActive }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["approval-template", module]);
    },
  });

  return {
    setActive: () => toggle.mutate(true),
    setDraft: () => toggle.mutate(false),
    isUpdating: toggle.isPending,
  };
}