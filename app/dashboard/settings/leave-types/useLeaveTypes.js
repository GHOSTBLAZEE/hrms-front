import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "@/lib/handleApiError";
import { leaveApi } from "@/lib/leaveApi";

export function useLeaveTypes({ includeInactive = false } = {}) {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["leave-types", { includeInactive }],
    queryFn: () =>
      leaveApi.listTypes({ includeInactive }),
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["leave-types"] });

  const create = useMutation({
    mutationFn: leaveApi.createType,
    onSuccess: invalidate,
    onError: handleApiError,
  });

  const update = useMutation({
    mutationFn: leaveApi.updateType,
    onSuccess: invalidate,
    onError: handleApiError,
  });

  const remove = useMutation({
    mutationFn: leaveApi.deleteType,
    onSuccess: invalidate,
    onError: handleApiError,
  });

  return { list, create, update, remove };
}
