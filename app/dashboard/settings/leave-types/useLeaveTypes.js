"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveApi } from "@/lib/leaveApi";

export function useLeaveTypes() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["leave-types"],
    queryFn: () => leaveApi.listTypes().then(r => r.data),
  });

  const create = useMutation({
    mutationFn: leaveApi.createType,
    onSuccess: () => qc.invalidateQueries(["leave-types"]),
  });

  const update = useMutation({
    mutationFn: leaveApi.updateType,
    onSuccess: () => qc.invalidateQueries(["leave-types"]),
  });

  const remove = useMutation({
    mutationFn: leaveApi.deleteType,
    onSuccess: () => qc.invalidateQueries(["leave-types"]),
  });

  return { list, create, update, remove };
}
