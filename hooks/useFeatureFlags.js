"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { QUERY_CONFIGS } from "@/config/queryConfig";

/* ----------------------------------------------------------------
 | Defaults — used as placeholder while loading and on API error
 |----------------------------------------------------------------*/
const DEFAULT_FLAGS = {
  enable_payroll:           true,
  enable_recruitment:       false,
  enable_training_module:   false,
  enable_performance:       false,
  enable_time_tracking:     false,
  enable_expenses:          false,
  enable_assets:            false,
  enable_integrity_reports: false,
  enable_ai_insights:       false,
};

/* ----------------------------------------------------------------
 | Context
 |----------------------------------------------------------------*/
const FeatureFlagsContext = createContext({
  featureFlags: DEFAULT_FLAGS,
  isLoading: true,
});

/* ----------------------------------------------------------------
 | Provider
 | Now uses useQuery — works because QueryClientProvider
 | is the outermost wrapper in providers.jsx
 |----------------------------------------------------------------*/
export function FeatureFlagsProvider({ children }) {
  const { data, isLoading } = useQuery({
    queryKey: ["company-feature-flags"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/company/feature-flags");
      return res.data?.data ?? res.data ?? DEFAULT_FLAGS;
    },
    ...QUERY_CONFIGS.STATIC,
    retry: 1,
    // On error fall back to defaults so the app still renders
    throwOnError: false,
    placeholderData: DEFAULT_FLAGS,
  });

  return (
    <FeatureFlagsContext.Provider
      value={{ featureFlags: data ?? DEFAULT_FLAGS, isLoading }}
    >
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
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider"
    );
  }
  return context;
}

/* ----------------------------------------------------------------
 | Convenience: check a single flag
 |----------------------------------------------------------------*/
export function useFeatureFlag(flagName) {
  const { featureFlags, isLoading } = useFeatureFlags();
  return {
    isEnabled: featureFlags[flagName] === true,
    isLoading,
  };
}