import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftsApi } from "@/lib/api/shiftApi";
import { toast } from "sonner";
import { QUERY_CONFIGS } from "@/config/queryConfig";

/* ----------------------------------------------------------------
 | Query keys
 |----------------------------------------------------------------*/
export const shiftKeys = {
  all:       ["shifts"],
  lists:     ()     => [...shiftKeys.all, "list"],
  list:      (filters) => [...shiftKeys.lists(), { filters }],
  details:   ()     => [...shiftKeys.all, "detail"],
  detail:    (id)   => [...shiftKeys.details(), id],
  employees: (id)   => [...shiftKeys.all, "employees", id],
};

/* ----------------------------------------------------------------
 | Get all shifts with metrics
 |----------------------------------------------------------------*/
export function useShifts(params = {}) {
  return useQuery({
    queryKey: shiftKeys.list(params),
    queryFn: () => shiftsApi.getShifts(params),
    // FIX: use shared QUERY_CONFIGS instead of inline staleTime
    ...QUERY_CONFIGS.INFREQUENT,
    select: (data) => ({
      shifts: data.data || [],
      metrics: data.metrics || {
        total_employees:      0,
        assigned_employees:   0,
        unassigned_employees: 0,
        active_shifts:        0,
        total_shifts:         0,
        assignment_rate:      0,
      },
      meta: data.meta || {},
    }),
  });
}

/* ----------------------------------------------------------------
 | Get single shift
 |----------------------------------------------------------------*/
export function useShift(id) {
  return useQuery({
    queryKey: shiftKeys.detail(id),
    queryFn: () => shiftsApi.getShift(id),
    enabled: !!id,
    ...QUERY_CONFIGS.INFREQUENT,
  });
}

/* ----------------------------------------------------------------
 | Get employees assigned to a shift
 |----------------------------------------------------------------*/
export function useShiftEmployees(shiftId, params = {}) {
  return useQuery({
    queryKey: shiftKeys.employees(shiftId),
    queryFn: () => shiftsApi.getShiftEmployees(shiftId, params),
    enabled: !!shiftId,
    ...QUERY_CONFIGS.INFREQUENT,
  });
}

/* ----------------------------------------------------------------
 | Create shift
 |----------------------------------------------------------------*/
export function useCreateShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => shiftsApi.createShift(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shiftKeys.all });
      toast.success("Shift created successfully");
    },
    onError: () => {
      toast.error("Failed to create shift");
    },
  });
}

/* ----------------------------------------------------------------
 | Update shift
 |----------------------------------------------------------------*/
export function useUpdateShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => shiftsApi.updateShift(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shiftKeys.all });
      toast.success("Shift updated successfully");
    },
    onError: () => {
      toast.error("Failed to update shift");
    },
  });
}

/* ----------------------------------------------------------------
 | Delete shift
 |----------------------------------------------------------------*/
export function useDeleteShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => shiftsApi.deleteShift(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shiftKeys.all });
      toast.success("Shift deleted");
    },
    onError: () => {
      toast.error("Failed to delete shift. Ensure no employees are assigned.");
    },
  });
}