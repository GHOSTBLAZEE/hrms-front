import apiClient from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useSaveApprovalTemplate(module) {
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.put(
        `/api/v1/approval-templates/${module}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["approval-template", module]);
    },
  });

  return {
    saveTemplate: save.mutate,
    isSaving: save.isPending,
  };
}