"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Fetch employee's leave history
 * 
 * API Response Structure:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "employee": { "id": 3, "name": "Employee", "code": "EMP-003" },
 *       "leave_type": { "id": 1, "name": "Casual Leave", "code": "CL" },
 *       "start_date": "2026-01-30",
 *       "end_date": "2026-01-30",
 *       "days": 1,
 *       "reason": "Personal work",
 *       "status": "approved",
 *       "current_step": null,
 *       "created_at": "2026-01-30T13:40:30.000000Z",
 *       "updated_at": "2026-01-30T13:42:08.000000Z"
 *     }
 *   ]
 * }
 */
async function fetchMyLeaves() {
  const res = await apiClient.get("/api/v1/leaves/mine");
  return res.data.data || [];
}

export function useMyLeaves() {
  return useQuery({
    queryKey: ["my-leaves"],
    queryFn: fetchMyLeaves,
    staleTime: 10000, // 10 seconds
  });
}