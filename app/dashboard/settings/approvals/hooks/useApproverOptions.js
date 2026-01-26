
import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useApproverOptions() {
  const query = useQuery({
    queryKey: ["approver-options"],
    queryFn: async () => {
      const res = await apiClient("/api/v1/approval-approvers");
      return res.data;
    },
    onError: (err)=>{
      toast.error(err.response?.data?.message);
    }
  });


  return {
    users: query.data?.users ?? [],
    roles: query.data?.roles ?? [],
    loading: query.isLoading,
  };
}
