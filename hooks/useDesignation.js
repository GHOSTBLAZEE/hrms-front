import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/designationApi";
import { toast } from "sonner";

export function useDesignations() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["designations"],
    queryFn: api.getDesignationsApi,
  });

  const create = useMutation({
    mutationFn: api.createDesignationApi,
    onSuccess: () => {
      toast.success("Designation created");
      qc.invalidateQueries(["designations"]);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => api.updateDesignationApi(id, data),
    onSuccess: () => {
      toast.success("Designation updated");
      qc.invalidateQueries(["designations"]);
    },
  });

  const remove = useMutation({
    mutationFn: api.deleteDesignationApi,
    onSuccess: () => {
      toast.success("Designation deleted");
      qc.invalidateQueries(["designations"]);
    },
  });

  return { ...q, create, update, remove };
}
