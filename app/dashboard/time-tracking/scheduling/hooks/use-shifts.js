// hooks/use-shifts.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { shiftsApi } from "@/lib/api/shiftApi"
import { toast } from "sonner"

// Query keys
export const shiftKeys = {
  all: ["shifts"],
  lists: () => [...shiftKeys.all, "list"],
  list: (filters) => [...shiftKeys.lists(), { filters }],
  details: () => [...shiftKeys.all, "detail"],
  detail: (id) => [...shiftKeys.details(), id],
  employees: (id) => [...shiftKeys.all, "employees", id],
}

// Get all shifts with metrics
export function useShifts(params = {}) {
  return useQuery({
    queryKey: shiftKeys.list(params),
    queryFn: () => shiftsApi.getShifts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => ({
      shifts: data.data || [],
      metrics: data.metrics || {
        total_employees: 0,
        assigned_employees: 0,
        unassigned_employees: 0,
        active_shifts: 0,
        total_shifts: 0,
        assignment_rate: 0,
      },
      meta: data.meta || {},
    }),
  })
}

// Get single shift
export function useShift(id) {
  return useQuery({
    queryKey: shiftKeys.detail(id),
    queryFn: () => shiftsApi.getShift(id),
    enabled: !!id,
  })
}

// Create shift
export function useCreateShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: shiftsApi.createShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() })
      toast.success("Shift created successfully")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create shift")
    },
  })
}

// Update shift
export function useUpdateShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => shiftsApi.updateShift(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() })
      queryClient.invalidateQueries({ queryKey: shiftKeys.detail(id) })
      toast.success("Shift updated successfully")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update shift")
    },
  })
}

// Delete shift
export function useDeleteShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: shiftsApi.deleteShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() })
      toast.success("Shift deleted successfully")
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete shift"
      toast.error(message)
    },
  })
}

// Toggle shift status
export function useToggleShiftStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: shiftsApi.toggleStatus,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() })
      queryClient.invalidateQueries({ queryKey: shiftKeys.detail(id) })
      toast.success("Shift status updated")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status")
    },
  })
}

// Get shift employees
export function useShiftEmployees(id) {
  return useQuery({
    queryKey: shiftKeys.employees(id),
    queryFn: () => shiftsApi.getShiftEmployees(id),
    enabled: !!id,
  })
}