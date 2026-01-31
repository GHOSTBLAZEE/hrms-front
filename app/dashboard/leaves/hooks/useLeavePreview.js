"use client";

import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Preview leave calculation before submitting
 * 
 * Request:
 * {
 *   "leave_type_id": 1,
 *   "start_date": "2026-01-30",
 *   "end_date": "2026-01-30",
 *   "half_day": false
 * }
 * 
 * Response:
 * {
 *   "days": 1,
 *   "start_date": "2026-01-30",
 *   "end_date": "2026-01-30",
 *   "available_before": 12,
 *   "available_after": 11,
 *   "allowed": true
 * }
 */
export function useLeavePreview() {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post("/api/v1/leaves/preview", payload);
      return res.data;
    },
    onError: (error) => {
      console.error("Leave preview error:", error.response?.data);
    },
  });
}