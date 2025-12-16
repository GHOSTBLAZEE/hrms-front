import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/locationApi";
import { toast } from "sonner";

export function useLocations() {
  const qc = useQueryClient();

  const q = useQuery({ queryKey: ["locations"], queryFn: api.getLocationsApi });

  const create = useMutation({
    mutationFn: api.createLocationApi,
    onSuccess: () => {
      toast.success("Location created");
      qc.invalidateQueries(["locations"]);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => api.updateLocationApi(id, data),
    onSuccess: () => {
      toast.success("Location updated");
      qc.invalidateQueries(["locations"]);
    },
  });

  const remove = useMutation({
    mutationFn: api.deleteLocationApi,
    onSuccess: () => {
      toast.success("Location deleted");
      qc.invalidateQueries(["locations"]);
    },
  });

  return { ...q, create, update, remove };
}
