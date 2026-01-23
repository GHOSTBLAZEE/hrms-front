"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

async function fetchMyLeaves() {
  const res = await apiClient.get("/api/v1/leaves");
  return res.data;
}

export function useMyLeaves() {
  return useQuery({
    queryKey: ["my-leaves"],
    queryFn: fetchMyLeaves,
  });
}
