"use client";

import { useState, useEffect, useContext, createContext } from "react";

// Feature Flags Context
const FeatureFlagsContext = createContext({
  featureFlags: {},
  isLoading: true,
});

export function FeatureFlagsProvider({ children }) {
  const [featureFlags, setFeatureFlags] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch feature flags from your API
    const fetchFeatureFlags = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch("/api/feature-flags");
        // const data = await response.json();
        
        // Mock feature flags for now
        const mockFlags = {
          enable_recruitment: true,
          enable_training_module: true,
          enable_performance: true,
          enable_payroll: true,
          enable_time_tracking: true,
          enable_expenses: true,
          enable_assets: true,
          enable_integrity_reports: false, // Beta feature
          enable_ai_insights: false, // Not yet released
        };

        setFeatureFlags(mockFlags);
      } catch (error) {
        console.error("Failed to fetch feature flags:", error);
        setFeatureFlags({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatureFlags();

    // Optional: Set up polling for real-time updates
    // const interval = setInterval(fetchFeatureFlags, 60000); // Poll every minute
    // return () => clearInterval(interval);
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{ featureFlags, isLoading }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  return context;
}

// Helper function to check if a feature is enabled
export function useFeatureFlag(flagName) {
  const { featureFlags, isLoading } = useFeatureFlags();
  return {
    isEnabled: featureFlags[flagName] === true,
    isLoading,
  };
}