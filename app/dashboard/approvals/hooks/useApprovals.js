"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Approvals inbox hook
 */
export function useApprovals({ status = "pending" }) {
  return useQuery({
    queryKey: ["approvals", status],
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/api/v1/approvals/inbox",
        { params: { status } }
      );

      // ✅ Backend already returns normalized DTOs - just sort them
      return data.sort(
        (a, b) =>
          new Date(b.submitted_at) - new Date(a.submitted_at)
      );
    },
    staleTime: 30_000,
  });
}