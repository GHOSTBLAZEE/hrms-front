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
 | Provider — replaces mock data with a real API call
 |
 | Endpoint: GET /api/v1/companies/current
 | Falls back gracefully if the endpoint doesn't exist yet.
 |----------------------------------------------------------------*/
export function CompanyFeatureProvider({ children }) {
  const { data: companyFeature, isLoading } = useQuery({
    queryKey: ["company-current"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/companies/current");
      return res.data?.data ?? res.data ?? null;
    },
    // Company settings almost never change mid-session — use STATIC config
    ...QUERY_CONFIGS.STATIC,
    // Don't throw on error — fall back to null so the app still renders
    retry: 1,
    throwOnError: false,
  });

  return (
    <CompanyFeatureContext.Provider value={{ companyFeature: companyFeature ?? null, isLoading }}>
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
    throw new Error("useCompanyFeature must be used within a CompanyFeatureProvider");
  }
  return context;
}