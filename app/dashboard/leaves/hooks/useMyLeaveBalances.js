"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

/**
 * Fetch employee's leave balances for current year
 * 
 * API Response Structure:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "leave_type": { "id": 1, "name": "Casual Leave", "code": "CL" },
 *       "year": 2026,
 *       "total": 12,      // This is 'accrued' from backend
 *       "used": 3,
 *       "pending": 1,
 *       "available": 8    // Calculated by backend
 *     }
 *   ]
 * }
 */
async function fetchMyLeaveBalances() {
  const res = await apiClient.get("/api/v1/leaves/balances");
  return res.data.data || [];
}

export function useMyLeaveBalances() {
  return useQuery({
    queryKey: ["leave-balances"],
    queryFn: fetchMyLeaveBalances,
    staleTime: 30000, // 30 seconds - balances don't change frequently
  });
}