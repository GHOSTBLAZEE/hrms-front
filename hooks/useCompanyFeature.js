"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { QUERY_CONFIGS } from "@/config/queryConfig";

/* ----------------------------------------------------------------
 | Context
 |----------------------------------------------------------------*/
const CompanyFeatureContext = createContext({
  companyFeature: null,
  isLoading: true,
});

/* ----------------------------------------------------------------
 | Provider
 | Now uses useQuery — works because QueryClientProvider
 | is the outermost wrapper in providers.jsx
 |----------------------------------------------------------------*/
export function CompanyFeatureProvider({ children }) {
  const { data: companyFeature, isLoading } = useQuery({
    queryKey: ["company-current"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/companies/current");
      return res.data?.data ?? res.data ?? null;
    },
    ...QUERY_CONFIGS.STATIC,
    retry: 1,
    throwOnError: false,
  });

  return (
    <CompanyFeatureContext.Provider
      value={{ companyFeature: companyFeature ?? null, isLoading }}
    >
      {children}
    </CompanyFeatureContext.Provider>
  );
}

/* ----------------------------------------------------------------
 | Hook
 |----------------------------------------------------------------*/
export function useCompanyFeature() {
  const context = useContext(CompanyFeatureContext);
  if (context === undefined) {
    throw new Error(
      "useCompanyFeature must be used within a CompanyFeatureProvider"
    );
  }
  return context;
}