import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/departmentApi";
import { toast } from "sonner";

export function useDepartments() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["departments"],
    queryFn: api.getDepartmentsApi,
  });

  const create = useMutation({
    mutationFn: api.createDepartmentApi,
    onSuccess: () => {
      toast.success("Department created");
      qc.invalidateQueries(["departments"]);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => api.updateDepartmentApi(id, data),
    onSuccess: () => {
      toast.success("Department updated");
      qc.invalidateQueries(["departments"]);
    },
  });

  const remove = useMutation({
    mutationFn: api.deleteDepartmentApi,
    onSuccess: () => {
      toast.success("Department deleted");
      qc.invalidateQueries(["departments"]);
    },
  });

  return { ...q, create, update, remove };
}
