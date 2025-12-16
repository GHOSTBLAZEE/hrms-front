import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeesApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from "@/lib/employeeApi";
import { toast } from "sonner";

export function useEmployees() {
  const qc = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployeesApi,
  });

  const create = useMutation({
    mutationFn: createEmployeeApi,
    onSuccess: () => {
      toast.success("Employee created");
      qc.invalidateQueries(["employees"]);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => updateEmployeeApi(id, data),
    onSuccess: () => {
      toast.success("Employee updated");
      qc.invalidateQueries(["employees"]);
    },
  });

  const remove = useMutation({
    mutationFn: deleteEmployeeApi,
    onSuccess: () => {
      toast.success("Employee deleted");
      qc.invalidateQueries(["employees"]);
    },
  });

  return {
    ...employeesQuery,
    create,
    update,
    remove,
  };
}
