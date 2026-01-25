import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";


export function useApprovalTemplates() {
  const [module, setModule] = useState("leave");

  const query = useQuery({
    queryKey: ["approval-template", module],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/approval-templates/${module}`);
      return res.data;
    },
    retry: false, // Don't retry on 404
  });

  return {
    module,
    setModule,
    template: query.data,
    isLoading: query.isLoading,
    notFound: query.error?.response?.status === 404, // Add this
  };
}