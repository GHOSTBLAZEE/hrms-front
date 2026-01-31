"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Fetch all active leave types
 * 
 * API Response Structure:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "Casual Leave",
 *       "code": "CL",
 *       "is_paid": true,
 *       "allow_half_day": true,
 *       "annual_limit": 12,
 *       "is_active": true
 *     }
 *   ]
 * }
 */
async function fetchLeaveTypes() {
  const res = await apiClient.get("/api/v1/leave-types");
  return res.data.data || [];
}

export function useLeaveTypes() {
  return useQuery({
    queryKey: ["leave-types"],
    queryFn: fetchLeaveTypes,
    staleTime: Infinity, // Leave types rarely change
  });
}