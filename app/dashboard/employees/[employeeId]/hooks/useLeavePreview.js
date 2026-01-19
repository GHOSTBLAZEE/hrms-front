import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useLeavePreview() {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post(
        "/api/v1/leaves/preview",
        payload
      );
      return res.data;
    },
  });
}
