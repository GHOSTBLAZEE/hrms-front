"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

async function fetchMyLeaveBalances() {
  const res = await apiClient.get("/api/v1/me/leave-balances");
  return res.data;
}

export function useMyLeaveBalances() {
  return useQuery({
    queryKey: ["my-leave-balances"],
    queryFn: fetchMyLeaveBalances,
  });
}
