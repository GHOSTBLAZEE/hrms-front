"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { QUERY_CONFIGS } from "@/config/queryConfig";

/* ----------------------------------------------------------------
 | Context
 |----------------------------------------------------------------*/
const FeatureFlagsContext = createContext({
  featureFlags: {},
  isLoading: true,
});

/* ----------------------------------------------------------------
 | Provider — replaces hardcoded mock flags with real API data
 |
 | Endpoint: GET /api/v1/company/feature-flags  (or equivalent)
 | Falls back to an empty object so all features default to disabled
 | if the endpoint doesn't exist yet.
 |----------------------------------------------------------------*/
export function FeatureFlagsProvider({ children }) {
  const { data: featureFlags, isLoading } = useQuery({
    queryKey: ["company-feature-flags"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/company/feature-flags");
      return res.data?.data ?? res.data ?? {};
    },
    // Feature flags almost never change mid-session
    ...QUERY_CONFIGS.STATIC,
    retry: 1,
    throwOnError: false,
    // If your backend doesn't have this endpoint yet, return defaults
    // so sidebar/navigation still renders correctly
    placeholderData: {
      enable_payroll: true,
      enable_recruitment: false,
      enable_training_module: false,
      enable_performance: false,
      enable_time_tracking: false,
      enable_expenses: false,
      enable_assets: false,
      enable_integrity_reports: false,
      enable_ai_insights: false,
    },
  });

  return (
    <FeatureFlagsContext.Provider value={{ featureFlags: featureFlags ?? {}, isLoading }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

/* ----------------------------------------------------------------
 | Hook
 |----------------------------------------------------------------*/
export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  return context;
}

/* ----------------------------------------------------------------
 | Convenience helper for checking a single flag
 |----------------------------------------------------------------*/
export function useFeatureFlag(flagName) {
  const { featureFlags, isLoading } = useFeatureFlags();
  return {
    isEnabled: featureFlags[flagName] === true,
    isLoading,
  };
}